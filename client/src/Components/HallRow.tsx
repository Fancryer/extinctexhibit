import {Event,Hall}         from "../types";
import {useEffect,useState} from "react";
import InputLabel           from './InputLabel';
import {TimeSlot}           from './TimeSlot';

interface HallRowProps
{
	hallId?:number,
	events:Event[],
	halls:Hall[],
	setHallId:(id:number)=>void,
	setDateRange:(start:Date,end:Date)=>void
}

export type Interval=[number|null,Date,Date];

/**
 * @param events - incoming events
 * @param now
 */
function getAvailableTimeSlots(
	events:Event[],
	now:Date,
	minGapMinutes:number
):Interval[]
{
	const minPossibleDate=now;
	// according to ECMAScript spec, §15.9.1.1
	const maxPossibleDate=new Date(9999,11,31,12);

	const dateComparator=
		(a:Date,b:Date)=>a<b?-1:a>b?1:0;

	const addMinutesToDate=(date:Date,minutes:number):Date=>
		new Date(new Date(date).getTime()+minutes*60*1000);
	const subtractMinutesFromDate=(date:Date,minutes:number):Date=>
		new Date(new Date(date).getTime()-minutes*60*1000);

	function fillGaps(events:Event[],minGapMinutes:number):Interval[]
	{
		// Sort events based on the start time
		const sortedEvents=events.sort(
			({startTime:a},{startTime:b})=>dateComparator(new Date(a),new Date(b))
		);

		let filledIntervals:Interval[];
		if(events.length===0)
		{
			filledIntervals=[
				[null,minPossibleDate,maxPossibleDate]
			];
		}
		else if(events.length===1)
		{
			filledIntervals=[
				[
					null,
					addMinutesToDate(minPossibleDate,minGapMinutes),
					subtractMinutesFromDate(events[0].startTime,minGapMinutes)
				],
				[
					events[0].id,
					events[0].startTime,
					events[0].endTime
				],
				[
					null,
					addMinutesToDate(events[0].endTime,minGapMinutes),
					maxPossibleDate
				]
			];
		}
		else
		{
			filledIntervals=[
				// Заполняем интервалы между событиями с учётом minGapMinutes
				...sortedEvents.flatMap(({startTime},index,arr)=>{
					const end1=
						index===0
						?minPossibleDate
							// Добавляем minGap после предыдущего события
						:addMinutesToDate(arr[index-1].endTime,minGapMinutes);
					// Уменьшаем начало следующего события на minGap
					const start2=subtractMinutesFromDate(startTime,minGapMinutes);
					return fillBetween(end1,start2);
				}),
				// Добавляем интервалы самих событий
				...sortedEvents.map(
					({endTime,id,startTime})=>
						[
							id,
							subtractMinutesFromDate(startTime,minGapMinutes),
							addMinutesToDate(endTime,minGapMinutes)
						] as Interval
				),
				// Добавляем интервал после последнего события
				...fillBetween(
					addMinutesToDate(sortedEvents[sortedEvents.length-1].endTime,minGapMinutes),
					maxPossibleDate
				)
			].sort((a,b)=>dateComparator(a[1],b[1]))
			 .filter(([_,start,end])=>start<end);
		}
		return filledIntervals.sort((a,b)=>dateComparator(a[1],b[1]))
							  .filter(([_,start,end])=>start<end);
	}

	function fillBetween(end1:Date,start2:Date):Interval[]
	{
		return end1<start2?[[null,end1,start2]]:[];
	}

	return fillGaps(events,minGapMinutes);
}


// export function HallRow({hallId,events,halls,setHallId,setDateRange}:HallRowProps)
// {
// 	const myEvents=events.filter(e=>e.hall.id===hallId);
// 	const slots=getAvailableTimeSlots(myEvents,new Date(),5);
// 	console.log(slots)
// 	const [selectedIndex,setSelectedIndex]=useState<number|null>(null);
// 	return (
// 		<div>
// 			<InputLabel htmlFor="hall_id" value="Hall"/>
// 			{
// 				!halls.length
// 				?<div
// 					className="rounded-md bg-white shadow-sm border-red-500 border-2 h-[calc(42px)] ring-indigo-500 dark:bg-gray-900 dark:text-gray-300 dark:border-red-600 dark:ring-indigo-600 mt-1 flex w-full justify-center items-center">
// 					No halls available
// 				</div>
// 				:<select
// 					id="hall_id"
// 					className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block w-full"
// 					onChange={id=>setHallId(+id.target.value)}
// 					required
// 				>
// 					{halls.map(
// 						({id,name})=>
// 							<option key={id} value={id}>{name}</option>
// 					)}
// 				</select>
// 			}
// 			<div
// 				className="flex flex-col gap-2 bg-white border-[1px] p-2 mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 w-full">
// 				<div className="flex flex-row justify-between p-4 overflow-x-scroll">
// 					{
// 						slots.map(
// 							([id,start,end],index)=><TimeSlot key={id} id={id} isSelected={selectedIndex===index} onSlotSelect={()=>{
// 								setSelectedIndex(index);
// 								setDateRange(start,end);
// 							}} events={myEvents} start={start} end={end}/>)} </div>
// 			</div>
// 		</div>);
// }

export function HallRow({hallId,events,halls,setHallId,setDateRange}:HallRowProps)
{
	const myEvents=events.filter(e=>e.hall.id===hallId);
	const slots=getAvailableTimeSlots(myEvents,new Date(),5);
	const [selectedIndex,setSelectedIndex]=useState<number|null>(null);

	useEffect(()=>{
		setSelectedIndex(null); // Сбросить выделенный слот при изменении зала
	},[hallId]);

	const handleSlotSelect=(index:number,start:Date,end:Date)=>{
		setSelectedIndex(index);
		setDateRange(start,end);
	};

	return (
		<div>
			<InputLabel htmlFor="hall_id" value="Hall"/>
			<select
				id="hall_id"
				className="rounded-md border-gray-300 shadow-sm"
				onChange={e=>setHallId(+e.target.value)}
				required
			>
				<option value="">Select a hall</option>
				{halls.map(({id,name},index)=>(
					<option key={index} value={id}>
						{name}
					</option>
				))}
			</select>
			<div className="flex flex-col gap-2 mt-4">
				<div className="flex flex-row justify-between overflow-x-scroll">
					{slots.map(([id,start,end],index)=>(
						<TimeSlot
							key={index}
							id={id}
							events={myEvents}
							start={start}
							end={end}
							isSelected={selectedIndex===index}
							onSlotSelect={()=>handleSlotSelect(index,start,end)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}


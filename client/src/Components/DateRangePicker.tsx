import {ChangeEvent,useEffect,useState} from 'react';
import InputLabel                       from './InputLabel';
import TextInput                        from './TextInput';
import {CreateEventsFormState}          from "../routes/events/create.tsx";
import {UseFormRegister}                from "react-hook-form";

interface DateRangePickerProps
{
	minDate:string,
	maxDate:string,
	onChange:(startDate:string,endDate:string)=>void,
	formatDateToInput:(date:Date)=>string,
	register:UseFormRegister<CreateEventsFormState>,
	className?:string,
	disabled?:boolean
}

export default function DateRangePicker(
	{minDate,maxDate,onChange,register,className='',disabled=false}:DateRangePickerProps
)
{
	const [localStartDate,setLocalStartDate]=useState(minDate);
	const [localEndDate,setLocalEndDate]=useState(maxDate);
	console.debug('localStartDate: ',localStartDate);
	console.debug('localEndDate: ',localEndDate);
	useEffect(
		()=>{
			setLocalStartDate(minDate);
			setLocalEndDate(maxDate);
		},
		[minDate,maxDate]
	);

	const handleStartDateChange=(e:ChangeEvent<HTMLTextAreaElement|HTMLInputElement>)=>{
		const newStartDate=new Date(e.target.value).toISOString().slice(0,-8);
		setLocalStartDate(newStartDate);

		// Проверяем, что начальная дата не позже конечной
		if(newStartDate<=localEndDate)
		{
			onChange(newStartDate,localEndDate);
		}
		else
		{
			onChange(newStartDate,newStartDate);
			setLocalEndDate(newStartDate);
		}
	};

	const handleEndDateChange=(e:ChangeEvent<HTMLTextAreaElement|HTMLInputElement>)=>{
		const newEndDate=new Date(e.target.value).toISOString().slice(0,-8);
		setLocalEndDate(newEndDate);

		// Проверяем, что конечная дата не раньше начальной
		if(newEndDate>=localStartDate)
		{
			onChange(localStartDate,newEndDate);
		}
		else
		{
			console.log({localStartDate,newEndDate})
			// e.target.setCustomValidity('End date cannot be earlier than start date');
			onChange(newEndDate,newEndDate);
			setLocalStartDate(newEndDate);
		}
	};
	return (
		<div className={`flex space-x-4 ${className}`}>
			<div>
				<InputLabel
					htmlFor="start-date"
					className="block text-sm font-medium text-gray-700"
				>
					Start Date
				</InputLabel>
				{
					disabled
					?<input
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						disabled
					>
					</input>
					:<input
						id="start-date"
						type="datetime-local"
						value={localStartDate}
						min={minDate}
						onChange={handleStartDateChange}
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						required
					/>
				}
			</div>
			<div>
				<InputLabel
					htmlFor="end-date"
					className="block text-sm font-medium text-gray-700"
				>
					End Date
				</InputLabel>
				{
					disabled
					?<input
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						disabled
					>
					</input>
					:<TextInput
						id="end-date"
						type="datetime-local"
						value={localEndDate}
						min={localStartDate}
						max={maxDate}
						onChange={handleEndDateChange}
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						required
					/>
				}
			</div>
		</div>
	);
}
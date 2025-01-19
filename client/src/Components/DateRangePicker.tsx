import {ChangeEvent,useEffect,useState} from 'react';
import InputLabel                       from './InputLabel';
import TextInput                        from './TextInput';

interface DateRangePickerProps
{
	minDate:string,
	maxDate:string,
	onChange:(startDate:string,endDate:string)=>void,
	formatDateToInput:(date:Date)=>string,
	className?:string,
	disabled?:boolean
}

export default function DateRangePicker(
	{minDate,maxDate,onChange,className='',disabled=false}:DateRangePickerProps
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
		const newStartDate=e.target.value;
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
		const newEndDate=e.target.value;
		setLocalEndDate(newEndDate);

		// Проверяем, что конечная дата не раньше начальной
		if(newEndDate>=localStartDate)
		{
			onChange(localStartDate,newEndDate);
		}
		else
		{
			e.target.setCustomValidity('End date cannot be earlier than start date');
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
					!disabled
					?<TextInput
						id="start-date"
						type="datetime-local"
						value={!disabled?localStartDate:'--'}
						min={minDate}
						onChange={handleStartDateChange}
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						required
						disabled={disabled}
					/>
					:<input
						className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						disabled
					>
					</input>
				}
			</div>
			<div>
				<InputLabel
					htmlFor="end-date"
					className="block text-sm font-medium text-gray-700"
				>
					End Date
				</InputLabel>
				<TextInput
					id="end-date"
					type="datetime-local"
					value={!disabled?localEndDate:'--'}
					min={localStartDate}
					max={maxDate}
					onChange={handleEndDateChange}
					className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					required
					disabled={disabled}
				/>
			</div>
		</div>
	);
}
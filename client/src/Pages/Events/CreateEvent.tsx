import React,{useState}    from 'react';
import {Head}              from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {useForm}          from '@inertiajs/react';
import {FormEventHandler} from 'react';
import InputLabel         from '@/Components/InputLabel';
import TextInput          from '@/Components/TextInput';
import PrimaryButton      from '@/Components/PrimaryButton';
import InputError         from '@/Components/InputError';
import TextareaInput      from '@/Components/TextAreaInput';
import {Transition}       from '@headlessui/react';
import {useDateString}    from '@/Components/UserGuard';
import DateRangePicker    from '@/Components/DateRangePicker';
import {Hall,Event}       from '@/types';
import {HallRow}          from '@/Components/Timeline';

interface CreateEventProps
{
	incoming_events:Event[],
	halls:Hall[]
}

interface CreateEventFormState
{
	organizer:string,
	hall_id?:number,
	title:string,
	description:string,
	start_time:string,
	end_time:string
}

export default function CreateEvent({incoming_events,halls}:CreateEventProps)
{
	const now=useDateString();
	const hallsArePresented=halls.length>0;
	console.debug('incoming events: ',incoming_events);
	const formatDateToInput=(date:Date)=>
		date.toISOString().slice(0,-8);
	const [minDate,setMinDate]=useState(now);
	const [maxDate,setMaxDate]=useState(now);
	const {data,setData,post,errors,processing,recentlySuccessful}=
		useForm<CreateEventFormState>(
			{
				organizer:  '',
				hall_id:    halls.at(0)?.id,
				title:      '',
				description:'',
				// min_date:   minDate,
				// max_date:   maxDate,
				start_time:minDate,
				end_time:  maxDate
			}
		);
	console.debug('data: ',data);
	const submit:FormEventHandler=e=>{
		e.preventDefault();
		console.debug('Submitting form data:',{
			...data,
			start_time:data.start_time.replace('T',' '),
			end_time:  data.end_time.replace('T',' ')
		});
		post(route('events.store',{
			...data,
			start_time:data.start_time.replace('T',' '),
			end_time:  data.end_time.replace('T',' ')
		}));
	};

	return (
		<AuthenticatedLayout
			header={<div>Create Event</div>}
			isCentered
		>
			<Head title="Create Event"/>
			<section>
				<header>
					<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
						Create Event
					</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Fill out the details for the new event.
					</p>
				</header>
				<form onSubmit={submit} className="mt-6 space-y-6">
					<div>
						<InputLabel htmlFor="organizer" value="Organizer"/>
						<TextInput
							id="organizer"
							name="organizer"
							className="mt-1 block w-full"
							value={data.organizer}
							maxLength={255}
							onChange={e=>setData('organizer',e.target.value)}
							required
							disabled={!hallsArePresented}
						/>
						<InputError className="mt-2" message={errors.organizer}/>
					</div>
					<HallRow
						hallId={data.hall_id}
						events={incoming_events}
						halls={halls}
						setHallId={id=>setData('hall_id',id)}
						setDateRange={
							(start,end)=>{
								const formattedStart=formatDateToInput(start);
								const formattedEnd=formatDateToInput(end);
								setMinDate(formattedStart);
								setMaxDate(formattedEnd);
								console.debug('set date range: ',formattedStart,formattedEnd);
							}
						}
					/>
					<DateRangePicker
						minDate={minDate}
						maxDate={maxDate}
						onChange={
							(startTime,endTime)=>{
								setData('start_time',startTime);
								setData('end_time',endTime);
							}
						}
						formatDateToInput={formatDateToInput}
						disabled={!hallsArePresented}
					/>
					<div>
						<InputLabel htmlFor="title" value="Title"/>
						<TextInput
							id="title"
							name="title"
							className="mt-1 block w-full"
							value={data.title}
							onChange={e=>setData('title',e.target.value)}
							required
							disabled={!hallsArePresented}
						/>
						<InputError className="mt-2" message={errors.title}/>
					</div>
					<div>
						<InputLabel htmlFor="description" value="Description"/>
						<TextareaInput
							id="description"
							name="description"
							className="mt-1 block w-full"
							value={data.description}
							onChange={e=>setData('description',e.target.value)}
							required
							disabled={!hallsArePresented}
						/>
						<InputError className="mt-2" message={errors.description}/>
					</div>
					<div className="flex items-center gap-4">
						<PrimaryButton disabled={!hallsArePresented||processing}>Save</PrimaryButton>
						<Transition
							show={recentlySuccessful}
							enter="transition ease-in-out"
							enterFrom="opacity-0"
							leave="transition ease-in-out"
							leaveTo="opacity-0"
						>
							<p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
						</Transition>
					</div>
				</form>
			</section>
		</AuthenticatedLayout>
	);
}
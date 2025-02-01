import {createFileRoute,Link,useRouter}             from '@tanstack/react-router';
import AuthenticatedLayout                          from '../../Layouts/AuthenticatedLayout';
import {hasPermissionInRoles}                       from '../../Pages/FindPermissionsInRoles';
import EventsList                                   from "../../Pages/Events/EventsList.tsx";
import {Event,Hall}                                 from '../../types';
import {Dispatch,SetStateAction,useEffect,useState} from 'react';
import api,{extractData}                            from '../../api.tsx';
import {useAuth}                                    from "../../Components/AuthProvider.tsx";

export const Route=createFileRoute('/events/')({component:EventsIndex})

type EventFilterType=
	|'past'
	|'present'
	|'future'
	;

export type EventFilter={
	[key in EventFilterType]:boolean
};

function eventFilterToByte(filter:EventFilter):number
{
	let byte=0;
	if(filter.past) byte|=1<<0;
	if(filter.present) byte|=1<<1;
	if(filter.future) byte|=1<<2;
	return byte;
}

export default function EventsIndex()
{
	const router=useRouter();
	const [events,setEvents]=useState<Event[]>([]);
	const [halls,setHalls]=useState<Hall[]>([]);
	const [eventFilter,setEventFilter]=useState<EventFilter>(
		{
			past:   true,
			present:true,
			future: true
		}
	);
	const fetchEvents=async()=>
		await api.get<Event[]>(
			'events',
			{
				params:{
					filter:eventFilterToByte(eventFilter),
					now:   new Date().toISOString()
				}
			}
		).then(extractData).then(setEvents);
	const fetchHalls=async()=>
		await api.get<Hall[]>('halls').then(extractData).then(setHalls);
	useEffect(()=>{
		fetchEvents().then();
		fetchHalls().then();
	},[router,eventFilter]);
	return (
		<AuthenticatedLayout
			header={
				<div>
					<section>
						<div className="space-y-2 p-2 max-w-4xl mx-auto">
							<h2 className="text-xl font-semibold text-gray-700 mb-4">Event Filters</h2>
						</div>
					</section>
				</div>
			}
			elseRedirectToLogin={false}
			// isCentered
		>
			<EventsIndexInner
				events={events}
				halls={halls}
				eventFilter={eventFilter}
				setEventFilter={setEventFilter}
				onEventDelete={async()=>fetchEvents().then(fetchHalls)}
			/>
		</AuthenticatedLayout>
	);
}

interface EventsIndexInnerProps
{
	events:Event[],
	halls:Hall[],
	eventFilter:EventFilter,
	setEventFilter:Dispatch<SetStateAction<EventFilter>>,
	onEventDelete:()=>Promise<void>
}

function EventsIndexInner({events,halls,eventFilter,setEventFilter,onEventDelete}:EventsIndexInnerProps)
{
	const {auth:{user,roles}}=useAuth();
	const eventsArePresented=events.length>0;
	const hallsArePresented=halls.length>0;
	const userCanCreateEvent=hasPermissionInRoles(user,roles,'create events');
	const updateEventFilter=
		<T extends EventFilterType>(key:T,value:boolean)=>
			setEventFilter(prev=>({...prev,[key]:value}));
	const getFilterLabel=
		<T extends EventFilterType>(filter:T)=>
			filter==='past'
			?'Past'
			:filter==='present'
			 ?'Present'
			 :'Future';
	return (
		<div className="py-12">
			<div className="mx-auto max-w-full sm:px-6 lg:px-8">
				<div className="flex flex-col overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
					<div className="flex flex-wrap gap-6 p-6">
						{Object.entries(eventFilter).map(([key,value])=>(
							<div key={key} className="flex items-center space-x-3">
								<input
									id={key}
									type="checkbox"
									checked={value}
									className="h-5 cursor-pointer w-5 rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-300"
									onChange={e=>updateEventFilter(key as EventFilterType,e.target.checked)}
								/>
								<label htmlFor={key} className="text-gray-600 font-medium">
									{getFilterLabel(key as EventFilterType)}
								</label>
							</div>
						))}
					</div>
					{eventsArePresented&&<EventsList events={events} onEventDelete={onEventDelete}/>}
					{
						userCanCreateEvent
						&&hallsArePresented
						&&<div className="p-4 dark:bg-gray-800 transition-shadow w-36 self-end">
                            <Link
                                className="rounded-lg"
                                to="/events/create"
                            >
                                Add event
                            </Link>
                        </div>
					}
				</div>
			</div>
		</div>
	)
}
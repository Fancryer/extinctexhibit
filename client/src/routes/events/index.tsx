import {createFileRoute,useRouter} from '@tanstack/react-router';

import AuthenticatedLayout    from '../../Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import findPermissionsInRoles from '../../Pages/FindPermissionsInRoles';
import EventsList             from "../../Pages/Events/EventsList.tsx";
import {Event,Hall}           from '../../types';
import {useEffect,useState}   from 'react';
import api,{extractData}      from '../../api.tsx';
import {useAuth}              from "../../Components/AuthProvider.tsx";

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
	const {auth:{user,roles}}=useAuth();
	if(!user) router.navigate({from:'/events',to:'/auth/login'});

	const [events,setEvents]=useState<Event[]>([]);
	const [halls,setHalls]=useState<Hall[]>([]);
	const [eventFilter,setEventFilter]=useState<EventFilter>(
		{
			past:   true,
			present:true,
			future: true
		}
	);

	useEffect(()=>{
		const fetchEvents=async()=>
			await api.get<Event[]>(
				'events',
				{
					params:{
						filter:eventFilterToByte(eventFilter),
						now:   new Date().toISOString()
					}
				}
			).then(extractData);
		const fetchHalls=async()=>
			await api.get<Hall[]>('halls').then(extractData);
		fetchEvents().then(n=>setEvents(n));
		fetchHalls().then(n=>setHalls(n));
		// setFilteredEvents(filterEvents(eventFilter));
	},[router,user,roles,eventFilter]);
	const eventsArePresented=events.length>0;
	const hallsArePresented=halls.length>0;
	const [userCanCreateEvent,userCanCreateHall]=findPermissionsInRoles(user,roles,['create events','create halls']);
	const updateEventFilter=
		<T extends EventFilterType>(key:T,value:boolean)=>
			setEventFilter(prev=>({...prev,[key]:value}));

	const getFilterLabel=<T extends EventFilterType>(filter:T)=>
	{
		return filter==='past'
			   ?'Past'
			   :filter==='present'
				?'Present'
				:'Future';
	};

	const header=
		<div>
			{
				userCanCreateEvent
				&&hallsArePresented
				?<ResponsiveNavLink
					// href={'events.create'}
				>
					{eventsArePresented?'Add new event':'There are no events yet, but you can add one...'}
				</ResponsiveNavLink>
				:(
					userCanCreateEvent
					&& !hallsArePresented
					&&userCanCreateHall
					?<ResponsiveNavLink
						// href={route('halls.create')}
					>
						Neither events nor halls are presented yet, but you can add a hall now...
					</ResponsiveNavLink>
					:null
				)
			}
			<section>
				<div className="space-y-4 p-6 max-w-4xl mx-auto">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">Event Filters</h2>
					<div className="flex flex-wrap gap-6">
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
				</div>
			</section>
		</div>
	return (
		<AuthenticatedLayout
			header={header}
			isCentered
		>
			{/*<Head title="Events"/>*/}
			{
				events.length>0
				&&<div className="py-12">
                    <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                        <div className="flex flex-col overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <EventsList events={events} user={user} roles={roles}/>
							{
								userCanCreateEvent
								&&hallsArePresented
								&&<div className="p-4 dark:bg-gray-800 transition-shadow w-36 self-end">
                                    <ResponsiveNavLink
                                        className="rounded-lg"
										// href={route('events.create')}
                                    >
                                        Add event
                                    </ResponsiveNavLink>
                                </div>
							}
                        </div>
                    </div>
                </div>
			}
		</AuthenticatedLayout>
	)
}
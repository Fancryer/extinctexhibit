import {createFileRoute,useRouter} from '@tanstack/react-router'
import React,{useEffect,useState}  from "react";
import {useAuth}                   from '../../Components/AuthProvider';
import {Event,Hall}                from "../../types";
import AuthenticatedLayout         from "../../Layouts/AuthenticatedLayout.tsx";
import ParticipantsList            from "../../Pages/Participants/ParticipantsList.tsx";
import api,{extractData}           from "../../api.tsx";

export const Route=
	createFileRoute('/participants/')({component:ParticipantsIndex});

function ParticipantsIndex()
{
	return (
		<AuthenticatedLayout
			isCentered
			header={<div>
				<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
					Participants
				</h2>
			</div>}
		>
			{/*<Head title="ParticipantsIndex"/>*/}
			<ParticipantsIndexInner/>
		</AuthenticatedLayout>
	);
}

function ParticipantsIndexInner()
{
	const {auth:{user,roles}}=useAuth();
	const [events,setEvents]=useState<Event[]>([]);
	const router=useRouter();
	useEffect(()=>{
		const fetchEvents=async()=>{
			try
			{
				await api.get<Event[]>('events')
						 .then(extractData)
						 .then(setEvents);
			}
			catch(error)
			{
				console.error('Error fetching events:',error);
			}
		};
		(async()=>await fetchEvents())();
	},[router,user,roles]);
	const eventsArePresent=events.length>0;
	return (
		eventsArePresent
		?<div className="py-12">
			<div className="mx-auto max-w-full sm:px-6 lg:px-8">
				<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
					<ParticipantsList events={events} roles={roles} user={user}/>
				</div>
			</div>
		</div>
		:null
	);
}
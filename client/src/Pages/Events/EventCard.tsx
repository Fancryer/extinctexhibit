import {useEffect,useState}   from 'react';
import {Auth,Event}           from '../../types';
import findPermissionsInRoles from '../FindPermissionsInRoles';
import EventCardPostOpen      from './EventCardPostOpen';
import EventCardPreOpen       from './EventCardPreOpen';
import api,{extractData}      from "../../api.tsx";
import {useAuth}              from "../../Components/AuthProvider.tsx";
import {makePayload}          from "../payload.ts";
import Cookies                from "js-cookie";

interface EventCardProps
{
	event:Event,
	onEventDelete:()=>Promise<void>
}

export const truncate=(text:string,maxLength:number)=>
	text.length>maxLength-3
	?`${text.slice(0,maxLength-3).trimEnd()}...`
	:text;

export default function EventCard(
	{event,onEventDelete}:EventCardProps
)
{
	const {auth:{user,roles,state}}=useAuth();
	const {hall,title,description}=event;
	const [isOpen,setIsOpen]=useState(false);

	const [participates,setParticipates]=useState(false);
	const [canParticipate,setCanParticipate]=useState(false);
	useEffect(()=>{
		if(!user&&state=='ready')
		{
			setCanParticipate(false);
			setParticipates(false);
			return;
		}
		api.get<boolean>(
			'participants/participates',
			{
				params:{
					accessToken:Cookies.get('accessToken')||'',
					eventId:    event.id
				}
			}
		).then(
			extractData
		).then(
			data=>{
				setParticipates(Boolean(data));
				setCanParticipate(
					!data
					&&new Date(event.startTime)<=new Date()
					&&new Date(event.endTime)>=new Date()
				);
			}
		);
	},[event]);
	return (
		<div className="p-4 rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow bg-white w-96 max-w-lg mx-auto">
			<EventCardPreOpen
				event={{
					...event,
					title:      truncate(title,48),
					description:truncate(description,42)
				}}
				participates={participates}
				canParticipate={canParticipate}
				setIsOpen={setIsOpen}
				onEventDelete={onEventDelete}
			/>
			<EventCardPostOpen
				event={event}
				participates={participates}
				canParticipate={canParticipate}
				open={isOpen}
				onClose={()=>setIsOpen(false)}
			/>
		</div>
	)
}
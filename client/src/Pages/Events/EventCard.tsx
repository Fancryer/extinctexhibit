import {useEffect,useState}   from 'react';
import {Auth,Event}           from '../../types';
import findPermissionsInRoles from '../FindPermissionsInRoles';
import EventCardPostOpen      from './EventCardPostOpen';
import EventCardPreOpen       from './EventCardPreOpen';
import api                    from "../../api.tsx";
import {useAuth}              from "../../Components/AuthProvider.tsx";

interface EventCardProps
{
	event:Event
}

export const truncate=(text:string,maxLength:number)=>
	text.length>maxLength-3
	?`${text.slice(0,maxLength-3).trimEnd()}...`
	:text;

export default function EventCard(
	{event}:EventCardProps
)
{
	const {auth:{user,roles}}=useAuth();
	const [userCanEditNews,userCanDeleteNews,userCanCreateComments]=
		findPermissionsInRoles(user,roles,['edit news','delete news','create comments']);
	const {id,organizer,hall,title,description,start_time,end_time}=event;
	const [isOpen,setIsOpen]=useState(false);

	const [participates,setParticipates]=useState(false);
	const [canParticipate,setCanParticipate]=useState(false);
	useEffect(()=>{
		if(!user)
		{
			setCanParticipate(false);
			setParticipates(false);
			return;
		}
		api.get<boolean>(
			'participants/participates',
			{
				params:{
					event_id:event.id,
					user_id: user.id
				}
			}
		).then(
			({data})=>{
				setParticipates(Boolean(data));
				setCanParticipate(
					!data
					&&new Date(event.start_time)<=new Date()
					&&new Date(event.end_time)>=new Date()
				);
			}
		);
	},[event]);
	return (
		<div className="p-4 rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow bg-white w-96 max-w-lg mx-auto">
			<EventCardPreOpen
				event={event}
				user={user}
				title={truncate(title,48)}
				organizer={organizer}
				description={truncate(description,42)}
				start_time={start_time}
				end_time={end_time}
				participates={participates}
				canParticipate={canParticipate}
				setIsOpen={setIsOpen}
				userCanEditEvents={userCanEditNews}
				userCanDeleteEvents={userCanDeleteNews}
			/>
			<EventCardPostOpen
				event={event}
				user={user}
				title={title}
				hall={hall}
				organizer={organizer}
				description={description}
				startTime={start_time}
				endTime={end_time}
				participates={participates}
				canParticipate={canParticipate}
				open={isOpen}
				onClose={()=>setIsOpen(false)}
			/>
		</div>
	)
}
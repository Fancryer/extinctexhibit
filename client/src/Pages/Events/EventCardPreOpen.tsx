import ResponsiveNavLink         from '../../Components/ResponsiveNavLink';
import {Event}                   from '../../types';
import {BiUserCheck,BiUserPlus}  from 'react-icons/bi';
import findPermissionsInRoles    from "../FindPermissionsInRoles.ts";
import {useAuth}                 from "../../Components/AuthProvider.tsx";
import {Link,useRouter}          from "@tanstack/react-router";
import React,{MouseEventHandler} from "react";
import api                       from "../../api.tsx";

interface EventCardPreOpenProps
{
	setIsOpen:(open:boolean)=>void,
	event:Event,
	participates:boolean,
	canParticipate:boolean,
	onEventDelete:()=>Promise<void>
}

export default function EventCardPreOpen(
	{
		setIsOpen,
		event,
		participates,
		canParticipate,
		onEventDelete
	}:EventCardPreOpenProps
)
{
	const {auth:{user,roles}}=useAuth();
	const router=useRouter();
	const [userCanEditEvents,userCanDeleteEvents]=
		findPermissionsInRoles(user,roles,['edit events','delete events']);
	const countEventParticipants=
		(event:Event):number=>
			event.participants
				 .map(p=>p.escorts.length+1)
				 .reduce((a,b)=>a+b,0);
	const dateToGbDate=(date:Date)=>
		date.toLocaleDateString("en-GB",{hour:"2-digit",minute:"2-digit"})
	const localizedStartTime=dateToGbDate(new Date(event.startTime));
	const localizedEndTime=dateToGbDate(new Date(event.endTime));

	async function handleDelete(e:React.MouseEvent<HTMLButtonElement>)
	{
		e.preventDefault();
		console.debug('deleting event: ',event);
		await api.delete(`/events/${event.id}`)
				 .then(async()=>{
					 await onEventDelete();
					 await router.navigate({replace:true});
				 })
	}

	return <div className="flex flex-col h-full">
		<div className="flex flex-col justify-evenly h-full">
			{
				participates
				&&<BiUserCheck className="self-end" size="1.5em"/>
			}
			{
				!participates
				&&canParticipate
				&&<BiUserPlus
                    onClick={()=>setIsOpen(true)}
                    className="self-start cursor-pointer"
                    size="1.5em"
                />
			}
			<button onClick={()=>setIsOpen(true)}>
				<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
					{event.title} by {event.organizer}
				</h2>
			</button>
			<div className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
				{event.description}
			</div>
			<div className="text-gray-700 dark:text-gray-300 mb-4 flex flex-row justify-between">
				<div>Participants:</div>
				{`${countEventParticipants(event)} / ${event.hall.capacity}`}
			</div>
			<small className="flex justify-between mt-auto text-sm text-gray-500 dark:text-gray-400">
				<div>{localizedStartTime}</div>
				<span>-</span>
				<div>{localizedEndTime}</div>
			</small>
		</div>
		{
			<div className="mt-4 flex flex-row justify-between">
				{
					userCanDeleteEvents
					&&<div>
                        <button
                            className="rounded-lg p-1 bg-red-200 hover:bg-red-300 text-red-900"
                            onClick={handleDelete}
                            children="Delete"
                        />
                    </div>
				}
			</div>
		}
	</div>;
}
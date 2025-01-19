import ResponsiveNavLink from '../../Components/ResponsiveNavLink';
import {Auth,Event}      from '../../types';
import React             from 'react';
import {TbBrandTabler}   from 'react-icons/tb';
import {GiCheckedShield}                                                                            from 'react-icons/gi';
import {BiCheck,BiSolidUserCheck,BiUserCheck,BiUserCircle,BiUserPin,BiUserPlus,BiUserVoice,BiUserX} from 'react-icons/bi';
import {MdEvent,MdEventAvailable}                                                                   from 'react-icons/md';
import {AiOutlineQuestion} from 'react-icons/ai';

interface EventCardPreOpenProps
{
	setIsOpen:(open:boolean)=>void,
	event:Event,
	user:Auth['user']|null,
	organizer:string,
	title:string,
	description:string,
	start_time:string,
	end_time:string,
	userCanEditEvents:boolean,
	userCanDeleteEvents:boolean,
	participates:boolean,
	canParticipate:boolean
}

export default function EventCardPreOpen(
	{
		setIsOpen,
		event,
		user,
		organizer,
		title,
		description,
		start_time,
		end_time,
		userCanEditEvents,
		userCanDeleteEvents,
		participates,
		canParticipate
	}:EventCardPreOpenProps
)
{
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
					{title} by {organizer}
				</h2>
			</button>
			<div className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
				{description}
			</div>
			<div className="text-gray-700 dark:text-gray-300 mb-4 flex-grow self-center">
				{`${event.participants.length} / ${event.hall.capacity}`}
			</div>
			<small className="flex justify-between mt-auto text-sm text-gray-500 dark:text-gray-400">
				<div>{start_time}</div>
				<span>-</span>
				<div>{end_time}</div>
			</small>
		</div>
		{
			<div className="mt-4 flex flex-row justify-between">
				{
					userCanDeleteEvents
					&&<div>
						<ResponsiveNavLink
							className="rounded-lg bg-red-200 hover:bg-red-300"
							// href={route('events.delete',{event:event.id})}
							children="Delete"
						/>
					</div>
				}
				{
					userCanEditEvents
					&&(new Date()<=new Date(start_time))
					&&<div>
						<ResponsiveNavLink
							className="rounded-lg bg-violet-200 hover:bg-violet-300"
							// href={route('events.edit',{event:event.id})}
							children="Edit"
						/>
					</div>
				}
			</div>
		}
	</div>
		;
}
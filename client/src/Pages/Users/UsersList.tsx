import ResponsiveNavLink                             from '@/Components/ResponsiveNavLink';
import findPermissionsInRoles,{hasPermissionInRoles} from '@/Pages/FindPermissionsInRoles';
import {Event,Auth}     from '@/types';
import React,{useState} from 'react';

interface ParticipantsListProps
{
	users:Auth['user'][];
	user:Auth['user'];
	roles:Auth['roles'];
}

export default function UsersList({users,user:me,roles}:ParticipantsListProps)
{
	const [userCanDeleteUsers,userCanEditUsers]=findPermissionsInRoles(me,roles,['delete users','edit users']);
	// Функция для обрезания текста с эллипсисом
	const truncate=(text:string,maxLength:number)=>
		text.length>maxLength-3
		?`${text.slice(0,maxLength-3)}...`
		:text;

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 p-6">
			{users.map((user,i)=>{
				const {email,email_verified_at,id,name,prosoponym}=user;
				return (
					<div
						key={i}
						className="p-4 rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow bg-white max-w-md mx-auto"
					>
						<div>
							<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
								Prosoponym {prosoponym}
							</h2>
							<div className="text-gray-700 dark:text-gray-300 mb-4">
								Id: {id}
							</div>
							<div className="text-gray-700 dark:text-gray-300 mb-4">
								Name: {name}
							</div>
							<div className="text-gray-700 dark:text-gray-300 mb-4">
								Email: {email}
							</div>
							<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
								Email verified: {email_verified_at}
							</small>
							<div className="flex flex-row">
								{
									userCanDeleteUsers
									&&(id!=me.id)
									&&<ResponsiveNavLink
										className="rounded-lg bg-red-200 hover:bg-red-300"
										href={route('users.delete',{user:id})}
									>
										Delete
									</ResponsiveNavLink>
								}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

interface ParticipantAccordionProps
{
	participants:number[]
}

function ParticipantAccordion({participants}:ParticipantAccordionProps)
{
	const [open,setOpen]=useState(false);

	return (
		<div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow">
			<div
				onClick={()=>{
					setOpen(previousState=>!previousState);
				}}
				className="flex justify-between items-center cursor-pointer"
			>
				<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
					Participants
				</h2>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
			{
				open
				&&participants.map(participant=>(
					<div
						key={participant}
						className="text-gray-700 dark:text-gray-300 mb-4"
					>
						{participant}
					</div>
				))
			}
		</div>
	);
}
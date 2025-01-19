import {Head,usePage}         from '@inertiajs/react';
import NewsList               from '@/Pages/News/NewsList';
import React                  from 'react';
import AuthenticatedLayout    from '@/Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '@/Components/ResponsiveNavLink';
import {hasPermissionInRoles} from '@/Pages/FindPermissionsInRoles';
import {Comment,Event,User}   from '@/types';
import ParticipantsList       from '@/Pages/Participants/ParticipantsList';

export interface NewsItem
{
	id:number;
	title:string;
	content:string;
	created_at:string;
	cover_url?:string;
	comments:[Comment];
}

interface ParticipantsIndexProps
{
	events:Event[];
}

export default function ParticipantsIndex({events}:ParticipantsIndexProps)
{
	const {user,roles}=usePage().props.auth;
	const eventsArePresent=events.length>0;
	console.debug('Events: ',events);
	return <AuthenticatedLayout isCentered>
		<Head title="ParticipantsIndex"/>
		{
			eventsArePresent
			&&<div className="py-12">
				<div className="mx-auto max-w-full sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
						<ParticipantsList events={events} roles={roles} user={user}/>
					</div>
				</div>
			</div>
		}
	</AuthenticatedLayout>;
}
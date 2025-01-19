import {Head,usePage}         from '@inertiajs/react';
import NewsList               from '@/Pages/News/NewsList';
import React                  from 'react';
import AuthenticatedLayout    from '@/Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '@/Components/ResponsiveNavLink';
import {hasPermissionInRoles} from '@/Pages/FindPermissionsInRoles';
import {Comment,Event,User}   from '@/types';
import ParticipantsList       from '@/Pages/Participants/ParticipantsList';
import UsersList              from '@/Pages/Users/UsersList';

interface UsersIndexProps
{
	users:User[];
}

export default function UsersIndex({users}:UsersIndexProps)
{
	const {user,roles}=usePage().props.auth;
	const eventsArePresent=users.length>0;
	console.debug('Users: ',users);
	return <AuthenticatedLayout isCentered>
		<Head title="ParticipantsIndex"/>
		{
			eventsArePresent
			&&<div className="py-12">
				<div className="mx-auto max-w-full sm:px-6 lg:px-8">
					<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
						<UsersList users={users} roles={roles} user={user}/>
					</div>
				</div>
			</div>
		}
	</AuthenticatedLayout>;
}
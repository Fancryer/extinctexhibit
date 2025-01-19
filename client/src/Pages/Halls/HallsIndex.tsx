import AuthenticatedLayout    from '../../Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import {Hall}                 from '../../types';
import HallsList              from '../../Pages/Halls/HallsList';
import findPermissionsInRoles from '../../Pages/FindPermissionsInRoles';
import {Auth}                 from "../../types";

interface HallsIndexProps
{
	halls:Hall[],
	auth:Auth
}

export default function HallsIndex({halls,auth}:HallsIndexProps)
{
	const hallsArePresent=halls.length>0;
	const {user,roles}=auth;

	const [userCanCreateHall]=findPermissionsInRoles(user,roles,['create halls']);

	// const userCanDeleteHall=user&&roles.some(
	// 	({permissions})=>permissions.includes('delete halls')
	// );
	return <AuthenticatedLayout
		isCentered
		header={
			!hallsArePresent
			&&userCanCreateHall
			&&<div>
                <ResponsiveNavLink
					// href={route('halls.create')}
				>
                    There is no halls yet, but you can add one...
                </ResponsiveNavLink>
                <ResponsiveNavLink
					// href={route('halls.reseed')}
				>
                    ...or you can restore default halls. How did you even manage to delete all of them, you poor soul?
                </ResponsiveNavLink>
            </div>
		}>
		{/*<Head title="NewsIndex"/>*/}
		{
			hallsArePresent
			&&<div className="py-12">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="flex flex-col overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <HallsList halls={halls} user={user} roles={roles}/>
						{
							hallsArePresent
							&&userCanCreateHall
							&&<div className="p-4 dark:bg-gray-800 transition-shadow w-36 self-end">
                                <ResponsiveNavLink
                                    className="rounded-lg"
                                    // href={route('halls.create')}
                                >
                                    Add hall
                                </ResponsiveNavLink>
                            </div>
						}
                    </div>
                </div>
            </div>
		}
	</AuthenticatedLayout>;
}
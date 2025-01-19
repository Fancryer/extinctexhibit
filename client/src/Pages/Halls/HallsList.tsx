import {Hall}                 from '../../types';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import findPermissionsInRoles from '../../Pages/FindPermissionsInRoles';
import {useAuth}              from "../../Components/AuthProvider.tsx";

interface HallsListProps
{
	halls:Hall[]
}

export default function HallsList({halls}:HallsListProps)
{
	const {auth:{user,roles}}=useAuth();
	const [userCanEditHall,userCanDeleteHall]=findPermissionsInRoles(user,roles,['edit halls','delete halls']);
	const getHallNameHeader=(name:string)=>
		<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
			{name}
		</h2>;
	return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
		{halls.map(hall=>{
			const {id,name,location,capacity}=hall;
			return (
				<div
					key={id}
					className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow"
				>
					{
						userCanEditHall
						?<div className="flex flex-row justify-between">
							{getHallNameHeader(name)}
							<div className="flex flex-row">
								{
									userCanDeleteHall
									&&<ResponsiveNavLink
                                        className="rounded-lg bg-red-200 hover:bg-red-300"
										// href={route('halls.delete',{hall:hall.id})}
                                    >
                                        Delete
                                    </ResponsiveNavLink>
								}
								<ResponsiveNavLink
									className="rounded-lg bg-violet-200 hover:bg-violet-300"
									// href={route('halls.edit',{hall:hall.id})}
								>
									Edit
								</ResponsiveNavLink>
							</div>
						</div>
						:getHallNameHeader(name)
					}
					<p className="text-gray-700 dark:text-gray-300">
						{location}
					</p>
					<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
						Capacity: {capacity}
					</small>
				</div>
			);
		})}
	</div>;
}
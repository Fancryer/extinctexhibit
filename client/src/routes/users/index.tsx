import {createFileRoute}      from '@tanstack/react-router'
import {User}                 from "../../types";
import AuthenticatedLayout    from "../../Layouts/AuthenticatedLayout.tsx";
import {useEffect,useState}   from "react";
import api,{extractData}      from "../../api.tsx";
import {useAuth}              from "../../Components/AuthProvider.tsx";
import {hasPermissionInRoles} from "../../Pages/FindPermissionsInRoles.ts";

export const Route=
	createFileRoute('/users/')({component:UserIndex})

export function UserIndex()
{
	const [users,setUsers]=useState<User[]>([]);
	const fetchUsers=async()=>
		await api.get<User[]>('user/all').then(extractData).then(setUsers);
	useEffect(()=>{
		fetchUsers().then();
	},[]);

	async function onDelete(id:number)
	{
		console.log('Deleting user with id:',id);
		await api.delete(`user/${id}`);
		fetchUsers().then();
	}

	return (
		<AuthenticatedLayout isCentered>
			<UserIndexInner users={users} onDelete={onDelete}/>
		</AuthenticatedLayout>
	)
}

interface UserIndexInnerProps
{
	users:User[];
	onDelete:(id:number)=>void;
}

function UserIndexInner({users,onDelete}:UserIndexInnerProps)
{
	const {auth:{user:me,roles}}=useAuth();
	if(!hasPermissionInRoles(me,roles,'view users')) return null;
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
				User List
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{users.map((user)=>(
					<div
						key={user.id}
						className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							{user.prosoponym}
						</h3>
						<p className="text-sm text-gray-700 dark:text-gray-300">
							Email: {user.email}
						</p>
						<p className="text-sm text-gray-500">
							Verified:{" "}
							{
								user.emailVerifiedAt
								?<span className="text-green-500">Yes</span>
								:<span className="text-red-500">No</span>
							}
						</p>
						{
							user.id!==me?.id
							&&hasPermissionInRoles(me,roles,'delete users')
							&&<button
                                onClick={()=>onDelete(user.id)}
                                className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>}
					</div>
				))}
			</div>
		</div>
	);
}
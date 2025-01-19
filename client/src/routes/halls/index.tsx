import {createFileRoute,useRouter} from "@tanstack/react-router";

import AuthenticatedLayout    from '../../Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import HallsList              from '../../Pages/Halls/HallsList';
import findPermissionsInRoles from '../../Pages/FindPermissionsInRoles';
import {Hall}                 from "../../types";
import {useEffect,useState}   from "react";
import api                    from "../../api.tsx";
import {useAuth}              from "../../Components/AuthProvider.tsx";


export const Route=
	createFileRoute('/halls/')({component:HallsIndex})

export default function HallsIndex()
{
	const router=useRouter();
	const [halls,setHalls]=useState<Hall[]>([]);
	useEffect(()=>{
		const fetchHalls=async()=>
			await api.get<Hall[]>('halls').then(
				response=>response.data
			);
		fetchHalls().then(n=>{
			console.debug('Halls: ',n);
			setHalls(n);
		});
	},[router]);
	return (
		<AuthenticatedLayout
			isCentered
			header={<YouCanAddHalls hallsArePresent={halls.length>0}/>}
		>
			{/*<Head title="NewsIndex"/>*/}
			<HallsIndexInner halls={halls}/>
		</AuthenticatedLayout>
	);
}

function HallsIndexInner({halls}:{halls:Hall[]})
{
	const hallsArePresent=halls.length>0;
	const {auth:{user,roles}}=useAuth();
	const [userCanCreateHall]=findPermissionsInRoles(user,roles,['create halls']);
	return (
		hallsArePresent
		&&<div className="py-12">
            <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                <div className="flex flex-col overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <HallsList halls={halls}/>
					{
						userCanCreateHall
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
	);
}

function YouCanAddHalls({hallsArePresent}:{hallsArePresent:boolean})
{
	const {auth:{user,roles}}=useAuth();
	const [userCanCreateHall]=findPermissionsInRoles(user,roles,['create halls']);
	return (
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
	);
}
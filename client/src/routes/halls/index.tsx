import {createFileRoute,useRouter} from "@tanstack/react-router";

import AuthenticatedLayout    from '../../Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import HallsList              from '../../Pages/Halls/HallsList';
import findPermissionsInRoles from '../../Pages/FindPermissionsInRoles';
import {Hall}                 from "../../types";
import {useEffect,useState}   from "react";
import api,{extractData}      from "../../api.tsx";
import {useAuth}              from "../../Components/AuthProvider.tsx";


export const Route=
	createFileRoute('/halls/')({component:HallsIndex})

export default function HallsIndex()
{
	const router=useRouter();
	const [halls,setHalls]=useState<Hall[]>([]);
	useEffect(()=>{
		const fetchHalls=async()=>
			await api.get<Hall[]>('halls').then(extractData);
		fetchHalls().then(setHalls);
	},[router]);
	return <AuthenticatedLayout
		isCentered
		elseRedirectToLogin={false}
		header={<div className="text-2xl">Halls page</div>}
		children={<HallsIndexInner halls={halls}/>}
	/>;
}

function HallsIndexInner({halls}:{halls:Hall[]})
{
	const hallsArePresent=halls.length>0;
	return (
		hallsArePresent
		&&<div className="py-12">
            <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                <div className="flex flex-col overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <HallsList halls={halls}/>
                </div>
            </div>
        </div>
	);
}

// function YouCanAddHalls({hallsArePresent}:{hallsArePresent:boolean})
// {
// 	const {auth:{user,roles}}=useAuth();
// 	const [userCanCreateHall]=findPermissionsInRoles(user,roles,['create halls']);
// 	return (
// 		!hallsArePresent
// 		&&userCanCreateHall
// 		&&<div>
//             <ResponsiveNavLink
// 				// href={route('halls.create')}
//             >
//                 There is no halls yet, but you can add one...
//             </ResponsiveNavLink>
//             <ResponsiveNavLink
// 				// href={route('halls.reseed')}
//             >
//                 ...or you can restore default halls. How did you even manage to delete all of them, you poor soul?
//             </ResponsiveNavLink>
//         </div>
// 	);
// }
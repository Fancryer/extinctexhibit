import NavLink                from '../Components/NavLink';
import findPermissionsInRoles from '../Pages/FindPermissionsInRoles';
import {useLocation}          from "@tanstack/react-router";
import {FileRoutesByFullPath} from "../routeTree.gen.ts";
import {useEffect}            from "react";
import {MaybeAuth}            from "../types";

function HeaderLink({name,text}:{name:keyof FileRoutesByFullPath,text:string})
{
	const location=useLocation();
	return <NavLink
		to={name}
		active={location.pathname==name}
	>
		{text}
	</NavLink>;
}

export default function NavigationHeader({user,roles,state}:MaybeAuth)
{
	useEffect(()=>{
		console.log('User: ',user);
		console.log('Roles: ',roles);
		console.log('State: ',state);
	},[]);
	const [userCanViewParticipants,userCanViewUsers]=
		findPermissionsInRoles(user,roles,['view users','view participants']);
	return <div className="flex">
		<div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
			<HeaderLink name="/news" text={'News'}/>
			<HeaderLink name="/halls" text={'Halls'}/>
			<HeaderLink name="/events" text={'Events'}/>
			{userCanViewParticipants&&<HeaderLink name="/participants" text={'Participants'}/>}
			{
				userCanViewUsers
				&&<HeaderLink name="/" /*users.index*/ text={'Users'}/>
			}
			{
				user
				&&<NavLink
                    to={`/profile/$profileId`}
                    params={{profileId:`${user.id}`}}
					// active={route().current('profile.edit')}
                >
                    Profile
                </NavLink>
			}
		</div>
	</div>;
}
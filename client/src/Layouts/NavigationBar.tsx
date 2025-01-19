import NavigationHeader      from './NavigationHeader';
import ProfileDropdown       from './ProfileDropdown';
import ProfileDropdownButton from './ProfileDropdownButton';
import {useState}            from 'react';
import UserGuard             from '../Components/UserGuard';
import GoToProfile           from '../Layouts/GoToProfile';
import NavLink               from '../Components/NavLink';
import '../index.css';
import {useAuth}             from "../Components/AuthProvider.tsx";
import {useLocation}         from "@tanstack/react-router";

export function NavigationBar()
{
	const {
		auth:{user,roles,state},
		clearAuth
	}=useAuth();
	const location=useLocation();
	const [showingNavigationDropdown,setShowingNavigationDropdown]=useState(user!=null);
	return <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="flex h-16 justify-between">
				<NavigationHeader user={user} roles={roles} state={state}/>
				<ProfileDropdown user={user} clearAuth={clearAuth}/>
				{
					user
					?<ProfileDropdownButton
						onClick={()=>setShowingNavigationDropdown(previousState=>!previousState)}
						showingNavigationDropdown={showingNavigationDropdown}
					/>
					:<div className="flex">
						<div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
							<NavLink
								to="/auth/login"
								active={location.pathname==='/auth/login'}
							>
								Login
							</NavLink>
							<NavLink
								to="/auth/register"
								active={location.pathname==='/auth/register'}
							>
								Register
							</NavLink>
						</div>
					</div>
				}
			</div>
		</div>
		<div className={`${showingNavigationDropdown?'block':'hidden'} sm:hidden`}>
			<UserGuard user={user}>
				<GoToProfile/>
			</UserGuard>
		</div>
	</nav>;
}
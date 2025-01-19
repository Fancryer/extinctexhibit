import {createFileRoute,useNavigate} from '@tanstack/react-router';
import AuthenticatedLayout           from "../Layouts/AuthenticatedLayout.tsx";
import UpdateProfileInformationForm  from "../Pages/Profile/Partials/UpdateProfileInformationForm.tsx";
import UpdatePasswordForm            from "../Pages/Profile/Partials/UpdatePasswordForm.tsx";
import DeleteUserForm                from "../Pages/Profile/Partials/DeleteUserForm.tsx";
import {useAuth}                     from "../Components/AuthProvider.tsx";
import {useEffect}                   from "react";

export const Route=
	createFileRoute('/profile/$profileId')({component:Profile});

function Profile()
{
	const {profileId}=Route.useParams();
	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
					Profile
				</h2>
			}
		>
			<ProfileInner id={+profileId}/>
		</AuthenticatedLayout>
	);
}

function ProfileInner({id}:{id:number})
{
	const {auth:{user,roles,state}}=useAuth();
	const navigate=useNavigate();
	useEffect(()=>{
		if(state==='ready'&&(user===null||user.id!==id))
		{
			navigate(
				{
					from:   Route.path,
					params: {profileId:`${id}`},
					to:     '/auth/login',
					replace:true
				}
			).then(()=>{
				const message=user==null
							  ?'user is null'
							  :`user.id (${user.id}) !== id (${id})`;
				console.log(`Redirected to login because ${message}`);
			});
		}
	},[id,user,state,navigate]);
	if(state==='loading')
		return <div>Loading...</div>; // Показываем индикатор загрузки
	else if(state==='failed'||user===null||user.id!==id)
		return <div>Redirecting...</div>; // Временный экран для редиректа
	else return (
			<div className="py-12">
				<div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
						<UpdateProfileInformationForm
							mustVerifyEmail={user.email_verified_at==null}
							className="max-w-xl"
							auth={{user:user,roles}}
						/>
					</div>
					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
						<UpdatePasswordForm className="max-w-xl"/>
					</div>
					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
						<DeleteUserForm className="max-w-xl"/>
					</div>
				</div>
			</div>
		);
}

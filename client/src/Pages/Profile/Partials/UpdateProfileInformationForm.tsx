import {Transition}                     from '@headlessui/react';
import {FormEventHandler,useState}      from 'react';
import {Auth}                           from "../../../types";
import InputLabel                       from "../../../Components/InputLabel.tsx";
import TextInput,{textInputBaseClasses} from "../../../Components/TextInput.tsx";
import {Link,redirect,useNavigate}      from "@tanstack/react-router";
import PrimaryButton                    from '../../../Components/PrimaryButton.tsx';
import {SubmitHandler,useForm}          from "react-hook-form";
import api                              from "../../../api.tsx";
import Cookies                          from "js-cookie";
import {HttpStatusCode}                 from "axios";
import {useAuth}                        from "../../../Components/AuthProvider.tsx";

interface UpdateProfileInformationFormProps
{
	className?:string
}

interface UpdateProfileInformationFormState
{
	prosoponym:string,
	email:string
}

export default function UpdateProfileInformationForm(
	{className=''}:UpdateProfileInformationFormProps
)
{
	const {auth:{user,roles},clearAuth}=useAuth();
	const [verificationIsSent,setVerificationIsSent]=useState(false);
	const [verificationError,setVerificationError]=useState('');
	const navigate=useNavigate();
	const {
		register,
		handleSubmit,
		formState:{errors,isSubmitting,isSubmitSuccessful}
	}=useForm<UpdateProfileInformationFormState>();

	const onSubmit:(SubmitHandler<UpdateProfileInformationFormState>)=
		async({prosoponym,email})=>
		{
			console.log('profile update');
			await api.put('/user/update-prosoponym-email',{
				accessToken:Cookies.get('accessToken')||'',
				payload:    {prosoponym,email}
			}).then(()=>{
				clearAuth();
				throw redirect({to:'/auth/login'});
			});
			// patch(route('profile.update'));
		};
	const sendVerification=async():Promise<void>=>{
		console.log("Sending verification email...");
		const accessToken=Cookies.get('accessToken');
		console.log('accessToken: ',accessToken)
		if(accessToken===undefined)
		{
			await navigate({to:'/auth/login'});
		}
		else
		{
			await api.post('/verification/send',accessToken)
					 .then(async r=>{
							   switch(r.status)
							   {
								   case HttpStatusCode.BadRequest:
								   case HttpStatusCode.Unauthorized:
								   {
									   console.error('Error sending verification email:',r.data);
									   await navigate({to:'/auth/login'});
								   }
							   }
						   }
					 ).catch(e=>{
					setVerificationError(e);
				});
			setVerificationIsSent(true);
		}
	}
	return <section className={className}>
		<header>
			<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
				Profile Information
				Roles <span className="text-amber-500">(FOR DEBUG PURPOSES ONLY)</span>:
				<div className="flex flex-col">
					{
						roles.length
						?roles.map(
							(r,i)=>
								<div className="sm:rounded-lg bg-white dark:bg-gray-800 drop-shadow" key={i}>
									{r.name}:
									{r.permissions.map(
										(p,i)=>
											<p className="ml-2" key={i}>&nbsp;&nbsp;{p}</p>
									)}
								</div>
						)
						:<div>NONE</div>
					}
				</div>
			</h2>
			<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
				Update your account's profile information and email address.
			</p>
		</header>
		<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
			<div className="mt-4">
				<InputLabel htmlFor="prosoponym" value="Prosoponym"/>
				<input
					className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
					placeholder="Your prosoponym"
					{...register(
						"prosoponym",
						{required:"Prosoponym is required",value:user.prosoponym}
					)}
				/>
				{errors.prosoponym&&<span className="text-red-600">{errors.prosoponym.message}</span>}
			</div>
			<div className="mt-4">
				<InputLabel htmlFor="email" value="Email"/>
				<input
					className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
					placeholder="Your email"
					{...register(
						"email",
						{required:"Email is required",value:user.email}
					)}
				/>
				{errors.email&&<span className="text-red-600">{errors.email.message}</span>}
			</div>
			{
				user.emailVerifiedAt
				&&<div className="mt-4">
                    <p className="mt-2 text-md">
                        Your email address is <span className="font-bold text-green-600">verified</span>.
                    </p>
                </div>
			}
			{
				!user.emailVerifiedAt
				&&<div>
                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                        Your email address is unverified.
                        <Link
							// href={route('verification.send')}
							// method="post"
							// as="button"
                            onClick={sendVerification}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Click here to re-send the verification email.
                        </Link>
                    </p>
					{
						verificationIsSent
						&&<div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                            A new verification link has been sent to your
                            email address.
                        </div>
					}
					{
						verificationError.length>0
						&&<div className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
							{verificationError}
                        </div>
					}
                </div>}
			<div className="flex items-center gap-4">
				<PrimaryButton disabled={isSubmitting}>
					Save
				</PrimaryButton>
				<Transition
					show={isSubmitSuccessful}
					enter="transition ease-in-out"
					enterFrom="opacity-0"
					leave="transition ease-in-out"
					leaveTo="opacity-0"
				>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Saved.
					</p>
				</Transition>
			</div>
		</form>
	</section>;
}

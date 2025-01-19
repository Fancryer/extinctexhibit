import {createFileRoute,useNavigate} from '@tanstack/react-router'
import {SubmitHandler,useForm}       from "react-hook-form";
import AuthenticatedLayout           from "../../Layouts/AuthenticatedLayout.tsx";
import InputLabel                    from "../../Components/InputLabel.tsx";
import {textInputBaseClasses}        from "../../Components/TextInput.tsx";
import api                           from "../../api.tsx";
import PrimaryButton                 from '../../Components/PrimaryButton.tsx';
import {AxiosResponse}               from "axios";
import {AuthResponse,setAuthTokens}  from "../../Auth.ts";
import Cookies                       from "js-cookie";
import {useEffect}                   from "react";

export const Route=createFileRoute('/auth/login')({component:Login})

interface LoginState
{
	email:string,
	password:string
}

export default function Login()
{
	useEffect(()=>console.log('Login page'),[]);
	const navigate=useNavigate();
	const {
		register,
		handleSubmit,
		formState:{errors,isSubmitting},
		setError
	}=useForm<LoginState>();
	const onSubmit:(SubmitHandler<LoginState>)=
		async({email,password})=>
		{
			try
			{
				console.warn(Cookies.get());
				console.warn({email,password});
				await api.post<LoginState,AxiosResponse<AuthResponse>>(
					'auth',
					{email,password}
				).then(r=>setAuthTokens(r.data));
				await navigate({from:'/auth/login',to:'/'});
				console.log('logged in');
			}
			catch(error)
			{
				console.error('Login failed:',error);
				// Показать пользователю сообщение об ошибке
				alert('Login failed. Please check your credentials and try again.');
				setError(
					'email',
					{message:'Login failed. Please check your credentials and try again.'}
				);
			}
		};

	return (
		<AuthenticatedLayout
			isCentered
			elseRedirectToLogin={false}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col justify-center w-full max-w-lg p-8 bg-white drop-shadow-md rounded-lg"
			>
				<div className="mt-4">
					<InputLabel htmlFor="email" value="Email"/>
					<input
						className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
						placeholder="email@example.com"
						{...register("email",{required:"Email is required"})}
					/>
					{errors.email&&<span className="text-red-600">{errors.email.message}</span>}
				</div>
				<div className="mt-4">
					<InputLabel htmlFor="password" value="Password"/>
					<input
						className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
						placeholder="********"
						{...register("password",{required:"Password is required"})}
					/>
					{errors.password&&<span className="text-red-600">{errors.password.message}</span>}
				</div>
				<div className="mt-4 flex items-center justify-end">
					{/*		<NavLink*/}
					{/*			// to='password.request'*/}
					{/*			className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"*/}
					{/*		>*/}
					{/*			Forgot your password?*/}
					{/*		</NavLink>*/}
					<PrimaryButton
						type="submit"
						className="ms-4"
						disabled={isSubmitting}
					>
						Log in
					</PrimaryButton>
				</div>
			</form>
		</AuthenticatedLayout>
	);
}
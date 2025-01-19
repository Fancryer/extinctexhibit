import {createFileRoute,useNavigate} from '@tanstack/react-router'
import {SubmitHandler,useForm}       from 'react-hook-form'
import AuthenticatedLayout     from '../../Layouts/AuthenticatedLayout.tsx'
import InputLabel              from '../../Components/InputLabel.tsx'
import {textInputBaseClasses}  from '../../Components/TextInput.tsx'
import api                     from '../../api.tsx'
import {HttpStatusCode}        from "axios";
import {useState}                    from "react";

export const Route=createFileRoute('/auth/register')({component:Register})

interface RegisterState
{
	email:string,
	password:string,
	confirmPassword:string,
	prosoponym:string
}

export default function Register(){
	const {
		register,
		handleSubmit,
		watch,
		formState:{errors,isSubmitting}
	}=useForm<RegisterState>()
	const [statusText,setStatusText]=useState('');
	const navigate=useNavigate();
	const onSubmit:SubmitHandler<RegisterState>=({email,password,prosoponym})=>{
		api.post<Omit<RegisterState,'confirmPassword'>>('/user',{email,password,prosoponym})
		   .then(
			   async r=>{
				   if(r.status===HttpStatusCode.Created||r.status===HttpStatusCode.Ok)
					   await navigate({to:'/auth/login'});
				   else
					   setStatusText(r.statusText)
			   }
		   )
	}
	return (
		<AuthenticatedLayout elseRedirectToLogin={false} isCentered>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col justify-center w-full max-w-lg p-8 bg-white drop-shadow-md rounded-lg"
			>
				<div className="mt-4">
					<InputLabel htmlFor="email" value="Email"/>
					<input
						className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
						placeholder="email@example.com"
						{...register('email',{required:'Email is required'})}
					/>
					{errors.email&&<span>{errors.email.message}</span>}
				</div>
				<div className="mt-4">
					<InputLabel htmlFor="password" value="Password"/>
					<input
						className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
						placeholder="********"
						{...register('password',{required:'Password is required'})}
					/>
					{errors.password&&<span>{errors.password.message}</span>}
				</div>
				<div className="mt-4">
					<InputLabel htmlFor="confirmPassword" value="Confirm Password"/>
					<input
						className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
						placeholder="********"
						{...register(
							'confirmPassword',
							{
								required:'Confirm password is required',
								validate:it=>it===watch('password')||'Passwords do not match'
							}
						)}
					/>
					{errors.confirmPassword&&<span>{errors.confirmPassword.message}</span>}
				</div>
				<div className="mt-4">
					<InputLabel htmlFor="prosoponym" value="Prosoponym"/>
					<input
						className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
						placeholder="Name Surname Whatever"
						{...register('prosoponym',{required:'Prosoponym is required'})}
					/>
					{errors.prosoponym&&<span>{errors.prosoponym.message}</span>}
				</div>
				{statusText&&<span className="text-red-500 mt-4">{statusText}</span>}
				<button disabled={isSubmitting}>Submit</button>
			</form>
			{/*	<div className="mt-4 flex items-center justify-end">*/}
			{/*		<NavLink*/}
			{/*			// to='password.request'*/}
			{/*			className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"*/}
			{/*		>*/}
			{/*			Forgot your password?*/}
			{/*		</NavLink>*/}
			{/*		<PrimaryButton type="submit" className="ms-4" disabled={isSubmitting}>*/}
			{/*			Log in*/}
			{/*		</PrimaryButton>*/}
			{/*	</div>*/}
			{/*</form>*/}
		</AuthenticatedLayout>
	)
}

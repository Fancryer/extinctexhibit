import {createFileRoute,useRouter}      from '@tanstack/react-router'
import React,{useEffect,useState}       from "react";
import {Transition}                     from "@headlessui/react";
import AuthenticatedLayout              from "../../Layouts/AuthenticatedLayout.tsx";
import {SubmitHandler,useForm}          from "react-hook-form";
import Cookies                          from "js-cookie";
import api,{extractData}                from "../../api.tsx";
import InputLabel                       from "../../Components/InputLabel.tsx";
import TextInput,{textInputBaseClasses} from "../../Components/TextInput.tsx";
import {Event,Hall}                     from "../../types";
import {useAuth}                        from '../../Components/AuthProvider.tsx';
import FileInput                        from "../../Components/FileInput.tsx";
import PrimaryButton                    from "../../Components/PrimaryButton.tsx";

export const Route=
	createFileRoute('/news/create')({component:NewsCreate})

export interface CreateNewsFormState
{
	title:string,
	content:string,
	cover:File|null,
	event_id:number|null;
}

function NewsCreate()
{
	const [events,setEvents]=useState<Event[]>([]);
	const [halls,setHalls]=useState<Hall[]>([]);
	const router=useRouter();
	const {auth:{user,roles}}=useAuth();
	const {
		register,
		handleSubmit,
		formState:{errors,isSubmitting,isSubmitSuccessful},
		setError,
		setValue
	}=useForm<CreateNewsFormState>();

	useEffect(()=>{
		const fetchEvents=async()=>
			await api.get<Event[]>('events').then(extractData);
		const fetchHalls=async()=>
			await api.get<Hall[]>('halls').then(extractData);
		fetchEvents().then(n=>setEvents(n));
		fetchHalls().then(n=>setHalls(n));
		// setFilteredEvents(filterEvents(eventFilter));
	},[router,user,roles]);

	const onSubmit:(SubmitHandler<CreateNewsFormState>)=
		async({title,content,cover,event_id})=>
		{
			try
			{
				console.warn(Cookies.get());
				console.warn({title,content,cover,event_id});
				// await api.post<CreateNewsFormState,AxiosResponse<AuthResponse>>(
				// 	'auth',
				// 	{email,password}
				// ).then(r=>setAuthTokens(r.data));
				// await navigate({from:'/auth/login',to:'/'});
				console.log('logged in');
			}
			catch(error)
			{
				console.error('Login failed:',error);
				// Показать пользователю сообщение об ошибке
				alert('Login failed. Please check your credentials and try again.');
				// setError(
				// 	'email',
				// 	{message:'Login failed. Please check your credentials and try again.'}
				// );
			}
		};

	return (
		<AuthenticatedLayout
			header={<div>Create News</div>}
			isCentered
		>
			{/*<Head title="Create News"/>*/}
			<section>
				<header>
					<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
						Create News
					</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Fill out the details for the new news.
					</p>
				</header>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-6 space-y-6 w-[calc(100%+8rem)]"
					method="post"
					encType="multipart/form-data"
				>
					<div className="mt-4">
						<InputLabel htmlFor="title" value="Title"/>
						<input
							className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
							placeholder="Title"
							{...register("title",{required:"Title is required"})}
						/>
						{errors.title&&<span className="text-red-600">{errors.title.message}</span>}
					</div>
					<div className="mt-4">
						<InputLabel htmlFor="content" value="Content"/>
						<TextInput
							className="mt-1 p-2 block w-full h-8 border-2 min-h-12"
							placeholder="Content"
							multiline
							{...register("content",{required:"Content is required"})}
						/>
						{errors.content&&<span className="text-red-600">{errors.content.message}</span>}
					</div>
					<div className="mt-4">
						<InputLabel htmlFor="event_id" value="Event"/>
						{
							!events.length
							?<div
								className="rounded-md bg-white shadow-sm border-red-500 border-2 h-[calc(42px)] ring-indigo-500 dark:bg-gray-900 dark:text-gray-300 dark:border-red-600 dark:ring-indigo-600 mt-1 flex w-full justify-center items-center"
							>
								No events available
							</div>
							:<select
								{...register("event_id")}
								className="p-2 block w-full border-2 rounded-md"
							>
								<option key="none" value="null">
									None
								</option>
								{events.map(({id,title,start_time,end_time})=>(
									<option key={id} value={id}>
										{title} ({new Date(start_time).toLocaleString()} -{" "}
										{new Date(end_time).toLocaleString()})
									</option>
								))}
							</select>
						}
						{errors.event_id&&(<span className="text-red-600">{errors.event_id.message}</span>)}
					</div>
					<FileInput
						name="cover"
						register={register} // Передаем register
						errors={errors.cover} // Передаем ошибку для поля cover
						setValue={setValue}
						onChange={(file)=>{
							console.log(file);
						}}
					/>
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
							<p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
						</Transition>
					</div>
				</form>
			</section>
		</AuthenticatedLayout>
	);
}

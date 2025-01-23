import React,{useEffect,useState}             from 'react'
import {createFileRoute,redirect,useNavigate} from '@tanstack/react-router'
import api,{extractData}                      from '../../api.tsx'
import {AxiosError,HttpStatusCode}            from 'axios'
import AuthenticatedLayout                    from '../../Layouts/AuthenticatedLayout.tsx'
import {useAuth}                              from "../../Components/AuthProvider.tsx";
import {hasPermissionInRoles}                 from "../../Pages/FindPermissionsInRoles.ts";
import InputLabel                             from "../../Components/InputLabel.tsx";
import {textInputBaseClasses}                 from "../../Components/TextInput.tsx";
import FileInput                              from "../../Components/FileInput.tsx";
import PrimaryButton                          from "../../Components/PrimaryButton.tsx";
import {Transition}                           from "@headlessui/react";
import {SubmitHandler,useForm}                from "react-hook-form";
import {CreateNewsFormState}                  from "./create.tsx";
import {Event,NewsItem}                       from "../../types"
import Cookies                                from "js-cookie";

export const Route=
	createFileRoute('/news/edit/$newsId')({component:EditNews});

function EditNews()
{
	const {newsId}=Route.useParams()
	const [events,setEvents]=useState<Event[]>([]);
	const [error,setError]=useState<string>('');
	const [news,setNews]=useState<NewsItem|null>(null);
	const navigate=useNavigate();
	useEffect(()=>{
		const fetchNews=async()=>
			await api.get<NewsItem>(`news/${newsId}`).then(extractData);
		const fetchEvents=async()=>
			await api.get<Event[]>('events').then(extractData);
		fetchNews().then(n=>{
			setNews(n);
			if(n==null) throw redirect({to:"/news"});
		});
		fetchEvents().then(n=>setEvents(n));
	},[]);
	const onSubmit:(SubmitHandler<EditNewsFormState>)=
		async({title,content,cover,eventId})=>
		{
			try
			{
				console.warn(Cookies.get());
				console.warn({title,content,cover,eventId});
				const form=new FormData();
				/*
				accessToken:String,
				newsId:Long,
				title:String,
				content:String,
				cover:MultipartFile?,
				eventId:Long?
				*/
				form.append('accessToken',Cookies.get('accessToken')||'');
				form.append('newsId',newsId);
				form.append('title',title);
				form.append('content',content);
				if(cover) form.append('cover',cover);
				if(eventId) form.append('event_id',`${eventId}`);
				await api.put('news',form,{
					headers:{'Content-Type':'multipart/form-data'}
				}).then(async()=>{
					await navigate({to:'/news'});
				})
				console.log('News edited');
			}
			catch(error)
			{
				setError((error as AxiosError)?.message??'');
			}
		};
	return (
		<AuthenticatedLayout
			header={<div>Edit News</div>}
			isCentered
		>
			<EditNewsInner
				news={news!!}
				events={events}
				onSubmit={onSubmit}
			/>
		</AuthenticatedLayout>
	)
}

interface EditNewsInnerProps
{
	news:NewsItem,
	events:Event[],
	onSubmit:SubmitHandler<EditNewsFormState>
}

interface EditNewsFormState
{
	title:string,
	content:string,
	cover:File|null,
	eventId:number|null;
}

function EditNewsInner({news,events,onSubmit}:EditNewsInnerProps)
{
	const {
		register,
		handleSubmit,
		formState:{errors,isSubmitting,isSubmitSuccessful},
		setValue
	}=useForm<EditNewsFormState>();
	const {auth:{user,roles,state}}=useAuth();
	const navigate=useNavigate();
	useEffect(()=>{
		if((state==='ready'&& !hasPermissionInRoles(user,roles,'edit news'))||state=='failed')
			throw redirect(
				{
					from:   Route.path,
					to:     '/',
					replace:true
				}
			);
	},[news,user,state,navigate]);
	const userCanEditNews=hasPermissionInRoles(user,roles,'edit news');
	if(state==='loading')
		return <div>Loading...</div>; // Показываем индикатор загрузки
	else if(state==='failed'||user===null|| !userCanEditNews)
		return <div>Redirecting...</div>; // Временный экран для редиректа
	else return (
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
							{...register("title",{required:"Title is required",value:news.title})}
						/>
						{errors.title&&<span className="text-red-600">{errors.title.message}</span>}
					</div>
					<div className="mt-4">
						<InputLabel htmlFor="content" value="Content"/>
						<textarea
							className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2 min-h-12`}
							placeholder="Content"
							aria-multiline
							{...register("content",{required:"Content is required",value:news.content})}
						>

						</textarea>
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
						{errors.eventId&&(<span className="text-red-600">{errors.eventId.message}</span>)}
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
		);
}

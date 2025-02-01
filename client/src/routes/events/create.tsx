import {createFileRoute,useNavigate} from '@tanstack/react-router'
import {useEffect,useState}          from 'react'
import {Transition}                  from '@headlessui/react'
import AuthenticatedLayout           from '../../Layouts/AuthenticatedLayout.tsx'
import {SubmitHandler,useForm}       from 'react-hook-form'
import api,{extractData}             from '../../api.tsx'
import InputLabel                    from '../../Components/InputLabel.tsx'
import {textInputBaseClasses}        from '../../Components/TextInput.tsx'
import {Event,Hall}                  from '../../types'
import {useAuth}                     from '../../Components/AuthProvider.tsx'
import PrimaryButton                 from '../../Components/PrimaryButton.tsx'
import {hasPermissionInRoles}        from '../../Pages/FindPermissionsInRoles.ts'
import {HallRow}                     from "../../Components/HallRow.tsx";
import DateRangePicker               from "../../Components/DateRangePicker.tsx";
import {AxiosError}                  from "axios";
import Cookies                       from "js-cookie";

export const Route=
	createFileRoute('/events/create')({component:CreateEvents})

export interface CreateEventsFormState
{
	organizer:string,
	hallId:number,
	title:string,
	description:string,
	startTime:string,
	endTime:string
}

interface CreateEventsInnerProps
{
	events:Event[],
	halls:Hall[],
	onSubmit:SubmitHandler<CreateEventsFormState>
}

function CreateEventsInner({events,halls,onSubmit}:CreateEventsInnerProps)
{
	// const hallsArePresented=halls.length>0;
	// console.debug('incoming events: ',incoming_events);
	const formatDateToInput=(date:Date)=>
		date.toISOString().slice(0,-8);
	const now=new Date();
	const [minDate,setMinDate]=useState(now);
	const [maxDate,setMaxDate]=useState(now);
	const {
		register,
		watch,
		handleSubmit,
		formState:{errors,isSubmitting,isSubmitSuccessful},
		setValue,
		getValues
	}=useForm<CreateEventsFormState>()
	const {
		auth:{user,roles,state}
	}=useAuth()
	const navigate=useNavigate()
	useEffect(()=>{
		if(state==='ready'&&user===null)
		{
			navigate(
				{
					from:   Route.path,
					to:     '/auth/login',
					replace:true
				}
			).then(()=>{
				console.log(`Redirected to login because user is null`)
			})
		}
	},[user,state,navigate])
	const userCanCreateNews=hasPermissionInRoles(user,roles,'create news')
	if(state==='loading')
		return <div>Loading...</div> // Показываем индикатор загрузки
	else if(state==='failed'||user===null|| !userCanCreateNews)
		return <div>Redirecting...</div> // Временный экран для редиректа
	else
		return (
			<section>
				<header>
					<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
						Create Event
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
						<InputLabel htmlFor="organizer" value="Organizer"/>
						<input
							className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
							placeholder="Organizer"
							{...register(
								'organizer',
								{
									required: 'Organizer name is required',
									maxLength:{
										value:  255,
										message:"Organizer name is too long"
									}
								}
							)}
						/>
						{errors.organizer&&(
							<span className="text-red-600">{errors.organizer.message}</span>
						)}
					</div>
					<HallRow
						hallId={watch('hallId')}
						events={events}
						halls={halls}
						setHallId={id=>setValue('hallId',id)}
						setDateRange={
							(start,end)=>{
								// const formattedStart=formatDateToInput(start);
								// const formattedEnd=formatDateToInput(end);
								setMinDate(start);
								setMaxDate(end);
								// console.debug('set date range: ',formattedStart,formattedEnd);
								console.debug('set date range: ',start,end);
							}
						}
					/>
					{!getValues('hallId')&&<span className="text-red-600">Select a hall</span>}
					<DateRangePicker
						register={register}
						minDate={minDate.toISOString().slice(0,-8)}
						maxDate={maxDate.toISOString().slice(0,-8)}
						onChange={
							(startTime,endTime)=>{
								console.log('onChange: ',startTime,endTime);
								setValue('startTime',startTime);
								setValue('endTime',endTime);
							}
						}
						formatDateToInput={formatDateToInput}
						disabled={halls.length==0}
					/>
					<div className="mt-4">
						<InputLabel htmlFor="title" value="Title"/>
						<input
							className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2`}
							placeholder="Title"
							{...register('title',{required:'Title is required'})}
						/>
						{errors.title&&(
							<span className="text-red-600">{errors.title.message}</span>
						)}
					</div>
					<div className="mt-4">
						<InputLabel htmlFor="description" value="Description"/>
						<textarea
							className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2 min-h-12`}
							placeholder="Description"
							aria-multiline
							{...register("description",{required:"Description is required"})}
						>

						</textarea>
						{errors.description&&<span className="text-red-600">{errors.description.message}</span>}
					</div>
					<div className="flex items-center gap-4">
						<PrimaryButton disabled={isSubmitting}>Save</PrimaryButton>
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
		)
}

function CreateEvents()
{
	const [events,setEvents]=useState<Event[]>([]);
	const [halls,setHalls]=useState<Hall[]>([]);
	const navigate=useNavigate()
	const [error,setError]=useState<string>('')
	useEffect(()=>{
		const fetchEvents=async()=>
			await api.get<Event[]>('events').then(extractData)
		const fetchHalls=async()=>
			await api.get<Hall[]>('halls').then(extractData)
		fetchEvents().then(setEvents);
		fetchHalls().then(setHalls);
	},[])
	const onSubmit:(SubmitHandler<CreateEventsFormState>)=
		async state=>
		{
			try
			{
				console.warn(Cookies.get())
				// const form={
				// 	...state,
				// 	startTime:state.startTime+":00Z",
				// 	endTime:  state.endTime+":00Z"
				// };
				const form=new FormData()
				form.append('accessToken',Cookies.get('accessToken')||'')
				form.append('organizer',state.organizer)
				form.append('title',state.title)
				form.append('hallId',`${state.hallId}`)
				form.append('description',state.description)
				form.append('startTime',state.startTime+":00Z")
				form.append('endTime',state.endTime+":00Z")
				await api.post('events',form,{
					headers:{'Content-Type':'multipart/form-data'}
				}).then(async()=>{
					console.log('Event created')
					await navigate({from:'/events/create',to:'/events'})
				})
			}
			catch(error)
			{
				setError((error as AxiosError)?.message??'')
			}
		}
	return (
		<AuthenticatedLayout header={<div>Create News</div>} isCentered>
			{/*<Head title="Create News"/>*/}
			<CreateEventsInner events={events} halls={halls} onSubmit={onSubmit}/>
			{error&&<div className="text-red-600">{error}</div>}
		</AuthenticatedLayout>
	)
}

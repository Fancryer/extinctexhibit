import {Description,Dialog,DialogPanel,DialogTitle} from '@headlessui/react';
import {Auth,Event,Hall}                            from '../../types';
import {useAuth}                                    from "../../Components/AuthProvider.tsx";


interface EventCardPostOpenProps
{
	open:boolean,
	onClose:()=>void,
	event:Event,
	participates:boolean,
	canParticipate:boolean
}

// export default function EventCardPostOpen(
// 	{
// 		event,
// 		onClose,
// 		open,
// 		participates,
// 		canParticipate
// 	}:EventCardPostOpenProps
// )
// {
// 	// console.log(filter.clean("Don't be an ash0le"));
// 	const {auth:{user}}=useAuth();
// 	const {organizer,hall,title,description,participants,start_time,end_time}=event;
// 	const participate=()=>{
// 		console.info('can participate',event,user?.id,canParticipate);
// 		// console.info('route',route('participants.store'));
// 		// router.post(route('participants.store'),{event_id:event.id,user_id:user.id});
// 	};
// 	const newStartTime=new Date(start_time);
// 	const newEndTime=new Date(end_time);
// 	const nowTime=new Date();
// 	const localizedStartTime=newStartTime.toLocaleDateString('en-GB',{hour:'2-digit', minute:'2-digit'});
// 	const localizedEndTime=newEndTime.toLocaleDateString('en-GB',{hour:'2-digit', minute:'2-digit'});
// 	return (
// 		<Dialog
// 			open={open}
// 			onClose={onClose}
// 			className="relative z-50"
// 		>
// 			<div className="fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-blur dark:backdrop-blur shadow-lg"
// 			>
// 				<DialogPanel
// 					className="flex flex-col max-w-screen-xl space-y-6 border bg-white p-12 rounded-lg text-gray-800 dark:text-gray-100"
// 				>
// 					<DialogTitle className="font-bold flex flex-row justify-between">
// 						<div>{title}</div>
// 						<div className="flex flex-col justify-between">
// 							<div className="text-red-500">
// 								<button onClick={onClose} children="Close"/>
// 							</div>
// 							{
// 								canParticipate
// 								&&<div className="text-green-500 pt-5">
//                                     <button onClick={participate} children="Participate"/>
//                                 </div>
// 							}
// 							{
// 								!canParticipate
// 								&&user
// 								&&<div className="text-gray-500 pt-5">
//                                     <button disabled>
// 										{
// 											participates
// 											?"You're already participating"
// 											:"You can't participate"
// 										}
//                                     </button>
//                                 </div>
// 							}
// 						</div>
// 					</DialogTitle>
// 					<Description children={description}/>
// 					<Description>
// 						Organizer: {organizer}
// 					</Description>
// 					<div className="self-end flex flex-col">
// 						<div className="text-right font-semibold">Hall</div>
// 						<Description children={hall.name}/>
// 						<Description children={hall.location}/>
// 						<Description children={hall.capacity}/>
// 						<Description className="text-gray-700 dark:text-gray-300 mb-4 flex-grow self-center">
// 							{`${participants.length} / ${hall.capacity}`}
// 						</Description>
// 					</div>
// 					<div className="flex justify-between">
// 						<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
// 							Start: {localizedStartTime}
// 						</small>
// 						{
// 							newStartTime<=nowTime
// 							&&nowTime<=newEndTime
// 							&&<small className="block mt-4 text-sm text-blue-500 dark:text-gray-400">
//                                 (is going now)
//                             </small>
// 						}
// 						<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
// 							End: {localizedEndTime}
// 						</small>
// 					</div>
// 				</DialogPanel>
// 			</div>
// 		</Dialog>
// 	);
// }

import {FaCheckCircle,FaTimesCircle,FaUser,FaMapMarkerAlt,FaPlus,FaMinus,FaCross,FaSadTear} from "react-icons/fa";
import {useState}                                                                           from "react";
import {useForm,useFieldArray,SubmitHandler}                              from "react-hook-form";
import api                                                                from "../../api.tsx";
import Cookies                                                            from "js-cookie";
import {useNavigate}                                                      from "@tanstack/react-router";

interface EscortFormState
{
	guests:{
		name:string
	}[]
}

export default function EventCardPostOpen(
	{
		event,
		onClose,
		open,
		participates,
		canParticipate
	}:EventCardPostOpenProps
)
{
	const {auth:{user}}=useAuth();
	const {organizer,hall,title,description,participants,startTime,endTime}=event;
	const navigate=useNavigate();

	const [accordionOpen,setAccordionOpen]=useState(false);
	const {register,reset,handleSubmit,control,setError,formState:{errors}}=useForm<EscortFormState>();
	const {fields,append,remove}=useFieldArray({control,name:"guests",shouldUnregister:true});

	const nowTime=new Date();
	const localizedStartTime=new Date(startTime).toLocaleDateString("en-GB",{hour:"2-digit",minute:"2-digit"});
	const localizedEndTime=new Date(endTime).toLocaleDateString("en-GB",{hour:"2-digit",minute:"2-digit"});

	const countEventParticipants=
		(event:Event):number=>
			event.participants
				 .map(p=>p.escorts.length+1)
				 .reduce((a,b)=>a+b,0);
	const totalParticipants=countEventParticipants(event)+fields.length+1; // Participants + guests + user
	const canAddGuest=totalParticipants<=hall.capacity;

	const onSubmit:(SubmitHandler<EscortFormState>)=async(data)=>{
		console.log("Form data:",data);
		await api.post('participants/participate',{
			accessToken:Cookies.get('accessToken')||'',
			payload:    {
				eventId:    event.id,
				prosoponyms:data.guests.map(guest=>guest.name)
			}
		}).then(
			async()=>await navigate({to:'/events'})
		).catch(e=>
					alert(e))
	};

	return (
		<Dialog
			open={open}
			onClose={()=>{
				reset({guests:[]});
				onClose();
			}}
			className="relative z-50"
		>
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-blur dark:backdrop-blur shadow-lg">
				<DialogPanel
					className="flex flex-col max-w-screen-2xl w-full space-y-6 border bg-white p-12 rounded-xl text-gray-800 dark:text-gray-100 overflow-y-auto max-h-[90vh]" // Added overflow-y-auto here
				>
					{/* Заголовок */}
					<DialogTitle className="flex items-center justify-between border-b pb-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
						<button
							onClick={onClose}
							className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200"
						>
							<FaTimesCircle className="text-2xl"/>
						</button>
					</DialogTitle>

					{/* Описание */}
					<div className="space-y-4">
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
						<p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
							<FaUser className="mr-2 text-blue-500"/> Organizer: {organizer}
						</p>
					</div>

					{/* Информация о зале */}
					<div className="border-t pt-4">
						<h3 className="font-semibold text-gray-800 dark:text-white">Hall Details</h3>
						<p className="flex items-center text-gray-600 dark:text-gray-400">
							<FaMapMarkerAlt className="mr-2 text-green-500"/>
							{hall.name}, {hall.location}
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Capacity: {countEventParticipants(event)} / {hall.capacity}
						</p>
					</div>

					{/* Тайминги */}
					<div className="flex justify-between items-center border-t pt-4 text-sm text-gray-500 dark:text-gray-400">
						<span>Start: {localizedStartTime}</span>
						{
							startTime>nowTime
							&&<span className="text-purple-600">(has not started yet)</span>
						}
						{
							startTime<=nowTime
							&&nowTime<=endTime
							&&<span className="text-blue-500">(is going now)</span>
						}
						{
							endTime<nowTime
							&&<span className="text-orange-600">(has ended)</span>
						}
						<span>End: {localizedEndTime}</span>
					</div>

					{/* Действия */}
					<div className="flex justify-end space-x-4 border-t pt-4">
						{canParticipate&&(
							<button
								onClick={()=>setAccordionOpen(!accordionOpen)}
								className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
							>
								<FaCheckCircle className="mr-2"/> Participate
							</button>
						)}
						{!canParticipate&&(
							<button
								disabled
								className="flex items-center px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg cursor-not-allowed"
							>
								<FaSadTear className="mr-2"/> Participate
								{countEventParticipants(event)} / {hall.capacity}
							</button>
						)}
					</div>

					{/* Аккордеон */}
					{accordionOpen&&(
						<div className="border-t pt-4 space-y-4">
							<h3 className="font-semibold text-gray-800 dark:text-white">Add Guests</h3>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								{fields.map((field,index)=>(
									<div key={field.id} className="flex flex-col">
										<div className="flex items-center space-x-2">
											<input
												{...register(`guests.${index}.name`,{required:"Name is required"})}
												className="w-full p-2 border rounded-lg"
												placeholder={`Guest ${index+1} Name`}
											/>
											<button
												type="button"
												onClick={()=>remove(index)}
												className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
											>
												<FaMinus/>
											</button>
										</div>
										{errors.guests?.[index]?.name&&
                                         <div className="text-red-500">{errors.guests[index].name.message}</div>}
									</div>
								))}

								{canAddGuest&&(
									<button
										type="button"
										onClick={()=>append({name:""})}
										className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
									>
										<FaPlus className="mr-2"/> Add Guest
									</button>
								)}

								{!canAddGuest&&(
									<p className="text-sm text-red-500">Cannot add more guests. Capacity reached.</p>
								)}

								<button
									type="submit"
									className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
								>
									Confirm
								</button>
							</form>
						</div>
					)}
				</DialogPanel>
			</div>
		</Dialog>
	);
}

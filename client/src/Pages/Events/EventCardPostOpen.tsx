import {Description,Dialog,DialogPanel,DialogTitle} from '@headlessui/react';
import {Auth,Event,Hall}                            from '../../types';


interface EventCardPostOpenProps
{
	open:boolean,
	onClose:()=>void,
	event:Event,
	user:Auth['user'],
	title:string,
	organizer:string,
	hall:Hall,
	description:string,
	startTime:string,
	endTime:string,
	participates:boolean,
	canParticipate:boolean
}

export default function EventCardPostOpen(
	{
		event,
		user,
		title,
		organizer,
		hall,
		description,
		startTime,
		endTime,
		onClose,
		open,
		participates,
		canParticipate
	}:EventCardPostOpenProps
)
{
	// console.log(filter.clean("Don't be an ash0le"));

	const participate=()=>{
		console.info('can participate',event,user.id,canParticipate);
		// console.info('route',route('participants.store'));
		// router.post(route('participants.store'),{event_id:event.id,user_id:user.id});
	};
	return (
		<Dialog
			open={open}
			onClose={onClose}
			className="relative z-50"
		>
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-blur dark:backdrop-blur shadow-lg">
				<DialogPanel
					className="flex flex-col max-w-screen-xl space-y-6 border bg-white p-12 rounded-lg text-gray-800 dark:text-gray-100">
					<DialogTitle
						className="font-bold flex flex-row justify-between"
						children={
							<>
								<div>{title}</div>
								<div className="flex flex-col justify-between">
									<div className="text-red-500">
										<button onClick={onClose} children="Close"/>
									</div>
									{
										canParticipate
										&&<div className="text-green-500 pt-5">
                                            <button onClick={participate} children="Participate"/>
                                        </div>
									}
									{
										!canParticipate
										&&user
										&&<div className="text-gray-500 pt-5">
                                            <button disabled>
												{
													participates
													?"You're already participating"
													:"You can't participate"
												}
                                            </button>
                                        </div>
									}
								</div>
							</>
						}
					/>
					<Description children={description}/>
					<Description>
						Organizer: {organizer}
					</Description>
					<div className="self-end flex flex-col">
						<div className="text-right font-semibold">Hall</div>
						<Description children={hall.name}/>
						<Description children={hall.location}/>
						<Description children={hall.capacity}/>
						<Description className="text-gray-700 dark:text-gray-300 mb-4 flex-grow self-center">
							{`${event.participants.length} / ${event.hall.capacity}`}
						</Description>
					</div>
					<div className="flex justify-between">
						<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
							Start: {new Date(startTime).toLocaleDateString()} at {new Date(startTime).toLocaleTimeString()}
						</small>
						{
							new Date(startTime)<=new Date()
							&&new Date()<=new Date(endTime)
							&&<small className="block mt-4 text-sm text-blue-500 dark:text-gray-400">
                                (is going now)
                            </small>
						}
						<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
							End: {new Date(endTime).toLocaleDateString()} at {new Date(endTime).toLocaleTimeString()}
						</small>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}

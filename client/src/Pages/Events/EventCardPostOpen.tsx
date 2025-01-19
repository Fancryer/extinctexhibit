import {Description,Dialog,DialogPanel,DialogTitle}                  from '@headlessui/react';
import {ChangeEventHandler,MouseEventHandler,ReactElement,useEffect} from 'react';
import {useState}                                                    from 'react';
import {Auth,Comment,Hall,Event}                                     from '@/types';
// import {Link,router,useForm}     from '@inertiajs/react';
import {useForm}                                                     from 'react-hook-form';
import {Filter}                                                      from 'bad-words';
import {hasPermissionInRoles}                                        from '@/Pages/FindPermissionsInRoles';
import axios                                                         from 'axios';


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
	userCanCreateComments:boolean,
	participates:boolean,
	canParticipate:boolean
}

interface CommentSectionProps
{
	userCanCreateComments:boolean,
	value:string,
	onChange:ChangeEventHandler<HTMLTextAreaElement>,
	onClick:()=>void,
	comments:Comment[],
	element:(comment:Comment)=>ReactElement
}

/*
<CommentSection
	userCanCreateComments={userCanCreateComments}
	value={newComment}
	onChange={(e)=>setNewComment(e.target.value)}
	onClick={handleCommentSubmit}
	comments={comments}
	element={(comment)=>(
		<div
			key={comment.id}
			className="p-4 rounded-md shadow-md bg-gray-100 dark:bg-gray-700"
		>
			<div className="font-semibold text-gray-800 dark:text-gray-200">
				{comment.owner_name}
			</div>
			<div className="text-gray-600 dark:text-gray-300">{comment.content}</div>
			<small className="block text-gray-500 dark:text-gray-400">
				{new Date(comment.created_at).toLocaleString()}
			</small>
		</div>
	)}
/>
*/
function CommentSection(
	{userCanCreateComments,value,onChange,onClick,comments,element}:CommentSectionProps
)
{
	return <>
		{/* Комментарии */}
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">Comments</h3>
			{/* Поле для добавления нового комментария */}
			{
				userCanCreateComments
				&&<div className="space-y-2">
					<textarea
                        value={value}
                        onChange={onChange}
                        placeholder="Add a comment..."
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
                    />
                    <button
                        onClick={onClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
			}
			{/* Список комментариев */}
			<div className="space-y-2">
				{
					comments.length>0
					?comments.map(element)
					:<p className="text-gray-500 dark:text-gray-400" children="No comments yet."/>
				}
			</div>
		</div>
	</>;
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
	const [newComment,setNewComment]=useState('');
	const {data,setData,post}=useForm(
		{
			comment:newComment
		}
	);

	const filter=new Filter();

	// console.log(filter.clean("Don't be an ash0le"));

	const handleCommentSubmit=()=>{
		if(newComment.trim()==='') return;
		console.log('Submitting comment:',newComment);
		post(route('comments.store',{event:event.id,comment:newComment}));
		setNewComment(''); // Очистить поле после отправки
	};

	const participate=()=>{
		console.info('can participate',event,user.id,canParticipate);
		console.info('route',route('participants.store'));
		router.post(route('participants.store'),{event_id:event.id,user_id:user.id});
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

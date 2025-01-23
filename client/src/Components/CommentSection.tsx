import {ChangeEventHandler,ReactElement,useEffect} from "react";
import {textInputBaseClasses}                      from "./TextInput.tsx";
import {Comment}                         from "../types";

interface CommentSectionProps
{
	userCanCreateComments:boolean,
	value:string,
	onChange:ChangeEventHandler<HTMLTextAreaElement>,
	onClick:()=>void,
	comments:Comment[],
	error:string,
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
export function CommentSection(
	{
		userCanCreateComments,
		value,
		onChange,
		onClick,
		comments,
		error,
		element
	}:CommentSectionProps
)
{
	useEffect(()=>{
		console.log('comments', comments)
	},[]);
	return <>
		{/* Комментарии */}
		<div className="space-y-4">
			<h3 className="text-xl font-semibold">Comments</h3>
			{/* Поле для добавления нового комментария */}
			{
				userCanCreateComments
				&&<div className="space-y-2">
					<textarea
                        className={`${textInputBaseClasses()} mt-1 p-2 block w-full h-8 border-2 min-h-12 !shadow-md`}
                        aria-multiline
                        value={value}
                        onChange={onChange}
                        placeholder="Add a comment..."
                    />
					{error&&<div className="text-red-500 font-bold">{error}</div>}
					{
						value==''
						?<button
							className="px-4 py-2 bg-gray-500 text-white rounded-md"
							onClick={onClick}
							disabled
						>
							Submit
						</button>
						:<button
							className={`px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 shadow-md`}
							onClick={onClick}
						>
							Submit
						</button>
					}
                </div>
			}
			{/* Список комментариев */}
			<div className="space-y-2 flex flex-col justify-between">
				{
					comments.length>0
					?comments.map(element)
					:<p className="text-gray-500 dark:text-gray-400" children="No comments yet."/>
				}
			</div>
		</div>
	</>;
}
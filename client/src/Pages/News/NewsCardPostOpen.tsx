import {Description,Dialog,DialogPanel,DialogTitle} from "@headlessui/react";
import {NewsCardProps}                              from "./NewsCard.tsx";
import {CommentSection}           from "../../Components/CommentSection.tsx";
import React,{useEffect,useState} from "react";
import {Comment}                  from "../../types";
import {Filter}                                     from "bad-words";
import api,{extractData}                            from "../../api.tsx";
import {makePayload}                                from "../payload.ts";
import {CommentCard}                                from "./CommentCard.tsx";

interface NewsCardPostOpenProps extends NewsCardProps
{
	userCanCreateComments:boolean,
	open:boolean,
	onClose:()=>void
}

export function NewsCardPostOpen(
	{
		newsId,
		userCanCreateComments,
		coverUrl,
		title,
		content,
		createdAt,
		updatedAt,
		open,
		onClose
	}:NewsCardPostOpenProps
)
{
	const [comment,setComment]=useState('');
	const [comments,setComments]=useState<Comment[]>([]);
	const [commentError,setCommentError]=useState('');

	async function fetchComments()
	{
		const fetchedComments=
			await api.get<Comment[]>(`/comments/for-news/${newsId}`)
					 .then(extractData);
		setComments(fetchedComments);
		console.log('Fetched comments:',fetchedComments);
	}

	useEffect(()=>{
		(async()=>fetchComments())();
	},[userCanCreateComments]);
	const handleCommentSubmit=async()=>{
		if(comment.trim()==='')
		{
			setCommentError('Comment cannot be empty');
			return;
		}
		console.log('Submitting comment:',comment);
		await api.post<{newsId:number,content:string},number>(
			'/comments/add',
			makePayload({newsId,content:comment})
		).then(
			async id=>await fetchComments()
		).then(
			()=>setComment('')
		).catch(setCommentError)
	};
	const filter=new Filter();
	return (
		<Dialog
			open={open}
			onClose={onClose}
			className="z-50 fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-blur dark:backdrop-blur shadow-lg"
		>
			<DialogPanel
				className="flex flex-col max-w-screen-xl space-y-6 border bg-white p-12 rounded-lg text-gray-800 dark:text-gray-100 overflow-y-auto max-h-[90vh]"
			>
				<DialogTitle
					className="font-bold flex flex-row justify-between"
				>
					<div
						className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100"
						children={title}
					/>
					<div className="flex flex-col justify-between">
						<div className="text-red-500">
							<button onClick={onClose} children="Close"/>
						</div>
					</div>
				</DialogTitle>
				{
					coverUrl
					&&<div
                        className="w-[60rem] min-h-[32rem] mb-6 rounded-lg bg-cover bg-center"
                        style={{
							backgroundImage:`url(http://localhost:6060/api/uploads/${coverUrl})`
						}}
                    />
				}
				<Description
					className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed rounded-md border-2 p-2 shadow-md"
					children={content}
				/>
				<div className="flex flex-row justify-between">
					<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
						Published: {new Date(createdAt).toLocaleDateString()}
					</small>
					<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
						Modified: {new Date(updatedAt).toLocaleDateString()}
					</small>
				</div>
				<span className="space-y-2"/>
				<CommentSection
					userCanCreateComments={userCanCreateComments}
					value={comment}
					onChange={s=>
						setComment(filter.clean(s.target.value))
					}
					error={commentError}
					onClick={handleCommentSubmit}
					comments={comments}
					element={c=><CommentCard key={c.id} comment={c}/>}
				/>
			</DialogPanel>
		</Dialog>
	)
}
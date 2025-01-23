import {useState}         from "react"
import {truncate}         from "../Events/EventCard.tsx";
import {NewsCardPreOpen}  from "./NewsCardPreOpen.tsx";
import {NewsCardPostOpen} from "./NewsCardPostOpen.tsx";

export interface NewsCardProps
{
	newsId:number,
	coverUrl?:string,
	title:string,
	content:string,
	createdAt:string,
	updatedAt:string,
	userCanEditNews:boolean,
	userCanDeleteNews:boolean,
	userCanCreateComments:boolean
}

export function NewsCard(
	{
		newsId,
		coverUrl,
		title,
		content,
		createdAt,
		updatedAt,
		userCanEditNews,
		userCanDeleteNews,
		userCanCreateComments=false
	}:NewsCardProps)
{
	const [isOpen,setIsOpen]=useState(false);
	return (
		<div className="p-6 rounded-lg shadow-lg dark:bg-gray-800 hover:shadow-xl transition-all bg-white max-w-lg min-w-md mx-auto mt-6">
			<NewsCardPreOpen
				newsId={newsId}
				coverUrl={coverUrl}
				title={truncate(title,48)}
				content={truncate(content,42)}
				createdAt={createdAt}
				updatedAt={updatedAt}
				setIsOpen={setIsOpen}
				userCanEditNews={userCanEditNews}
				userCanDeleteNews={userCanDeleteNews}
			/>
			<NewsCardPostOpen
				newsId={newsId}
				title={title}
				coverUrl={coverUrl}
				content={content}
				createdAt={createdAt}
				updatedAt={updatedAt}
				open={isOpen}
				onClose={()=>setIsOpen(false)}
				userCanEditNews={userCanEditNews}
				userCanDeleteNews={userCanDeleteNews}
				userCanCreateComments={userCanCreateComments}
			/>
		</div>
	);
}


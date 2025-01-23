import findPermissionsInRoles from '../FindPermissionsInRoles';
import {useAuth}              from "../../Components/AuthProvider.tsx";
import {NewsItem}             from "../../types";
import {NewsCard}             from "./NewsCard.tsx";

interface NewsListProps
{
	news:NewsItem[]
}

function NewsList({news}:NewsListProps)
{
	const {auth:{user,roles}}=useAuth();
	const [userCanEditNews,userCanDeleteNews,userCanCreateComments]=
		findPermissionsInRoles(user,roles,['edit news','delete news','create comments']);

	// Функция для обрезания текста с эллипсисом
	const truncate=(text:string,maxLength:number)=>
		text.length>maxLength-3
		?`${text.slice(0,maxLength-3)}...`
		:text;

	return (
		<div className="grid gap-6 grid-cols-3 p-6 flex-wrap">
			{news.map(
				({id,title,content,createdAt,updatedAt,coverUrl})=>
					<NewsCard
						key={id}
						newsId={id}
						coverUrl={coverUrl}
						title={truncate(title,24)}
						content={truncate(content,24)}
						createdAt={createdAt}
						updatedAt={updatedAt}
						userCanEditNews={userCanEditNews}
						userCanDeleteNews={userCanDeleteNews}
						userCanCreateComments={userCanCreateComments}
					/>
			)}
		</div>
	);
}


export default NewsList;

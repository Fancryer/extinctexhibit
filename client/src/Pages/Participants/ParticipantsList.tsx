// import React from 'react';
// import {NewsItem} from '@/Pages/News';
//
// interface NewsListProps
// {
// 	news:NewsItem[];
// }
//
// const NewsList:React.FC<NewsListProps>=({news})=>{
// 	return (
// 		<div>
// 			<h1>Новости</h1>
// 			{news.map((newsItem)=>(
// 				<div key={newsItem.id}>
// 					<h2>{newsItem.title}</h2>
// 					<p>{newsItem.content}</p>
// 					<small>Опубликовано: {new Date(newsItem.created_at).toLocaleDateString()}</small>
// 				</div>
// 			))}
// 		</div>
// 	);
// };
//
// export default NewsList;

// import React      from 'react';
// import {NewsItem} from '@/Pages/News';
//
// interface NewsListProps
// {
// 	news:NewsItem[];
// }
//
// const NewsList:React.FC<NewsListProps>=({news})=>(
// 	<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
// 		{news.map(({id,title,content,created_at})=>(
// 			<div
// 				key={id}
// 				className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow"
// 			>
// 				<h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
// 					{title}
// 				</h2>
// 				<p className="text-gray-700 dark:text-gray-300">
// 					{content}
// 				</p>
// 				<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
// 					Опубликовано: {new Date(created_at).toLocaleDateString()}
// 				</small>
// 			</div>
// 		))}
// 	</div>
// );
//
// export default NewsList;

import ResponsiveNavLink                             from '@/Components/ResponsiveNavLink';
import findPermissionsInRoles,{hasPermissionInRoles} from '@/Pages/FindPermissionsInRoles';
import {Event,Auth}                                  from '@/types';
import {useState}                                    from 'react';

interface ParticipantsListProps
{
	events:Event[];
	user:Auth['user'];
	roles:Auth['roles'];
}

export default function ParticipantsList({events,user,roles}:ParticipantsListProps)
{
	// Функция для обрезания текста с эллипсисом
	const truncate=(text:string,maxLength:number)=>
		text.length>maxLength-3
		?`${text.slice(0,maxLength-3)}...`
		:text;

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 p-6">
			{events.map((event,i)=>{
				const {description,end_time,hall,id,organizer,participants,start_time,title}=event;
				return (
					<div
						key={i}
						className="p-4 rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow bg-white max-w-md mx-auto"
					>
						<div>
							<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
								{truncate(title,24)}
							</h2>
							<div className="text-gray-700 dark:text-gray-300 mb-4">
								{truncate(organizer,24)}
							</div>
							<div className="text-gray-700 dark:text-gray-300 mb-4">
								{truncate(description,24)}
							</div>
							<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
								hall: {truncate(hall.name,24)}
							</small>
							{participants.length?<ParticipantAccordion participants={participants}/>:null}
							{!participants.length&&
							 <div className="text-gray-700 dark:text-gray-300 mb-4">
								 No participants
							 </div>}
						</div>
					</div>
				);
			})}
		</div>
	);
}

interface ParticipantAccordionProps
{
	participants:number[]
}

function ParticipantAccordion({participants}:ParticipantAccordionProps)
{
	const [open,setOpen]=useState(false);

	return (
		<div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow">
			<div
				onClick={()=>{
					setOpen(previousState=>!previousState);
				}}
				className="flex justify-between items-center cursor-pointer"
			>
				<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
					Participants
				</h2>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
			{
				open
				&&participants.map(participant=>(
					<div
						key={participant}
						className="text-gray-700 dark:text-gray-300 mb-4"
					>
						{participant}
					</div>
				))
			}
		</div>
	);
}
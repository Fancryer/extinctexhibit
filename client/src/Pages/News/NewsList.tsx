import {NewsItem}             from './NewsIndex.tsx';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import findPermissionsInRoles from '../FindPermissionsInRoles';
import {useAuth}              from "../../Components/AuthProvider.tsx";

interface NewsListProps
{
	news:NewsItem[]
}

function NewsList({news}:NewsListProps)
{
	const {auth:{user,roles}}=useAuth();
	const [userCanEditNews,userCanDeleteNews]=findPermissionsInRoles(user,roles,['edit news','delete news']);

	// Функция для обрезания текста с эллипсисом
	const truncate=(text:string,maxLength:number)=>
		text.length>maxLength-3
		?`${text.slice(0,maxLength-3)}...`
		:text;

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 p-6">
			{news.map(newsItem=>{
				const {id,title,content,created_at,cover_url}=newsItem;
				return (
					<div
						key={id}
						className="p-4 rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow bg-white max-w-md mx-auto"
					>
						{
							cover_url
							&&<div
                                className="w-full h-48 mb-4 rounded-lg bg-cover bg-center"
                                style={{backgroundImage:`url(${cover_url})`}}
                            />
						}
						<div>
							<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
								{truncate(title,24)}
							</h2>
							<div className="text-gray-700 dark:text-gray-300 mb-4">
								{truncate(content,24)}
							</div>
							<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
								Опубликовано: {new Date(created_at).toLocaleDateString()}
							</small>
						</div>
						{
							userCanEditNews
							&&<div className="mt-4 flex flex-row justify-between">
								{
									userCanDeleteNews
									&&<ResponsiveNavLink
                                        className="rounded-lg bg-red-200 hover:bg-red-300"
										// href={route('news.delete',{news:id})}
                                    >
                                        Delete
                                    </ResponsiveNavLink>}
                                <ResponsiveNavLink
                                    className="rounded-lg bg-violet-200 hover:bg-violet-300"
									// href={route('news.edit',{news:id})}
                                >
                                    Edit
                                </ResponsiveNavLink>
                            </div>
						}
					</div>
				);
			})}
		</div>
	);
}


export default NewsList;

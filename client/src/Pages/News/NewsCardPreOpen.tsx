import React,{useState}  from "react";
import ResponsiveNavLink from "../../Components/ResponsiveNavLink.tsx";
import {NewsCardProps}    from "./NewsCard.tsx";
import {Link,useNavigate} from "@tanstack/react-router";
import api                from "../../api.tsx";
import Cookies           from "js-cookie";

interface NewsCardPreOpenProps extends Omit<NewsCardProps,'userCanCreateComments'>
{
	setIsOpen:(isOpen:boolean)=>void
}

export function NewsCardPreOpen(
	{
		newsId,
		coverUrl,
		title,
		content,
		createdAt,
		updatedAt,
		userCanEditNews,
		userCanDeleteNews,
		setIsOpen
	}:NewsCardPreOpenProps
)
{
	const [isCoverPreviewOpen,setIsCoverPreviewOpen]=useState(false);
	const handleImageClick=()=>setIsCoverPreviewOpen(true);
	const handleCloseCoverPreview=()=>setIsCoverPreviewOpen(false);
	const navigate=useNavigate();
	async function handleDelete(e:React.MouseEvent<HTMLButtonElement>)
	{
		e.preventDefault();
		console.debug('deleting news: ',newsId);
		await api.delete('/news',{
			params:{
				accessToken:Cookies.get('accessToken')||'',
				newsId
			}
		}).then(()=>{
			navigate({to:"/news"})
		})
		// await api.delete(`/news/${newsId}`)
		// 		 .then(async()=>{
		// 			 await onNewsDelete();
		// 			 await router.navigate({replace:true})
		// 		 })
	}

	return (
		<>
			{
				coverUrl
				&&<div
                    className="w-[30rem] h-64 mb-6 rounded-lg bg-cover bg-center cursor-pointer"
                    style={{
						backgroundImage:`url(http://localhost:6060/api/uploads/${coverUrl})`
					}}
                    onClick={handleImageClick}
                />
			}
			<div>
				<h2
					className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 transition-colors cursor-pointer"
					onClick={()=>setIsOpen(true)}
				>
					{title}
				</h2>
				<div className="text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
					{content}
				</div>
				<div className="flex flex-row justify-between">
					<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
						Published: {new Date(createdAt).toLocaleDateString()}
					</small>
					<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
						Modified: {new Date(updatedAt).toLocaleDateString()}
					</small>
				</div>
			</div>
			{
				(userCanDeleteNews||userCanEditNews)
				&&<div className="mt-5 flex justify-between items-center">
					{
						userCanDeleteNews
						&&<button
                            className="px-4 py-2 rounded-lg bg-red-300 hover:bg-red-400 text-white transition-colors"
							onClick={handleDelete}
                        >
                            Delete
                        </button>
					}
					{
						userCanEditNews
						&&<Link
                            className="px-4 py-2 rounded-lg bg-violet-300 hover:bg-violet-400 text-white transition-colors"
                            to={'/news/edit/$newsId'}
                            params={{newsId:`${newsId}`}}
                        >
                            Edit
                        </Link>
					}
                </div>
			}
			{
				isCoverPreviewOpen
				&&<div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={handleCloseCoverPreview}
                >
                    <img
                        src={`http://localhost:6060/api/uploads/${coverUrl}`}
                        alt="News Cover"
                        className="rounded-lg shadow-lg max-w-[75%] max-h-[50vh]"
                        onClick={e=>e.stopPropagation()}
                    />
                </div>
			}
		</>
	);
}
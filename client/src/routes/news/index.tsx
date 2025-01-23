import {createFileRoute}      from '@tanstack/react-router'
import NewsList               from '../../Pages/News/NewsList';
import {hasPermissionInRoles} from '../../Pages/FindPermissionsInRoles';
import AuthenticatedLayout    from '../../Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import {Comment,NewsItem}     from '../../types';
import {useEffect,useState}   from "react";
import api                    from "../../api.tsx";
import {useAuth}              from '../../Components/AuthProvider.tsx';
import NavLink                from "../../Components/NavLink.tsx";

export const Route=
	createFileRoute('/news/')({component:NewsIndex})

export default function NewsIndex()
{
	const [news,setNews]=useState<NewsItem[]>([]);
	useEffect(()=>{
		const fetchNews=async()=>
			await api.get<NewsItem[]>('news').then(
				response=>response.data
			);
		fetchNews().then(n=>{
			console.debug('News: ',n);
			setNews(n);
		});
	},[]);
	return (
		<AuthenticatedLayout
			isCentered
			elseRedirectToLogin={false}
			header={<YouCanAddNews newsArePresent={news.length>0}/>}
		>
			{/*<Head title="NewsIndex"/>*/}
			<NewsIndexInner news={news}/>
		</AuthenticatedLayout>
	);
}

function NewsIndexInner({news}:{news:NewsItem[]})
{
	const {auth:{user,roles}}=useAuth();
	const userCanCreateNews=hasPermissionInRoles(user,roles,'create news');
	return (
		news.length>0
		&&<div className="py-12">
            <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                <div className="flex flex-col overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <NewsList news={news}/>
					{
						userCanCreateNews
						&&<div className="p-4 dark:bg-gray-800 transition-shadow w-36 self-end">
                            <ResponsiveNavLink
                                className="rounded-lg"
                                props={{to:'/news/create'}}
                            >
                                Add news
                            </ResponsiveNavLink>
                        </div>
					}
                </div>
            </div>
        </div>
	);
}

function YouCanAddNews({newsArePresent}:{newsArePresent:boolean})
{
	const {auth:{user,roles}}=useAuth();
	const userCanCreateNews=hasPermissionInRoles(user,roles,'create news');
	return (
		!newsArePresent
		&&userCanCreateNews
		?<NavLink to="/news/create">
			There is no news yet, but you can add one
		</NavLink>
		:<div className="text-2xl">
			News page
		</div>
	);
}
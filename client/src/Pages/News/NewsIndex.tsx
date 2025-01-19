// import {Head,usePage}         from '@inertiajs/react';
import NewsList               from '../News/NewsList';
// import React                  from 'react';
import AuthenticatedLayout    from '../../Layouts/AuthenticatedLayout';
import ResponsiveNavLink      from '../../Components/ResponsiveNavLink';
import {hasPermissionInRoles} from '../FindPermissionsInRoles';
import {Auth,Comment}         from '../../types';
import getAuth                from "../../Auth.ts";

export interface NewsItem
{
	id:number;
	title:string;
	content:string;
	created_at:string;
	cover_url?:string;
	comments:[Comment];
}

interface NewsIndexProps
{
	auth?:Auth;
	news:NewsItem[];
}

export default function NewsIndex({news}:NewsIndexProps)
{
	const {user,roles}=getAuth();
	const newsArePresent=news.length>0;
	const userCanCreateNews=hasPermissionInRoles(user,roles,'create news');
	return <AuthenticatedLayout
		isCentered
		header={
			!newsArePresent
			&&userCanCreateNews
			&&<ResponsiveNavLink>{/*('news.create')*/}
                There is no news yet, but you can add one
            </ResponsiveNavLink>
		}>
		{/*<Head title="NewsIndex"/>*/}
		{
			newsArePresent
			&&<div className="py-12">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <NewsList news={news} roles={roles} user={user}/>
						{
							newsArePresent
							&&userCanCreateNews
							&&<div className="p-4 dark:bg-gray-800 transition-shadow w-36 self-end">
                                <ResponsiveNavLink
                                    className="rounded-lg"
									// href={route('news.create')}
                                >
                                    Add event
                                </ResponsiveNavLink>
                            </div>
						}
                    </div>
                </div>
            </div>
		}
	</AuthenticatedLayout>;
}
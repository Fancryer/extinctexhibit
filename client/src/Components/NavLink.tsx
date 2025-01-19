// import {InertiaLinkProps,Link} from '@inertiajs/react';

/*
interface ResponsiveNavLinkProps
{
	active?:boolean,
	children?:ReactNode,
	className?:string,
	props?:LinkProps
}

function ResponsiveNavLink(
	{active=false,className='',children,...props}
		:ResponsiveNavLinkProps&{active?:boolean}
)
{
	return <Link
		{...props}
		className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
			active
			?'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800 dark:border-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 dark:focus:border-indigo-300 dark:focus:bg-indigo-900 dark:focus:text-indigo-200'
			:'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-700 dark:focus:text-gray-200'
		} text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
	>
		{children}
	</Link>;
}
*/

import {Link,LinkProps} from "@tanstack/react-router";
import {ReactNode}      from "react";

interface NavLinkProps
{
	active?:boolean,
	children?:ReactNode,
	className?:string
}

export default function NavLink(
	{active=false,className='',children,...props}:NavLinkProps&LinkProps
)
{
	return <Link
		{...props}
		className={
			'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none '+
			(active
			 ?'border-indigo-400 text-gray-900 focus:border-indigo-700 dark:border-indigo-600 dark:text-gray-100'
			 :'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300 dark:focus:border-gray-700 dark:focus:text-gray-300')+
			className
		}
	>
		{children}
	</Link>;
}

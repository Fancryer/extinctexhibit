// import ApplicationLogo     from '@/Components/ApplicationLogo';
// import {Link}              from '@inertiajs/react';
// import {PropsWithChildren} from 'react';
//
// export default ({children}:PropsWithChildren)=>(
// 	<div className="flex min-h-screen w-full flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
// 		<div>
// 			<Link href="/">
// 				<ApplicationLogo className="h-20 w-20 fill-current text-gray-500"/>
// 			</Link>
// 		</div>
// 		<div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
// 			{children}
// 		</div>
// 	</div>
// )
import {PropsWithChildren,ReactNode,useState} from 'react';
import {usePage}                              from '@inertiajs/react';
import {NavigationBar}                        from '@/Layouts/NavigationBar';

export default function GuestLayout(
	{header,children}:PropsWithChildren<{header?:ReactNode}>
)
{
	const auth=usePage().props.auth;
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<NavigationBar auth={auth}/>
			{header&&(
				<header className="bg-white shadow dark:bg-gray-800">
					<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
						{header}
					</div>
				</header>
			)}
			<main>{children}</main>
		</div>
	);
}

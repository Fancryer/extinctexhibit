import {PropsWithChildren,ReactNode} from 'react';
import {NavigationBar}               from './NavigationBar';
import '../index.css';
import {AuthProvider}                from "../Components/AuthProvider.tsx";


interface AuthenticatedLayoutProps extends PropsWithChildren<{header?:ReactNode}>
{
	isCentered?:boolean,
	isFlex?:boolean,
	elseRedirectToLogin?:boolean
}

export default function AuthenticatedLayout(
	{header,isCentered=false,isFlex=isCentered,elseRedirectToLogin=true,children}:AuthenticatedLayoutProps
)
{
	return (
		<AuthProvider elseRedirectToLogin={elseRedirectToLogin}>
			<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
				<NavigationBar/>
				{
					header
					&&<header className="bg-white shadow dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
							{header}
                        </div>
                    </header>
				}
				<main
					className={
						`${isFlex?'flex':''} ${isCentered?'items-center justify-center min-h-[calc(100vh-65px)]':''}`
					}
				>
					{children}
				</main>
			</div>
		</AuthProvider>
	);
}

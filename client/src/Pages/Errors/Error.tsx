import GuestLayout         from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {usePage}           from '@inertiajs/react';

export default function Error({status}:{status:number}){
	const title={
		503:'503: Service Unavailable',
		500:'500: Server Error',
		404:'404: Page Not Found',
		403:'403: Forbidden'
	}[status];

	const description={
		503:'Sorry, we are doing some maintenance. Please check back soon.',
		500:'Whoops, something went wrong on our servers.',
		404:'Sorry, the page you are looking for could not be found.',
		403:'Sorry, you are forbidden from accessing this page.'
	}[status]

	console.log(status)
	return (
		<GuestLayout
			header={
				<>
					<h1 className="text-4xl font-bold text-red-500">{title||`Error with status ${status}`}</h1>
					<div className="mt-4 justify-center">{description||'Unknown error.'}</div>
				</>
			}
		>
		</GuestLayout>
	)
}
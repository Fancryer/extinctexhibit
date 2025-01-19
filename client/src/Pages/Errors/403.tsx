// resources/js/Pages/Errors/403.tsx
import {FC}   from 'react';
import {Head} from '@inertiajs/react';

const Error403:FC=()=>{
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="text-center">
				<Head title="403 - Forbidden"/>
				<h1 className="text-4xl font-bold text-red-500">403 - Forbidden</h1>
				<p className="mt-4">You do not have permission to access this page.</p>
			</div>
		</div>
	);
};

export default Error403;

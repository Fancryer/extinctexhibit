import React,{useState}    from 'react';
import {Head,router}       from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useForm}           from '@inertiajs/react';
import {FormEventHandler}  from 'react';
import InputLabel          from '@/Components/InputLabel';
import TextInput           from '@/Components/TextInput';
import PrimaryButton       from '@/Components/PrimaryButton';
import InputError          from '@/Components/InputError';
import {Transition}        from '@headlessui/react';

type CreateHallFormState={
	name:string;
	location:string;
	capacity:number;
};

export default ()=>{
	const {data,setData,post,errors,processing,recentlySuccessful}=
		useForm<CreateHallFormState>(
			{
				name:    '',
				location:'',
				capacity:1
			}
		);

	const submit:FormEventHandler=(e)=>{
		e.preventDefault();
		router.post(route('halls.store'),data);
	};

	return (
		<AuthenticatedLayout
			header={<div>Create Hall</div>}
			isCentered
		>
			<Head title="Create Hall"/>
			<section>
				<header>
					<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
						Create Hall
					</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Fill out the details for the new hall.
					</p>
				</header>
				<form
					onSubmit={submit}
					className="mt-6 space-y-6 w-[calc(100%+8rem)]"
					method="post"
				>
					<div>
						<InputLabel htmlFor="name" value="Name"/>
						<TextInput
							id="name"
							className="mt-1 block w-full"
							value={data.name}
							onChange={(e)=>setData('name',e.target.value)}
							required
						/>
						<InputError className="mt-2" message={errors.name}/>
					</div>
					<div>
						<InputLabel htmlFor="location" value="Location"/>
						<TextInput
							id="location"
							className="mt-1 block w-full"
							value={data.location}
							onChange={(e)=>setData('location',e.target.value)}
							multiline
							required
						/>
						<InputError className="mt-2" message={errors.location}/>
					</div>
					<div>
						<InputLabel htmlFor="capacity" value="Capacity"/>
						<TextInput
							id="capacity"
							type="number"
							className="mt-1 block w-full"
							value={data.capacity}
							min={1}
							onChange={(e)=>setData('capacity',parseInt(e.target.value,10))}
							required
						/>
						<InputError className="mt-2" message={errors.capacity}/>
					</div>
					<div className="flex items-center gap-4">
						<PrimaryButton disabled={processing}>Save</PrimaryButton>
						<Transition
							show={recentlySuccessful}
							enter="transition ease-in-out"
							enterFrom="opacity-0"
							leave="transition ease-in-out"
							leaveTo="opacity-0"
						>
							<p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
						</Transition>
					</div>
				</form>
			</section>
		</AuthenticatedLayout>
	);
};

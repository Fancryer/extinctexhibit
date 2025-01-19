import AuthenticatedLayout      from '@/Layouts/AuthenticatedLayout';
import ResponsiveNavLink        from '@/Components/ResponsiveNavLink';
import {Head,useForm}           from '@inertiajs/react';
import HallsList                from '@/Pages/Halls/HallsList';
import React,{FormEventHandler} from 'react';
import {Hall}                   from '@/types';
import InputLabel               from '@/Components/InputLabel';
import TextInput                from '@/Components/TextInput';
import InputError               from '@/Components/InputError';
import PrimaryButton            from '@/Components/PrimaryButton';
import {Transition}             from '@headlessui/react';

interface EditHallState
{
	name:string;
	location:string;
	capacity:number;
}

interface EditHallProps
{
	hall:Hall;
}

export default function EditHall({hall}:EditHallProps)
{
	const {data,setData,post,errors,processing,recentlySuccessful}=
		useForm<EditHallState>(
			{
				name:    hall.name,
				location:hall.location,
				capacity:hall.capacity
			}
		);
	console.log("hall",hall);
	console.log("data",data);
	const submit:FormEventHandler=e=>{
		e.preventDefault();
		post(route('halls.update',{hall:{id:hall.id,...data}}));
	};
	return <AuthenticatedLayout isCentered>
		<Head title="Edit hall"/>
		<section className="w-[480px]">
			<header>
				<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
					Edit Hall
				</h2>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Fill out new details for this hall.
				</p>
			</header>
			<form onSubmit={submit} className="mt-6 space-y-6 w-[calc(100%+8rem)]">
				<div>
					<InputLabel htmlFor="name" value="Name"/>
					<TextInput
						id="name"
						className="mt-1 block w-full"
						value={data.name}
						maxLength={255}
						onChange={e=>setData('name',e.target.value)}
						required
					/>
					<InputError className="mt-2" message={errors.name}/>
				</div>
				<div>
					<InputLabel htmlFor="location" value="Location"/>
					<TextInput
						id="location"
						className="mt-1 block w-full min-h-12"
						value={data.location}
						maxLength={255}
						onChange={e=>setData('location',e.target.value)}
						multiline
						required
					/>
					<InputError className="mt-2" message={errors.location}/>
				</div>
				<div>
					<InputLabel htmlFor="capacity" value="Capacity"/>
					<TextInput
						id="capacity"
						className="mt-1 block w-full"
						value={data.capacity}
						min={1}
						type="number"
						onChange={e=>setData('capacity',+e.target.value)}
						required
					/>
					<InputError className="mt-2" message={errors.location}/>
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
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Saved.
						</p>
					</Transition>
				</div>
			</form>
		</section>
	</AuthenticatedLayout>;
}
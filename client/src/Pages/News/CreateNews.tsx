import React               from 'react';
import {Head,router}       from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useForm}           from '@inertiajs/react';
import {FormEventHandler}  from 'react';
import InputLabel          from '@/Components/InputLabel';
import TextInput           from '@/Components/TextInput';
import PrimaryButton       from '@/Components/PrimaryButton';
import InputError          from '@/Components/InputError';
import {Select,Transition} from '@headlessui/react';
import FileInput           from '@/Components/FileInput';
import {Event}             from '@/types';

interface CreateNewsProps
{
	events:Event[];
}

interface CreateNewsFormState
{
	title:string,
	content:string,
	cover:File|null,
	event_id:number|null;
}

export default function CreateNews({events}:CreateNewsProps)
{
	const {data,setData,post,errors,processing,progress,recentlySuccessful}=
		useForm<CreateNewsFormState>(
			{
				title:   '',
				content: '',
				cover:   null,
				event_id:null
			}
		);

	const submit:FormEventHandler=e=>{
		e.preventDefault();
		// @ts-ignore
		router.post(route('news.store'),data);
	};

	return (
		<AuthenticatedLayout
			header={<div>Create News</div>}
			isCentered
		>
			<Head title="Create News"/>
			<section>
				<header>
					<h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
						Create News
					</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Fill out the details for the new news.
					</p>
				</header>
				<form
					onSubmit={submit}
					className="mt-6 space-y-6 w-[calc(100%+8rem)]"
					method="post"
					encType="multipart/form-data"
				>
					<div>
						<InputLabel htmlFor="tile" value="Title"/>
						<TextInput
							id="tile"
							className="mt-1 block w-full"
							value={data.title}
							onChange={(e)=>setData('title',e.target.value)}
							required
						/>
						<InputError className="mt-2" message={errors.title}/>
					</div>
					<div>
						<InputLabel htmlFor="content" value="Content"/>
						<TextInput
							id="content"
							className="mt-1 block w-full"
							value={data.content}
							onChange={(e)=>setData('content',e.target.value)}
							multiline
							required
						/>
						<InputError className="mt-2" message={errors.content}/>
					</div>
					<div>
						<InputLabel htmlFor="hall_id" value="Event"/>
						{
							!events.length
							?<div
								className="rounded-md bg-white shadow-sm border-red-500 border-2 h-[calc(42px)] ring-indigo-500 dark:bg-gray-900 dark:text-gray-300 dark:border-red-600 dark:ring-indigo-600 mt-1 flex w-full justify-center items-center">
								No events available
							</div>
							:<select
								id="hall_id"
								className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block w-full"
								onChange={
									({target})=>{
										console.log(`Form value: ${target.value}`);
										setData('event_id',target.value=='null'?null:+target.value);
									}
								}
								required
							>
								<option key="none" value="null">
									None
								</option>
								{
									events.map(
										({id,title,start_time,end_time})=>
											<option key={id} value={id}>
												{title} ({new Date(start_time).toLocaleString()} - {new Date(end_time).toLocaleString()})
											</option>
									)
								}
							</select>
						}
					</div>
					<div>
						<InputLabel htmlFor="file" value="File"/>
						<FileInput
							name={"file"}
							onChange={
								f=>{
									setData('cover',f);
									console.log(f);
								}
							}/>
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
}

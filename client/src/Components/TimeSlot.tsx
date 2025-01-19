import {Dialog,DialogPanel,DialogTitle} from '@headlessui/react';
import React,{useState}                 from 'react';
import {Event}                          from '@/types';

interface TimeSlotProps
{
	id:number|null,
	isSelected?:boolean,
	events:Event[],
	start:Date,
	end:Date,
	onSlotSelect:()=>void
}

export function TimeSlot({id,isSelected=false,events,start,end,onSlotSelect}:TimeSlotProps)
{
	const [isOpen,setIsOpen]=useState(false);
	return (
		<div>
			<div
				className={
					`relative flex rounded-lg p-2 bg-${
						id===null?'gray':'green'
					}-200 ${
						isSelected?'border-black border-[1px]':''
					}`
				}
			>
				<button
					className="w-fit max-h-8"
					onClick={()=>setIsOpen(true)}
					disabled={id!==null}
				>
					{
						events.find(e=>e.id===id)
							?.title
						??'Free time slot'
					}
				</button>
			</div>
			<Dialog
				open={isOpen}
				onClose={()=>setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-blur dark:backdrop-blur shadow-lg">
					<DialogPanel
						className="flex flex-col min-w-[640px] max-w-screen-xl space-y-6 border bg-white p-12 rounded-lg text-gray-800 dark:text-gray-100"
					>
						<DialogTitle
							className="font-bold flex flex-row justify-between"
							children={
								<>
									<div>
										{
											events.find(e=>e.id===id)
												?.title
											??'Free time slot'
										}
									</div>
									<div className="text-green-500">
										<button
											onClick={
												()=>{
													onSlotSelect();
													setIsOpen(false);
												}
											}
											children="Select"
										/>
									</div>
									<div className="text-red-500">
										<button onClick={()=>setIsOpen(false)} children="Close"/>
									</div>
								</>
							}
						/>
						<div className="flex justify-between">
							<div className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
								Start: {start.toISOString().slice(0,-8)}
							</div>
							{
								start<=new Date()
								&&new Date()<=new Date(end)
								&&<div className="block mt-4 text-sm text-blue-500 dark:text-gray-400">
									(is going now)
								</div>
							}
							<div className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
								End: {
								end<new Date(8_640_000_000_000_000)
								?`${end.toISOString().slice(0,-8)}`
								:'∞'
							}
							</div>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</div>
	);
}
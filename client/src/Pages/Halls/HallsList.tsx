import {Hall}           from '../../types';
import React,{useState} from "react";

interface HallsListProps
{
	halls:Hall[]
}

export default function HallsList({halls}:HallsListProps)
{
	return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
		{halls.map(
			hall=><HallCard key={hall.id} hall={hall}/>
		)}
	</div>;
}

function HallCard({hall}:{hall:Hall})
{
	const [isCoverPreviewOpen,setIsCoverPreviewOpen]=useState(false);
	const handleImageClick=()=>setIsCoverPreviewOpen(true);
	const handleCloseCoverPreview=()=>setIsCoverPreviewOpen(false);
	const {id,name,location,capacity}=hall;
	const hallCoverUrl=`http://localhost:6060/api/halls/${hall.name}`;
	return (
		<>
			<div
				key={id}
				className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg transition-shadow"
			>
				<div
					className="w-[30rem] h-64 mb-6 rounded-lg bg-cover bg-center cursor-pointer"
					style={{backgroundImage:`url(${hallCoverUrl})`}}
					onClick={handleImageClick}
				/>
				<h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
					{name}
				</h2>
				<p className="text-gray-700 dark:text-gray-300">
					{location}
				</p>
				<small className="block mt-4 text-sm text-gray-500 dark:text-gray-400">
					Capacity: {capacity}
				</small>
			</div>
			{
				isCoverPreviewOpen
				&&<div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                    onClick={handleCloseCoverPreview}
                >
                    <img
                        src={hallCoverUrl}
                        alt="Hall Cover"
                        className="rounded-lg shadow-lg max-w-[75%] max-h-[50vh]"
                        onClick={e=>e.stopPropagation()}
                    />
                </div>
			}
		</>
	);
}
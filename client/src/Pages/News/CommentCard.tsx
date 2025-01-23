import {Comment} from "../../types";

import {FaReply,FaThumbsUp} from 'react-icons/fa';


export function CommentCard({ comment }: { comment: Comment }) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-4 hover:shadow-2xl transition-shadow duration-300 ease-in-out">
			<div className="flex items-center space-x-4">
				{/* Аватар */}
				<div className="flex-shrink-0">
					<img
						src={`https://avatars.dicebear.com/api/initials/${comment.ownerProsoponym}.svg`}
						alt="Avatar"
						className="w-14 h-14 rounded-full border-2 border-blue-500 dark:border-blue-300"
					/>
				</div>
				{/* Информация о пользователе */}
				<div>
					<p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{comment.ownerProsoponym}</p>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{new Date(comment.createdAt).toLocaleDateString()}
					</p>
				</div>
			</div>

			{/* Контент комментария */}
			<div className="mt-4 text-gray-800 dark:text-gray-300">
				<p className="leading-relaxed">{comment.content}</p>
			</div>

			{/* Элементы взаимодействия */}
			<div className="flex space-x-4 mt-4">
				<button className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors duration-200">
					<FaReply className="mr-2" />
					Reply
				</button>
				<button className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
					<FaThumbsUp className="mr-2" />
					Like
				</button>
			</div>
		</div>
	);
}

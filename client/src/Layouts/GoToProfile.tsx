import {useUser}         from '../Components/UserGuard';
import ResponsiveNavLink from '../Components/ResponsiveNavLink';

export default function GoToProfile()
{
	const user=useUser();
	return <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
		<div className="px-4">
			<div className="text-base font-medium text-gray-800 dark:text-gray-200">
				{user.prosoponym}
			</div>
			<div className="text-sm font-medium text-gray-500">
				{user.email}
			</div>
		</div>
		<div className="mt-3 space-y-1">
			<ResponsiveNavLink
				// href={'profile.edit'}
			>
				Profile
			</ResponsiveNavLink>
			<ResponsiveNavLink
				// href={'logout'}
				// as="button"
			>
				Log Out
			</ResponsiveNavLink>
		</div>
	</div>
}
import {MaybeAuth} from '../types';

const findPermissionsInRoles=(
	user:MaybeAuth['user'],
	roles:MaybeAuth['roles'],
	permissions:string[]
)=>
	user
	?permissions.map(
		permission=>roles.some(
			({permissions:rolePermissions})=>rolePermissions.includes(permission)
		)
	)
	:permissions.map((_)=>false);

const hasPermissionInRoles=(
	user:MaybeAuth['user'],
	roles:MaybeAuth['roles'],
	permission:string
)=>findPermissionsInRoles(user,roles,[permission]).includes(true);

const findCrudPermissionsInRoles=(
	user:MaybeAuth['user'],
	roles:MaybeAuth['roles'],
	what:string
)=>findPermissionsInRoles(
	user,
	roles,
	['create','edit','delete'].map(p=>`${p} ${what}`)
);

export default findPermissionsInRoles;
export {findCrudPermissionsInRoles,hasPermissionInRoles};
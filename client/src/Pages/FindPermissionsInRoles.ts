import {Auth} from '../types';

const findPermissionsInRoles=(
	user:Auth['user']|null,
	roles:Auth['roles'],
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
	user:Auth['user']|null,
	roles:Auth['roles'],
	permission:string
)=>findPermissionsInRoles(user,roles,[permission]).includes(true);

const findCrudPermissionsInRoles=(
	user:Auth['user']|null,
	roles:Auth['roles'],
	what:string
)=>findPermissionsInRoles(
	user,
	roles,
	['create','edit','delete'].map(p=>`${p} ${what}`)
);

export default findPermissionsInRoles;
export {findCrudPermissionsInRoles,hasPermissionInRoles};
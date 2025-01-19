package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.entities.Role
import com.fancryer.extinctexhibit.entities.RoleRepository
import com.fancryer.extinctexhibit.entities.RolesPermission
import com.fancryer.extinctexhibit.services.PermissionService
import com.fancryer.extinctexhibit.services.RoleService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/role")
class RoleController(
	private val roleService:RoleService,
	private val roleRepository:RoleRepository,
	private val permissionService:PermissionService
)
{
	@GetMapping
	fun index():(List<RoleDto>)=roleService.index()

	@PostMapping
	fun addRole(name:String,permissions:List<Long>):List<RolesPermission?>
	{
		val role=Role().apply {
			this.name=name
		}.let(roleRepository::save)

		return permissionService.addPermissions(role.id!!,permissions)
	}

	@PutMapping
	fun updateRole(@RequestBody request:UpdateRoleRequest):RoleDto
	{
		return permissionService.updatePermissions(request.id,request.permissionIds)
	}

	data class UpdateRoleRequest(
		val id:Long,
		val name:String?=null,
		val permissionIds:(List<Long>)=emptyList()
	)
}
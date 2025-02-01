package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.dtos.RoleDto
import com.fancryer.extinctexhibit.entities.Role
import com.fancryer.extinctexhibit.entities.RoleRepository
import org.springframework.stereotype.Service

@Service
class RoleService(
	private val roleRepository:RoleRepository,
	private val permissionService:PermissionService,
)
{
	fun index()=roleRepository.findAll().map {it.toDto()}

	fun Role.toDto():RoleDto=RoleDto(
		id!!,
		name!!,
		permissionService.findAllByRoleId(id!!)
			.mapNotNull {it.name}
	)
}

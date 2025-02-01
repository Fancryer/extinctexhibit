package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.dtos.RoleDto
import com.fancryer.extinctexhibit.entities.*
import com.fancryer.extinctexhibit.repositories.PermissionRepository
import com.fancryer.extinctexhibit.repositories.RolesPermissionRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate

@Service
class PermissionService(
	private val rolePermissionRepository:RolesPermissionRepository,
	private val transactionTemplate:TransactionTemplate,
	private val permissionRepository:PermissionRepository,
	private val roleRepository:RoleRepository
)
{
	fun findAllByRoleId(id:Long)=
		rolePermissionRepository.findByRole_Id(id)
			.mapNotNull {it.permission}

	fun addPermission(roleId:Long,name:String):RolesPermission?
	{
		return transactionTemplate.execute {
			permissionRepository.save(
				Permission().apply {this.name=name}
			).let {
				addPermission(roleId,it)
			}
		}
	}

	fun addPermission(roleId:Long,permission:Permission):RolesPermission?
	{
		return transactionTemplate.execute {
			val role=roleRepository.findById(roleId).get()
			RolesPermission().apply {
				this.role=role
				this.permission=permission
			}.let(rolePermissionRepository::save)
		}
	}

	fun addPermissions(roleId:Long,ids:List<Long>):List<RolesPermission?>
	{
		return transactionTemplate.execute {
			val rolePermissions=rolePermissionRepository.findAllByRole_Id(roleId)
				.mapNotNull {it.permission}
				.toSet()
			val permissions=ids.toSet()
				.let(permissionRepository::findAllById)
				.toSet()
			val toDelete=(rolePermissions-permissions).mapNotNull {it!!.id!!}.toSet()
			rolePermissionRepository.deleteAllById(toDelete)
			val toAdd=(permissions-rolePermissions)
				.map {addPermission(it.id!!,it!!.name!!)}.toSet()
			toAdd.toList()
		}.orEmpty()
	}

	/**
	 * 1. Check if the role exists
	 * 2. Delete all the permissions that are not in the new list
	 * 3. Add all the permissions that are in the new list
	 */
	fun updatePermissions(roleId:Long,newPermissionIds:List<Long>):(RoleDto)=
		transactionTemplate.execute {
			//1.
			val role=roleRepository.findByIdOrNull(roleId) ?: throw IllegalStateException("Role not found.")
			val oldIds=
				rolePermissionRepository.findAllByRole_Id(roleId)
					.mapNotNull {it.permission!!.id}
					.toSet()
			println("Old ids: $oldIds")
			val newIds=newPermissionIds.toSet()
			println("New ids: $newIds")
			val toDelete=oldIds-newIds
			println("To delete: $toDelete")
			val toAdd=newIds-oldIds
			println("To add: $toAdd")
			//2.
			rolePermissionRepository.deleteAllById(toDelete)
			//3.
			toAdd.mapNotNull {
				val permission=permissionRepository.findByIdOrNull(it) ?: return@mapNotNull null
				RolesPermission().apply {
					this.role=role
					this.permission=permission
				}
			}.let(rolePermissionRepository::saveAll)
			rolePermissionRepository.findByRole_IdOrderByPermission_NameAsc(roleId)
				.mapNotNull {it.permission}
				.mapNotNull {it.name}
				.let {
					RoleDto(roleId,role.name!!,it)
				}
		} ?: throw IllegalStateException()
}

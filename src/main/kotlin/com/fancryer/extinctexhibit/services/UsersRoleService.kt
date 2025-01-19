package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.controllers.RoleDto
import com.fancryer.extinctexhibit.entities.User
import com.fancryer.extinctexhibit.entities.UsersRole
import com.fancryer.extinctexhibit.repositories.UsersRoleRepository
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class UsersRoleService(
	private val userService:UserService,
	private val usersRoleRepository:UsersRoleRepository,
	private val roleService:RoleService
)
{
	fun getInfoByEmail(email:String):AuthInfo
	{
		val user=userService.findByEmail(email)?.mapToInfoDto()
				 ?: throw IllegalStateException("User not found.")
		val roles=usersRoleRepository.findByUser_Email(email).map {
			it.toDto()
		}
		return AuthInfo(user,roles)
	}

	private fun User.mapToInfoDto():UserInfoDto
	{
		val id=id ?: throw IllegalStateException("User not found.")
		val prosoponym=prosoponym ?: throw IllegalStateException("User not found.")
		val email=email ?: throw IllegalStateException("User not found.")
		val emailVerifiedAt=emailVerifiedAt // ?: throw IllegalStateException("Email is not verified .")
		return UserInfoDto(id,prosoponym,email,emailVerifiedAt)
	}

	private fun UsersRole.toDto():RoleDto=
		roleService.run {
			role?.toDto() ?: throw IllegalStateException("Role not found.")
		}

	/*
	data class RoleDto
		val name:String,
		val permissions:List<String>
	*/
}

data class UserInfoDto(
	val id:Long,
	val prosoponym:String,
	val email:String,
	val emailVerifiedAt:Instant?
)
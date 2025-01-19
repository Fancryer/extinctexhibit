package com.fancryer.extinctexhibit.services

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import arrow.core.toOption
import com.fancryer.extinctexhibit.entities.RoleRepository
import com.fancryer.extinctexhibit.entities.User
import com.fancryer.extinctexhibit.entities.UsersRole
import com.fancryer.extinctexhibit.repositories.UserRepository
import com.fancryer.extinctexhibit.repositories.UsersRoleRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import java.util.*
import kotlin.jvm.optionals.getOrElse

@Service
class UserService(
	private val userRepository:UserRepository,
	private val encoder:PasswordEncoder,
	private val usersRoleRepository:UsersRoleRepository,
	private val transactionTemplate:TransactionTemplate,
	private val roleRepository:RoleRepository
)
{
	fun createUser(user:User):(Either<Throwable,User>)=
		user.email?.let {
			userRepository.findByEmail(it)
				.toOption()
				.fold({
					userRepository.save(user.copy(password=encoder.encode(user.password))).right()
				}) {
					IllegalStateException("User already exists.").left()
				}
		} ?: IllegalStateException("No email provided.").left()

	fun findById(id:Long):(Optional<User>)=
		userRepository.findById(id)

	fun findAll():(List<User>)=userRepository.findAll()

	fun deleteById(id:Long):Unit=
		userRepository.deleteById(id)

	fun existsById(id:Long):Boolean=
		userRepository.existsById(id)

	fun addRole(email:String,roleId:Long):(Either<Throwable,List<String>>)=
		try
		{
			transactionTemplate.execute {
				val user=userRepository.findByEmail(email)
						 ?: throw IllegalStateException("User not found.")
				if(usersRoleRepository.existsByRole_IdAndUser_Email(roleId,email))
					emptyList<String>().right()
				else
				{
					val role=roleRepository.findById(roleId).getOrElse {
						throw IllegalStateException("Role not found.")
					}
					usersRoleRepository.save(UsersRole().apply {
						this.user=user
						this.role=role
					})
					usersRoleRepository.findByUser_Email(email).map {it.role?.name!!}.right()
				}
			} ?: emptyList<String>().right()
		}
		catch(e:Throwable)
		{
			e.left()
		}

	fun findByEmail(email:String):User?=
		userRepository.findByEmail(email)
}
package com.fancryer.extinctexhibit.services

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import arrow.core.toOption
import com.fancryer.extinctexhibit.entities.RoleRepository
import com.fancryer.extinctexhibit.entities.User
import com.fancryer.extinctexhibit.entities.UsersRole
import com.fancryer.extinctexhibit.repositories.*
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.*
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
	private val roleRepository:RoleRepository,
	private val commentRepository:CommentRepository,
	private val escortRepository:EscortRepository,
	private val participantRepository:ParticipantRepository
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

	fun deleteById(id:Long)=transactionTemplate.execute {
		usersRoleRepository.deleteByUser_Id(id)
		commentRepository.deleteByUser_Id(id)
		escortRepository.findByParticipant_User_Id(id).forEach {
			escortRepository.deleteById(it.id!!)
		}
		participantRepository.deleteByUser_Id(id)
		userRepository.deleteById(id)
	} ?: Unit

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

	fun updateProsoponymEmail(email:String,newEmail:String,newProsoponym:String):HttpStatus
	{
		return transactionTemplate.execute {
			userRepository.findByEmail(email)?.let {user->
				val prosoponym=user.prosoponym!!
				val id=user.id!!
				when(newEmail to newProsoponym)
				{
					//ne = e, np = p
					Pair(email,prosoponym)->NOT_MODIFIED
					//ne != e, np = p
					Pair(newEmail,prosoponym)->
					{
						if(userRepository.existsByEmail(newEmail))
							CONFLICT
						else
							OK.also {
								userRepository.updateEmailById(newEmail,id)
							}
					}
					// ne = e, np != p
					Pair(email,newProsoponym)->OK.also {
						userRepository.updateProsoponymById(newProsoponym,id)
					}
					//ne != e, np != p
					Pair(newEmail,newProsoponym)->OK.also {
						userRepository.updateEmailAndProsoponymById(newEmail,newProsoponym,id)
					}

					else->INTERNAL_SERVER_ERROR
				}
			} ?: NOT_FOUND
		} ?: INTERNAL_SERVER_ERROR
	}

	fun findByEmail(email:String):User?=
		userRepository.findByEmail(email)
}
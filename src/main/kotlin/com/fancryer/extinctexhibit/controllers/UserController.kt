package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.entities.User
import com.fancryer.extinctexhibit.services.TokenService
import com.fancryer.extinctexhibit.services.UserService
import org.apache.coyote.BadRequestException
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import kotlin.jvm.optionals.getOrNull

data class CreateUserRequest(
	val email:String,
	val password:String,
	val prosoponym:String
)

data class CreateUserResponse(
	val id:Long,
	val email:String,
)

@RestController
@RequestMapping("/api/user")
class UserController(
	private val userService:UserService,
	private val tokenService:TokenService
)
{
	@PostMapping
	fun create(@RequestBody request:CreateUserRequest):CreateUserResponse=
		userService.createUser(request.toModel())
			.fold({throw ResponseStatusException(BAD_REQUEST,it.message)}) {
				it.toResponse()
			}

	@GetMapping
	fun listAll():(List<CreateUserResponse>)=
		userService.findAll().map {it.toResponse()}

	@GetMapping("/{id}")
	fun findByUUID(@PathVariable id:Long):CreateUserResponse=
		userService.findById(id)
			.getOrNull()
			?.toResponse()
		?: throw ResponseStatusException(NOT_FOUND,"User not found.")

	@DeleteMapping("/{id}")
	fun deleteByUUID(@PathVariable id:Long):(ResponseEntity<Boolean>)=
		if(userService.existsById(id))
			userService.deleteById(id).let {
				ResponseEntity.noContent().build()
			}
		else
			throw ResponseStatusException(NOT_FOUND,"User not found.")

	@PostMapping("/add-role")
	fun addRole(@RequestBody request:UserRequest<Long>):(ResponseEntity<List<String>>)
	{
		return tokenService.extractEmail(request.accessToken)?.let {email->
			userService.addRole(email,request.payload)
				.fold({throw BadRequestException(it.message)}) {
					ResponseEntity.ok(it)
				}
		} ?: throw NotFoundException()
	}

	private fun User.toResponse():CreateUserResponse=
		CreateUserResponse(this.id!!,this.email!!)

	private fun CreateUserRequest.toModel():User=
		User().also {
			println("User created: $it for request: $this")
		}.copy(prosoponym,email,password).also {
			println("User copied: $it for request: $this")
		}
}

data class UserRequest<Payload>(val accessToken:String,val payload:Payload)
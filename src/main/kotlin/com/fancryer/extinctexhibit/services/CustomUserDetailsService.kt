package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.repositories.UserRepository
import com.fancryer.extinctexhibit.repositories.UsersRoleRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

typealias ApplicationUser=com.fancryer.extinctexhibit.entities.User

@Service
class CustomUserDetailsService(
	private val userRepository:UserRepository,
	private val usersRoleRepository:UsersRoleRepository
):UserDetailsService
{
	override fun loadUserByUsername(username:String):UserDetails=
		userRepository.findByEmail(username)?.mapToUserDetails()
		?: println("User '$username' not found").let {
			throw UsernameNotFoundException("Not found!")
		}

	private fun ApplicationUser.mapToUserDetails():UserDetails=
		User.builder()
			.username(email)
			.password(password)
			.authorities(
				*usersRoleRepository.findByUser_Id(id!!)
					.map {it.role?.name!!}
					.toTypedArray()
			).build()
}
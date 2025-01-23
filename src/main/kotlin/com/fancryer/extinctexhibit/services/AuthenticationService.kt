package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.configs.JwtProperties
import com.fancryer.extinctexhibit.controllers.AuthenticationRequest
import com.fancryer.extinctexhibit.controllers.AuthenticationResponse
import com.fancryer.extinctexhibit.controllers.RoleDto
import com.fancryer.extinctexhibit.entities.UsersRole
import com.fancryer.extinctexhibit.repositories.RefreshTokenRepository
import com.fancryer.extinctexhibit.repositories.UsersRoleRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthenticationService(
	private val authManager:AuthenticationManager,
	private val userDetailsService:CustomUserDetailsService,
	private val tokenService:TokenService,
	private val jwtProperties:JwtProperties,
	private val refreshTokenRepository:RefreshTokenRepository,
	private val usersRoleRepository:UsersRoleRepository,
)
{
	fun authentication(request:AuthenticationRequest):AuthenticationResponse=
		UsernamePasswordAuthenticationToken(
			request.email,
			request.password
		).let {
			println("Authenticating: $it")
			authManager.authenticate(it)
		}.run {
			userDetailsService.loadUserByUsername(request.email).let {user->
				AuthenticationResponse(
					createAccessToken(user),
					createRefreshToken(user).also {
						refreshTokenRepository.save(it,user)
					}
				)
			}
		}

	fun refreshAccessToken(refreshToken:String):String?=
		tokenService.extractEmail(refreshToken)?.let {email->
			val currentUserDetails=userDetailsService.loadUserByUsername(email)
			val refreshTokenUserDetails=refreshTokenRepository.findUserDetailsByToken(refreshToken)
			if(!tokenService.isExpired(refreshToken)&&refreshTokenUserDetails?.username==currentUserDetails.username)
				createAccessToken(currentUserDetails)
			else
				null
		}

	fun getUserRoles(accessToken:String):List<UsersRole>
	{
		return tokenService.extractEmail(accessToken)?.let {
			val currentUserDetails=userDetailsService.loadUserByUsername(it)
			currentUserDetails.username.let {
				usersRoleRepository.findByUser_Email(it)
			}
		}.orEmpty()
	}

	private fun createAccessToken(user:UserDetails)=
		tokenService.generate(user,getAccessTokenExpiration())

	private fun createRefreshToken(user:UserDetails)=
		tokenService.generate(user,getRefreshTokenExpiration())

	private fun getAccessTokenExpiration():Date=
		Date(System.currentTimeMillis()+jwtProperties.accessTokenExpiration)

	private fun getRefreshTokenExpiration():Date=
		Date(System.currentTimeMillis()+jwtProperties.refreshTokenExpiration)

}

data class AuthInfo(
	val user:UserInfoDto,
	val roles:List<RoleDto>
)
package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.entities.UsersRole
import com.fancryer.extinctexhibit.services.AuthInfo
import com.fancryer.extinctexhibit.services.AuthenticationService
import com.fancryer.extinctexhibit.services.TokenService
import com.fancryer.extinctexhibit.services.UsersRoleService
import io.jsonwebtoken.ExpiredJwtException
import org.springframework.http.HttpStatus.FORBIDDEN
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/auth")
class AuthController(
	private val authenticationService:AuthenticationService,
	private val tokenService:TokenService,
	private val usersRoleService:UsersRoleService
)
{
	@PostMapping
	fun authenticate(@RequestBody authRequest:AuthenticationRequest):AuthenticationResponse=
		authenticationService.authentication(authRequest).also {
			println(it)
		}

	@PostMapping("/refresh")
	fun refreshAccessToken(@RequestBody request:RefreshTokenRequest):TokenResponse=
		authenticationService.refreshAccessToken(request.token)
			?.mapToTokenResponse()
		?: throw ResponseStatusException(FORBIDDEN,"Invalid refresh token.")

	@GetMapping("/roles")
	fun getUserRoles(@RequestParam accessToken:String):(List<UsersRole>)=
		authenticationService.getUserRoles(accessToken)

	@GetMapping("/info")
	fun getAuthInfo(@RequestParam accessToken:String):(ResponseEntity<AuthInfo?>)=
		try
		{
			tokenService.extractEmail(accessToken)?.let {
				usersRoleService.getInfoByEmail(it)
			}.let {ResponseEntity.ok(it)}
		}
		catch(e:ExpiredJwtException)
		{
			ResponseEntity.of(ProblemDetail.forStatusAndDetail(FORBIDDEN,e.message)).build()
		}

	private fun String.mapToTokenResponse():TokenResponse=
		TokenResponse(this)
}

data class AuthenticationRequest(
	val email:String,
	val password:String,
)

data class TokenResponse(
	val token:String
)

data class AuthenticationResponse(
	val accessToken:String,
	val refreshToken:String,
)

data class RefreshTokenRequest(
	val token:String
)
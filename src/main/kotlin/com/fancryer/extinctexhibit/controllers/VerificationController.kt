package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.services.EmailService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/verification")
class VerificationController(
	private val emailService:EmailService
)
{
	@PostMapping("/send")
	fun sendVerificationEmail(@RequestBody accessToken:String):(ResponseEntity<String>)
	{
		println("Access token: $accessToken")
		return emailService.sendVerificationEmail(accessToken)
			.fold({(status,message)->
				ResponseEntity.status(status).body(message)
			}
			) {
				ResponseEntity.ok("")
			}
	}

	@PutMapping("/verify")
	fun verifyEmail(@RequestParam accessToken:String):(ResponseEntity<String>)=
		emailService.verifyEmail(accessToken)
			.fold({throw it}) {
				ResponseEntity.ok("Account successfully verified!")
			}

}
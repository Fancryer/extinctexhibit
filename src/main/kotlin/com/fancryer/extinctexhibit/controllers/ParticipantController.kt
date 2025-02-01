package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.services.ParticipantService
import com.fancryer.extinctexhibit.services.TokenService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/participants")
class ParticipantController(
	private val participantService:ParticipantService,
	private val tokenService:TokenService
)
{
	@GetMapping("/participates")
	fun participates(@RequestParam accessToken:String,eventId:Long):(ResponseEntity<Boolean>)=
		tokenService.extractEmail(accessToken)?.let {email->
			participantService.participates(email,eventId)
				.let {ResponseEntity.ok(it)}
		} ?: ResponseEntity.ok(false)

	@PostMapping("/participate")
	fun participate(@RequestBody request:UserRequest<ParticipateRequest>):(ResponseEntity<Boolean>)=
		tokenService.extractEmail(request.accessToken)?.let {email->
			participantService.participate(email,request.payload)
				.let {ResponseEntity.ok(it)}
		} ?: ResponseEntity.ok(false)

	data class ParticipateRequest(val eventId:Long,val prosoponyms:List<String>)
}
package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.controllers.ParticipantController.ParticipateRequest
import com.fancryer.extinctexhibit.entities.Escort
import com.fancryer.extinctexhibit.repositories.EscortRepository
import com.fancryer.extinctexhibit.entities.Participant
import com.fancryer.extinctexhibit.repositories.ParticipantRepository
import com.fancryer.extinctexhibit.repositories.EventRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate

@Service
class ParticipantService(
	private val participantRepository:ParticipantRepository,
	private val transactionTemplate:TransactionTemplate,
	private val userService:UserService,
	private val eventRepository:EventRepository,private val escortRepository:EscortRepository
)
{
	fun participates(userEmail:String,eventId:Long):Boolean=
		transactionTemplate.execute {
			val userId=userService.findByEmail(userEmail)?.id
					   ?: throw NotFoundException("User email not found")
			participantRepository.existsByUser_IdAndEvent_Id(userId,eventId)
		} ?: false

	fun participate(email:String,payload:ParticipateRequest):Boolean=
		transactionTemplate.execute {
			val (eventId,prosoponyms)=payload
			// check if there is place for all
			val event=eventRepository.findById(eventId).orElseThrow {
				NotFoundException("Event with id $eventId not found")
			}
			val user=userService.findByEmail(email)
			val capacity=event.hall?.capacity ?: 0
			if(prosoponyms.size+1>capacity) return@execute false
			val participant=Participant().apply {
				this.user=user
				this.event=event
			}.let(participantRepository::save)
			prosoponyms.asSequence().map {
				Escort().apply {
					this.participant=participant
					this.prosoponym=it
				}
			}.toList().let(escortRepository::saveAll)
			true
		} ?: false
}
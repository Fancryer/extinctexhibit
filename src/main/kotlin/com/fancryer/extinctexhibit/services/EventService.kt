package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.dtos.EventDto
import com.fancryer.extinctexhibit.dtos.ParticipantDto
import com.fancryer.extinctexhibit.entities.Event
import com.fancryer.extinctexhibit.repositories.EscortRepository
import com.fancryer.extinctexhibit.repositories.EventRepository
import com.fancryer.extinctexhibit.repositories.HallRepository
import com.fancryer.extinctexhibit.repositories.ParticipantRepository
import com.fancryer.extinctexhibit.services.HallService.Companion.asDto
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import java.time.Instant

@Service
class EventService(
	private val eventRepository:EventRepository,
	private val participantRepository:ParticipantRepository,
	private val transactionTemplate:TransactionTemplate,
	private val hallRepository:HallRepository,
	private val escortRepository:EscortRepository
)
{
	fun findAll()=
		eventRepository.findAll()
			.asSequence()
			.map {it.asDto}
			.toList()

	fun findPast(now:Instant)=
		eventRepository.findAllByEndTimeLessThan(now)
			.asSequence()
			.map {it.asDto}
			.toSet()

	fun findPresent(now:Instant)=
		eventRepository.findAllByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(now,now)
			.asSequence()
			.map {it.asDto}
			.toSet()

	fun findFuture(now:Instant)=
		eventRepository.findAllByStartTimeGreaterThanEqual(now)
			.asSequence()
			.map {it.asDto}
			.toSet()

	fun createEvent(
		organizer:String,
		title:String,
		hallId:Long,
		description:String,
		startTime:Instant,
		endTime:Instant
	)
	{
		transactionTemplate.execute {
			val hall=hallRepository.findById(hallId).orElseThrow {
				NotFoundException("Hall with id $hallId not found")
			}
			Event().apply {
				this.organizer=organizer
				this.title=title
				this.hall=hall
				this.description=description
				this.startTime=startTime
				this.endTime=endTime
			}.let(eventRepository::save)
		}
	}

	fun deleteEvent(eventId:Long):Boolean=
		transactionTemplate.execute {
			eventRepository.deleteById(eventId)
			true
		} ?: false

	val Event.asDto:EventDto
		get()=EventDto(
			id!!,
			organizer!!,
			hall?.asDto!!,
			title!!,
			description!!,
			startTime!!,
			endTime!!,
			id!!.let(participantRepository::findByEvent_Id)
				.map {it.user!!.id!!}
				.map {participantId->
					escortRepository.findByParticipant_User_Id(participantId)
						.mapNotNull {it.prosoponym}
						.let {ParticipantDto(participantId,it)}
				}.toSet()
		)
}
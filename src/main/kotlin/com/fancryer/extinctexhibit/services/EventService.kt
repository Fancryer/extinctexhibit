package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.dtos.EventDto
import com.fancryer.extinctexhibit.entities.Event
import com.fancryer.extinctexhibit.entities.ParticipantRepository
import com.fancryer.extinctexhibit.repositories.EventRepository
import com.fancryer.extinctexhibit.services.HallService.Companion.asDto
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class EventService(
	private val eventRepository:EventRepository,
	private val participantRepository:ParticipantRepository
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

	val Event.asDto:EventDto
		get()=EventDto(
			id,
			organizer!!,
			hall?.asDto,
			title,
			description,
			startTime,
			endTime,
			id?.let(participantRepository::findByEvent_Id)
				?.map {it.user!!.id!!}
				?.toMutableSet()
		)
}
package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.dtos.EventDto
import com.fancryer.extinctexhibit.services.EventService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("/api/events")
class EventsController(
	private val eventService:EventService
)
{
	@GetMapping
	fun indexFiltered(
		@RequestParam filter:Byte?,
		@RequestParam now:Instant?
	):(ResponseEntity<Set<EventDto>>)
	{
		if(filter==null||now==null) return ResponseEntity.ok(eventService.findAll().toSet())
		val (isPast,isPresent,isFuture)=filter.extractFilters
		val pastEvents=if(isPast) eventService.findPast(now) else emptySet()
		val presentEvents=if(isPresent) eventService.findPresent(now) else emptySet()
		val futureEvents=if(isFuture) eventService.findFuture(now) else emptySet()
		return ResponseEntity.ok(pastEvents union presentEvents union futureEvents)
	}

	/*
	type EventFilterType=
		|'past'     001 = 1
		|'present'  010 = 2
		|'future'   100 = 4
	*/
	private val Byte.extractFilters:List<Boolean>
		get()=listOf(
			isBitSet(0),
			isBitSet(1),
			isBitSet(2)
		)

	private fun Byte.isBitSet(bit:Int):Boolean=
		(this.toInt() and (1 shl bit))!=0

}
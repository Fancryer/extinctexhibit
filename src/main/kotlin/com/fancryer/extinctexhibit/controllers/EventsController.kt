package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.dtos.EventDto
import com.fancryer.extinctexhibit.services.EventService
import com.fancryer.extinctexhibit.services.TokenService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/api/events")
class EventsController(
	private val eventService:EventService,
	private val tokenService:TokenService
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
	organizer    :  string
	hallId       :  number
	title        :  string
	description  :  string
	startTime    :  string
	endTime      :  string
	*/
	@PostMapping(consumes=[MediaType.MULTIPART_FORM_DATA_VALUE])
	fun createEvent(
		@RequestParam accessToken:String,
		@RequestParam organizer:String,
		@RequestParam title:String,
		@RequestParam hallId:Long,
		@RequestParam description:String,
		@RequestParam startTime:Instant,
		@RequestParam endTime:Instant
	)
	{
		tokenService.extractEmail(accessToken)?.let {
			eventService.createEvent(organizer,title,hallId,description,startTime,endTime)
		} ?: error("Invalid access token")
	}

	@DeleteMapping("/{eventId}")
	fun deleteEvent(@PathVariable eventId:Long)
	{
		eventService.deleteEvent(eventId)
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
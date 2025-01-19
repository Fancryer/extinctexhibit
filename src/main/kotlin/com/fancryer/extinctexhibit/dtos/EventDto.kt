package com.fancryer.extinctexhibit.dtos

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.io.Serializable
import java.time.Instant

/**
 * DTO for {@link com.fancryer.extinctexhibit.entities.Event}
 */
data class EventDto(
	val id:Long?=null,
	@NotNull val organizer:String?=null,
	@NotNull val hall:HallDto?=null,
	@NotNull @Size(max=255) val title:String?=null,
	@NotNull val description:String?=null,
	@NotNull @JsonProperty("start_time") val startTime:Instant?=null,
	@NotNull @JsonProperty("end_time") val endTime:Instant?=null,
	@JsonProperty("participants") val participantIds:MutableSet<Long>?
):Serializable
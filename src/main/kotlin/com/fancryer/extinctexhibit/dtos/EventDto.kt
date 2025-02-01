package com.fancryer.extinctexhibit.dtos

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.io.Serializable
import java.time.Instant

/**
 * DTO for {@link com.fancryer.extinctexhibit.entities.Event}
 */
data class EventDto(
	@NotNull val id:Long,
	@NotNull val organizer:String,
	@NotNull val hall:HallDto,
	@NotNull @Size(max=255) val title:String,
	@NotNull val description:String,
	@NotNull val startTime:Instant,
	@NotNull val endTime:Instant,
	@NotNull val participants:Set<ParticipantDto>
):Serializable
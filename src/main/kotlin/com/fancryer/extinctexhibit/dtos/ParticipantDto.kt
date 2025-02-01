package com.fancryer.extinctexhibit.dtos

import java.io.Serializable

/**
 * DTO for {@link com.fancryer.extinctexhibit.entities.Participant}
 */
data class ParticipantDto(
	val id:Long,
	val escorts:List<String>
):Serializable
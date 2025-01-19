package com.fancryer.extinctexhibit.dtos

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.io.Serializable

/**
 * DTO for {@link com.fancryer.extinctexhibit.entities.Hall}
 */
data class HallDto(
	val id:Long?=null,
	@NotNull @Size(max=255) val name:String?=null,
	@NotNull @Size(max=255) val location:String?=null,
	@NotNull val capacity:Int?=null
):Serializable
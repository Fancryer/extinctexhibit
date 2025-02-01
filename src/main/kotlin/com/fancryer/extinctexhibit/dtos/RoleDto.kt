package com.fancryer.extinctexhibit.dtos

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.io.Serializable

data class RoleDto(
	val id:Long,

	@field:NotNull
	@field:Size(max=255)
	val name:String,

	@field:NotNull
	val permissions:(List<@Size(max=255) String>)=emptyList()
):Serializable
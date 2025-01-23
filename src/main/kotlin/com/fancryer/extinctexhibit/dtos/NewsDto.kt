package com.fancryer.extinctexhibit.dtos

import java.time.Instant

class NewsDto(
	val id:Long,
	val title:String,
	val content:String,
	val createdAt:Instant,
	val updatedAt: Instant,
	val coverUrl:String?,
)
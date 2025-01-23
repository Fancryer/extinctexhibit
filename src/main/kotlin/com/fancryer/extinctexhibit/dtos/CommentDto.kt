package com.fancryer.extinctexhibit.dtos

import java.io.Serializable
import java.time.Instant

/**
 * DTO for {@link com.fancryer.extinctexhibit.entities.Comment}
 */
data class CommentDto(
	val id:Long,
	val ownerId:Long,
	val ownerProsoponym:String,
	val content:String,
	val createdAt:Instant
):Serializable


/*
id:number,
owner_id:number,
owner_name:string,
news_id:number,
content:string,
created_at:string
*/
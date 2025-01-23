package com.fancryer.extinctexhibit.entities

import org.springframework.data.jpa.repository.JpaRepository

interface CommentRepository:JpaRepository<Comment,Long>
{
	fun findByNews_IdOrderByUser_CreatedAtAsc(id:Long):List<Comment>
}
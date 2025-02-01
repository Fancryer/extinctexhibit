package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.Comment
import org.springframework.data.jpa.repository.JpaRepository

interface CommentRepository:JpaRepository<Comment,Long>
{
	fun findByNews_IdOrderByUser_CreatedAtAsc(id:Long):List<Comment>


	fun deleteByNews_Id(id:Long):Long


	fun deleteByUser_Id(id:Long):Long
}
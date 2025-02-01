package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.dtos.CommentDto
import com.fancryer.extinctexhibit.entities.Comment
import com.fancryer.extinctexhibit.entities.Comment.Companion.dto
import com.fancryer.extinctexhibit.repositories.CommentRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate

@Service
class CommentService(
	private val commentRepository:CommentRepository,
	private val userService:UserService,
	private val transactionTemplate:TransactionTemplate,
	private val newsService:NewsService
)
{
	fun index():(List<CommentDto>)=
		commentRepository.findAll().map {it.dto}

	fun findCommentsByNewsId(id:Long):(List<CommentDto>)=
		commentRepository.findByNews_IdOrderByUser_CreatedAtAsc(id).map {it.dto}

	fun createComment(email:String,newsId:Long,content:String):Long=
		transactionTemplate.execute {
			val user=userService.findByEmail(email)
					 ?: throw NotFoundException("User email not found")
			val news=newsService.findById(newsId)
					 ?: throw NotFoundException("News with such id not found")
			Comment().apply {
				this.user=user
				this.news=news
				this.content=content
			}.let(commentRepository::save).id
		} ?: error("Unable to create comment")
}
package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.dtos.CommentDto
import com.fancryer.extinctexhibit.services.CommentService
import com.fancryer.extinctexhibit.services.TokenService
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.http.ResponseEntity
import org.springframework.http.ResponseEntity.ok
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/comments")
class CommentsController(
	private val commentService:CommentService,
	private val tokenService:TokenService
)
{
	@GetMapping
	fun index():(List<CommentDto>)=commentService.index()

	@GetMapping("/for-news/{id}")
	fun getCommentsForNews(@PathVariable id:Long):(List<CommentDto>)=
		commentService.findCommentsByNewsId(id)

	@PostMapping("/add")
	fun createComment(@RequestBody request:UserRequest<CreateCommentRequest>):ResponseEntity<Long>
	{
		println(request)
		return tokenService.extractEmail(request.accessToken)?.let {
			ok(commentService.createComment(it,request.payload.newsId,request.payload.content))
		} ?: ResponseEntity.status(UNAUTHORIZED).build()
	}

	data class CreateCommentRequest(val newsId:Long,val content:String)
}
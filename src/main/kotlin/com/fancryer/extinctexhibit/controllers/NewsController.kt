package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.dtos.NewsDto
import com.fancryer.extinctexhibit.services.NewsService
import com.fancryer.extinctexhibit.services.TokenService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/news")
class NewsController(
	private val newsService:NewsService,
	private val tokenService:TokenService
)
{
	@GetMapping
	fun index():(ResponseEntity<Set<NewsDto>>)=
		ResponseEntity.ok(newsService.findAll())

	@GetMapping("/{id}")
	fun getNewsById(@PathVariable id:Long):(ResponseEntity<NewsDto>)=
		ResponseEntity.ok(newsService.findByIdWithCover(id))

	//already defined:
	// data class UserRequest<Payload>(val accessToken:String,val payload:Payload)
	@PostMapping(consumes=[MediaType.MULTIPART_FORM_DATA_VALUE])
	fun create(
		@RequestParam accessToken:String,
		@RequestParam title:String,
		@RequestParam content:String,
		@RequestParam(required=false) cover:MultipartFile?,
		@RequestParam("event_id",required=false) eventId:Long?
	):(ResponseEntity<String>)=
		tokenService.extractEmail(accessToken)?.let {
			newsService.createNews(it,CreateNewsRequest(title,content,cover,eventId)).let {
				ResponseEntity.ok("News created successfully")
			}
		} ?: error("Invalid access token")

	@PutMapping(consumes=[MediaType.MULTIPART_FORM_DATA_VALUE])
	fun update(
		@RequestParam accessToken:String,
		@RequestParam newsId:Long,
		@RequestParam title:String,
		@RequestParam content:String,
		@RequestParam(required=false) cover:MultipartFile?,
		@RequestParam(required=false) eventId:Long?
	):(ResponseEntity<String>)=
		tokenService.extractEmail(accessToken)?.let {email->
			UpdateNewsRequest(newsId,title,content,cover,eventId).let {
				newsService.updateNews(email,it)
			}.let {
				ResponseEntity.ok("News created successfully")
			}
		} ?: error("Invalid access token")

	@DeleteMapping
	fun delete(@RequestParam newsId:Long):(ResponseEntity<String>)=
			newsService.deleteNews(newsId)
				.let {ResponseEntity.ok("News deleted successfully")}


	data class CreateNewsRequest(
		val title:String,
		val content:String,
		val cover:MultipartFile?, // Base64 закодированный файл
		val eventId:Long?
	)

	data class UpdateNewsRequest(
		val newsId:Long,
		val title:String,
		val content:String,
		val cover:MultipartFile?, // Base64 закодированный файл
		val eventId:Long?
	)
}
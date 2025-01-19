package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.entities.News
import com.fancryer.extinctexhibit.repositories.NewsRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class NewsController(private val newsRepository:NewsRepository)
{
	@GetMapping("/api/news")
	fun index():(ResponseEntity<MutableList<News>>)=
		ResponseEntity.ok(newsRepository.findAll())
}
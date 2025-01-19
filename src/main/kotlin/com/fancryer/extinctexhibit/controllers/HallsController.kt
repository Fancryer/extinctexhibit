package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.dtos.HallDto
import com.fancryer.extinctexhibit.services.HallService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HallsController(private val hallService:HallService)
{
	@GetMapping("/api/halls")
	fun index():(ResponseEntity<List<HallDto>>)=
		ResponseEntity.ok(hallService.findAll())
}
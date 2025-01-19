package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.dtos.HallDto
import com.fancryer.extinctexhibit.entities.Hall
import com.fancryer.extinctexhibit.repositories.HallRepository
import org.springframework.stereotype.Service

@Service
class HallService(val hallRepository:HallRepository)
{
	fun findAll()=
		hallRepository.findAll()
			.asSequence()
			.map {it.asDto}
			.toList()

	companion object
	{
		val Hall.asDto:HallDto
			get()=HallDto(id,name,location,capacity)
	}
}
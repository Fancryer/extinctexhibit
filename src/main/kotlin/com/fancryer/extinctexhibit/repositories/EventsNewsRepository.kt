package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.EventsNews
import org.springframework.data.jpa.repository.JpaRepository

interface EventsNewsRepository:JpaRepository<EventsNews,Long>
{
	fun deleteByNews_Id(id:Long):Long
}
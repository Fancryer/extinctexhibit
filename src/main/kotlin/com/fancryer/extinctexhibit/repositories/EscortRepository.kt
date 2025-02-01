package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.Escort
import org.springframework.data.jpa.repository.JpaRepository

interface EscortRepository:JpaRepository<Escort,Int>
{
	fun findByParticipant_User_Id(id:Long):List<Escort>
}
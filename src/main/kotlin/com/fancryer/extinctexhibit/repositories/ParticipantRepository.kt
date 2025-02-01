package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.Participant
import org.springframework.data.jpa.repository.JpaRepository

interface ParticipantRepository:JpaRepository<Participant,Long>
{
	fun findByUser_Id(id:Long):List<Participant>
	fun findByEvent_Id(id:Long):List<Participant>


	fun existsByUser_IdAndEvent_Id(id:Long,id1:Long):Boolean


	fun deleteByUser_Id(id:Long):Long
}
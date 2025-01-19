package com.fancryer.extinctexhibit.entities

import org.springframework.data.jpa.repository.JpaRepository

interface ParticipantRepository:JpaRepository<Participant,Long>
{
	fun findByUser_Id(id:Long):List<Participant>
	fun findByEvent_Id(id:Long):List<Participant>
}
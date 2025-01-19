package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.UsersRole
import org.springframework.data.jpa.repository.JpaRepository

interface UsersRoleRepository:JpaRepository<UsersRole,Long>
{
	fun findByUser_Email(email:String):List<UsersRole>
	fun findByUser_Id(id:Long):List<UsersRole>


	fun existsByRole_IdAndUser_Email(id:Long,email:String):Boolean
}
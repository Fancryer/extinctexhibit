package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

interface UserRepository:JpaRepository<User,Long>
{
	fun existsByProsoponym(prosoponym:String):Boolean
	fun existsByEmail(email:String):Boolean

	fun findByProsoponym(prosoponym:String):User?
	fun findByEmail(email:String):User?


	@Transactional
	@Modifying
	@Query("update User u set u.emailVerifiedAt = ?1 where u.email = ?2")
	fun updateEmailVerifiedAtByEmail(emailVerifiedAt:Instant,email:String):Int

	@Transactional
	@Modifying
	@Query("update User u set u.prosoponym = ?1 where u.id = ?2")
	fun updateProsoponymById(prosoponym:String,id:Long):Int


	@Transactional
	@Modifying
	@Query("update User u set u.email = ?1 where u.id = ?2")
	fun updateEmailById(email:String,id:Long):Int


	@Transactional
	@Modifying
	@Query("update User u set u.email = ?1, u.prosoponym = ?2 where u.id = ?3")
	fun updateEmailAndProsoponymById(email:String,prosoponym:String,id:Long):Int
}
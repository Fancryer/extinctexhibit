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
}
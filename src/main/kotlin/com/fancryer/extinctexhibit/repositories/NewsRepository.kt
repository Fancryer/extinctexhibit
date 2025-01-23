package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.News
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.transaction.annotation.Transactional

interface NewsRepository:JpaRepository<News,Long>
{

	@Transactional
	@Modifying
	@Query("update News n set n.title = ?1, n.content = ?2 where n.id = ?3")
	fun updateTitleAndContentById(title:String,content:String,id:Long):Int
}
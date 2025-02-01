package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.NewsCover
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface NewsCoverRepository:JpaRepository<NewsCover,Long>
{
	fun findByNews_Id(id:Long):Optional<NewsCover>


	fun deleteByNews_Id(id:Long):Long
}
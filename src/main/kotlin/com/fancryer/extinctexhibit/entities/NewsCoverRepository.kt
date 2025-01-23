package com.fancryer.extinctexhibit.entities

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface NewsCoverRepository:JpaRepository<NewsCover,Long>
{
	fun findByNews_Id(id:Long):Optional<NewsCover>
}
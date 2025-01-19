package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.Hall
import org.springframework.data.jpa.repository.JpaRepository

interface HallRepository:JpaRepository<Hall,Long>
{
}
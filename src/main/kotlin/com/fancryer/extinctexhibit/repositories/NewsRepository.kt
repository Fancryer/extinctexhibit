package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.News
import org.springframework.data.jpa.repository.JpaRepository

interface NewsRepository:JpaRepository<News,Long>
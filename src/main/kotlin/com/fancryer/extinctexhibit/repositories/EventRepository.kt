package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.Event
import org.springframework.data.jpa.repository.JpaRepository
import java.time.Instant

interface EventRepository:JpaRepository<Event,Long>
{
	fun findAllByEndTimeLessThan(now:Instant):Set<Event>
	fun findAllByStartTimeLessThanEqualAndEndTimeGreaterThanEqual(now:Instant,now2:Instant):Set<Event>
	fun findAllByStartTimeGreaterThanEqual(now:Instant):Set<Event>
}
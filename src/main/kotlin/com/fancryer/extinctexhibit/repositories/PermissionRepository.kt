package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.Permission
import org.springframework.data.jpa.repository.JpaRepository

interface PermissionRepository:JpaRepository<Permission,Long>
{


	fun findByName(name:String):Permission
}
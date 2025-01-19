package com.fancryer.extinctexhibit.entities

import org.springframework.data.jpa.repository.JpaRepository

interface PermissionRepository:JpaRepository<Permission,Long>
{


	fun findByName(name:String):Permission
}
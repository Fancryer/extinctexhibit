package com.fancryer.extinctexhibit.repositories

import com.fancryer.extinctexhibit.entities.RolesPermission
import org.springframework.data.jpa.repository.JpaRepository

interface RolesPermissionRepository:JpaRepository<RolesPermission,Long>
{


	fun findByRole_Id(id:Long):List<RolesPermission>


	fun findAllByRole_Id(id:Long):List<RolesPermission>


	fun findByRole_IdOrderByPermission_NameAsc(id:Long):List<RolesPermission>
}
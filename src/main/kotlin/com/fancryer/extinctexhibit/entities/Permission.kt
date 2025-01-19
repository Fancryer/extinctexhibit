package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(
	name="permissions",uniqueConstraints=[
		UniqueConstraint(name="permissions_name_guard_name_unique",columnNames=["name"])
	]
)
class Permission:Serializable
{
	@Id
	@ColumnDefault("nextval('permissions_id_seq')")
	@Column(name="id",nullable=false)
	var id:Long?=null

	@Size(max=255)
	@NotNull
	@Column(name="name",nullable=false)
	var name:String?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=-4676073818925397258L
	}
}
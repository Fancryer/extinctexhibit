package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.io.Serializable

@Entity
@Table(name="roles_permissions")
class RolesPermission:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="roles_permissions_id_gen")
	@SequenceGenerator(name="roles_permissions_id_gen",sequenceName="roles_permissions_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Long?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="role_id",nullable=false)
	var role:Role?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="permission_id",nullable=false)
	var permission:Permission?=null

	companion object
	{
		private const val serialVersionUID=7371272736088363179L
	}
}
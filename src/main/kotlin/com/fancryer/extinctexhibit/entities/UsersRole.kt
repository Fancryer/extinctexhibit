package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name="users_roles")
class UsersRole:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="users_roles_id_gen")
	@SequenceGenerator(name="users_roles_id_gen",sequenceName="users_roles_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Long?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@OnDelete(action=OnDeleteAction.CASCADE)
	@JoinColumn(name="user_id",nullable=false)
	var user:User?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@OnDelete(action=OnDeleteAction.CASCADE)
	@JoinColumn(name="role_id",nullable=false)
	var role:Role?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=-3180327467383836714L
	}
}
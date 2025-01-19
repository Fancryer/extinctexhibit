package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name = "roles")
class Role:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="roles_id_gen")
	@SequenceGenerator(name="roles_id_gen",sequenceName="roles_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id: Long? = null

	@Size(max=255)
	@NotNull
	@Column(name="name",nullable=false)
	var name: String? = null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object {
		private const val serialVersionUID = -2004789880670873855L
	}
}
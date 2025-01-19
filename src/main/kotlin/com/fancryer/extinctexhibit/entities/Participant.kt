package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name="participants")
class Participant:Serializable
{
	@Id
	@ColumnDefault("nextval('participants_id_seq')")
	@Column(name="id",nullable=false)
	var id:Long?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="user_id",nullable=false)
	var user:User?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="event_id",nullable=false)
	var event:Event?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=4007343080000398514L
	}
}
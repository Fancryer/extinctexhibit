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
@Table(name="events")
class Event:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="events_id_gen")
	@SequenceGenerator(name="events_id_gen",sequenceName="events_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Long?=null

	@NotNull
	@ColumnDefault("''")
	@Column(name="organizer",nullable=false,length=Integer.MAX_VALUE)
	var organizer:String?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="hall_id",nullable=false)
	var hall:Hall?=null

	@Size(max=255)
	@NotNull
	@Column(name="title",nullable=false)
	var title:String?=null

	@NotNull
	@Column(name="description",nullable=false,length=Integer.MAX_VALUE)
	var description:String?=null

	@NotNull
	@Column(name="start_time",nullable=false)
	var startTime:Instant?=null

	@NotNull
	@Column(name="end_time",nullable=false)
	var endTime:Instant?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=5387861737529330664L
	}
}
package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name="escorts")
class Escort:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="escorts_id_gen")
	@SequenceGenerator(name="escorts_id_gen",sequenceName="escorts_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Int?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="participant_id",nullable=false)
	var participant:Participant?=null

	@NotNull
	@Column(name="prosoponym",nullable=false,length=Integer.MAX_VALUE)
	var prosoponym:String?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=5760518749275409442L
	}
}
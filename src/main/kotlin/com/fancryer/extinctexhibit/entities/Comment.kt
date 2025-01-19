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
@Table(name="comments")
class Comment:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="comments_id_gen")
	@SequenceGenerator(name="comments_id_gen",sequenceName="comments_id_seq",allocationSize=1)
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
	@JoinColumn(name="news_id",nullable=false)
	var news:News?=null

	@NotNull
	@Column(name="content",nullable=false,length=Integer.MAX_VALUE)
	var content:String?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=-8232954632943433810L
	}
}
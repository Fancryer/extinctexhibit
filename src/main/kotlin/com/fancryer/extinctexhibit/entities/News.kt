package com.fancryer.extinctexhibit.entities

import com.fancryer.extinctexhibit.dtos.NewsDto
import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name="news")
class News:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="news_id_gen")
	@SequenceGenerator(name="news_id_gen",sequenceName="news_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Long?=null

	@Size(max=255)
	@NotNull
	@Column(name="title",nullable=false)
	var title:String?=null

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
		private const val serialVersionUID=8663077991923162333L

		infix fun News.toDto(coverUrl:String?)=NewsDto(
			id!!,
			title!!,
			content!!,
			createdAt!!,
			updatedAt!!,
			coverUrl
		)

		val News.dto get()=toDto(null)
	}
}
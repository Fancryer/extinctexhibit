package com.fancryer.extinctexhibit.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name="news")
class News:Serializable
{
	@Id
	@ColumnDefault("nextval('news_id_seq')")
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
	}
}
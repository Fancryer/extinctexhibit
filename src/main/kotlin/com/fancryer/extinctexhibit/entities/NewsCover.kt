package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(name="news_covers")
class NewsCover:Serializable
{
	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="news_covers_id_gen")
	@SequenceGenerator(name="news_covers_id_gen",sequenceName="news_covers_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Long?=null

	@NotNull
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@OnDelete(action=OnDeleteAction.CASCADE)
	@JoinColumn(name="news_id",nullable=false)
	var news:News?=null

	@Size(max=255)
	@NotNull
	@Column(name="cover_path",nullable=false)
	var coverPath:String?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null

	companion object
	{
		private const val serialVersionUID=-7103781182609169079L
	}
}
package com.fancryer.extinctexhibit.entities

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import lombok.AllArgsConstructor
import lombok.Builder
import lombok.ToString
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.io.Serializable
import java.time.Instant

@Entity
@Table(
	name="users",uniqueConstraints=[
		UniqueConstraint(name="users_email_unique",columnNames=["email"])
	]
)
@Builder
class User:Serializable
{
	fun copy(
		prosoponym:String?=this.prosoponym,
		email:String?=this.email,
		password:String?=this.password,
		emailVerifiedAt:Instant?=this.emailVerifiedAt,
		rememberToken:String?=this.rememberToken,
		createdAt:Instant?=this.createdAt,
		updatedAt:Instant?=this.updatedAt
	):User
	{
		return User().apply {
			this.id=id
			this.prosoponym=prosoponym
			this.email=email
			this.emailVerifiedAt=emailVerifiedAt
			this.password=password
			this.rememberToken=rememberToken
			this.createdAt=createdAt
			this.updatedAt=updatedAt
		}
	}

	override fun toString():String=buildString {
		append("(User ")
		append("(id $id) ")
		append("(email $email) ")
		append("(password $password) ")
		append("(emailVerifiedAt $emailVerifiedAt) ")
		append("(prosoponym $prosoponym) ")
		append("(rememberToken $rememberToken) ")
		append("(createdAt $createdAt) ")
		append("(updatedAt $updatedAt))")
	}

	@Id
	@GeneratedValue(strategy=GenerationType.SEQUENCE,generator="users_id_gen")
	@SequenceGenerator(name="users_id_gen",sequenceName="users_id_seq",allocationSize=1)
	@Column(name="id",nullable=false)
	var id:Long?=null

	@Size(max=255)
	@NotNull
	@Column(name="prosoponym",nullable=false)
	var prosoponym:String?=null

	@Size(max=255)
	@NotNull
	@Column(name="email",nullable=false)
	var email:String?=null

	@Column(name="email_verified_at")
	var emailVerifiedAt:Instant?=null

	@Size(max=255)
	@NotNull
	@Column(name="password",nullable=false)
	var password:String?=null

	@Size(max=100)
	@Column(name="remember_token",length=100)
	var rememberToken:String?=null

	@Column(name="created_at")
	@CreationTimestamp
	var createdAt:Instant?=null

	@Column(name="updated_at")
	@UpdateTimestamp
	var updatedAt:Instant?=null


	companion object
	{
		private const val serialVersionUID=-924782044904901537L
	}
}
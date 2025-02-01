package com.fancryer.extinctexhibit.services

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import com.fancryer.extinctexhibit.repositories.UserRepository
import io.jsonwebtoken.ExpiredJwtException
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.mail.MailParseException
import org.springframework.mail.MailSender
import org.springframework.mail.SimpleMailMessage
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import java.time.Instant

@Service
class EmailService(
	private val tokenService:TokenService,
	private val mailSender:MailSender,
	private val transactionTemplate:TransactionTemplate,
	private val userRepository:UserRepository
)
{
	fun sendVerificationEmail(accessToken:String):(Either<Pair<HttpStatus,String>,Unit>)=
		try
		{
			val email=tokenService.extractEmail(accessToken)
					  ?: throw NotFoundException("Email not found for the provided token")
			val verificationUrl="http://localhost:5173/auth/verify/$accessToken"

			SimpleMailMessage().apply {
				setTo(email)
				replyTo="fancryer2003@gmail.com"
				subject="Verify your account"
				text="Click the link to verify your account: $verificationUrl"
			}.run(mailSender::send).right()
		}
		catch(e:MailParseException)
		{
			(BAD_REQUEST to (e.message ?: "Invalid email")).left()
		}
		catch(e:ExpiredJwtException)
		{
			(UNAUTHORIZED to "Token expired").left()
		}

	fun verifyEmail(token:String):(Either<Exception,Unit>)=
		try
		{
			transactionTemplate.execute {
				val email=tokenService.extractEmail(token)
						  ?: throw NotFoundException("Invalid or expired token")
				userRepository.updateEmailVerifiedAtByEmail(Instant.now(),email)
			}
			Unit.right()
		}
		catch(e:Exception)
		{
			e.left()
		}
}

class NotFoundException(message:String):RuntimeException(message)
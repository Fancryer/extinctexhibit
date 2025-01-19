package com.fancryer.extinctexhibit.configs

import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Component
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.servlet.config.annotation.CorsRegistry


@Component
class CustomCorsConfiguration:CorsConfigurationSource
{
	override fun getCorsConfiguration(request:HttpServletRequest):CorsConfiguration=
		CorsConfiguration().apply {
			allowedOrigins=listOf("http://localhost:5173","http://localhost:6060")
			allowedMethods=listOf("*")
			allowedHeaders=listOf("*")
		}

	@Bean
	@Profile("local")
	fun corsConfigurationSource():CorsConfigurationSource=
		UrlBasedCorsConfigurationSource().apply {
			registerCorsConfiguration(
				"/**",
				CorsConfiguration().applyPermitDefaultValues()
					.apply {
						addAllowedMethod(HttpMethod.GET)
						addAllowedMethod(HttpMethod.OPTIONS)
						addAllowedMethod(HttpMethod.POST)
						addAllowedMethod(HttpMethod.PATCH)
						addAllowedMethod(HttpMethod.PUT)
						addAllowedMethod(HttpMethod.DELETE)
						//						addAllowedOrigin("*")
						addAllowedOrigin("http://localhost:5173")
						addAllowedOrigin("http://localhost:6060")
					}
			)
		}
}

@Component
class SpringDataRestCustomization:RepositoryRestConfigurer
{
	override fun configureRepositoryRestConfiguration(config:RepositoryRestConfiguration,cors:CorsRegistry)
	{
		cors.addMapping("/**")
			.allowedOrigins("*") //"http://localhost:5173","http://localhost:6060"
	}
}
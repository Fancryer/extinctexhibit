package com.fancryer.extinctexhibit.configs

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod.OPTIONS
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableMethodSecurity
class SecurityConfig(
	private val customCorsConfiguration:CustomCorsConfiguration,
	private val authenticationProvider:AuthenticationProvider
)
{
	@Bean
	fun securityFilterChain(
		http:HttpSecurity,
		jwtAuthenticationFilter:JwtAuthenticationFilter
	):SecurityFilterChain
	{
		return http
			.cors {it.configurationSource(customCorsConfiguration.corsConfigurationSource())}
			.csrf {it.disable()}
			.httpBasic {
				it.disable()
			} // don't use with JWT
			.sessionManagement {
				it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			}
			.authorizeHttpRequests {
				it.requestMatchers(OPTIONS,"/**").permitAll()
					.requestMatchers("/**").permitAll()
			}.authenticationProvider(authenticationProvider)
			.addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter::class.java)
			.build()
	}
}
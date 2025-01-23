package com.fancryer.extinctexhibit.configs

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
class WebConfig(
	private val storageConfig:StorageConfig
):WebMvcConfigurer
{
	override fun addResourceHandlers(registry:ResourceHandlerRegistry) {
		registry.addResourceHandler("/api/uploads/**")
			.addResourceLocations("file:${storageConfig.uploadPath}/")
	}
}
//{
//	override fun addCorsMappings(registry:CorsRegistry)
//	{
//		registry.addMapping("/**")
//			.allowedOrigins("*")
//			.allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
//			.allowedHeaders("Authorization","Content-Type","X-Auth-Token")
//			.exposedHeaders("*")
//			.allowCredentials(true)
//	}
//}
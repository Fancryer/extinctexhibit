package com.fancryer.extinctexhibit.configs

import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import java.io.File

@Configuration
class StorageConfig
{
	@Value("\${images.upload.path}")
	lateinit var uploadPath:String

	@Value("\${images.halls.path}")
	lateinit var hallsPath:String

	@PostConstruct
	fun init()
	{
		File(uploadPath).run {
			if(!exists()) mkdirs()
		}
	}
}

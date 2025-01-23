package com.fancryer.extinctexhibit.controllers

import com.fancryer.extinctexhibit.configs.StorageConfig
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.io.File
import java.nio.file.Files

@RestController
@RequestMapping("/api")
class FileController(
	private val storageConfig:StorageConfig
)
{
	@GetMapping("/uploads/{fileName:.+}")
	fun getFile(@PathVariable fileName:String):(ResponseEntity<ByteArray>)=
		File("${storageConfig.uploadPath}/$fileName").let(::loadFileEntity)

	@GetMapping("/halls/{name}")
	fun getHallFile(@PathVariable name:String):(ResponseEntity<ByteArray>)=
		File("${storageConfig.hallsPath}/$name.jpg").let(::loadFileEntity)

	private fun loadFileEntity(file:File):ResponseEntity<ByteArray>
	{
		if(!file.exists()) return ResponseEntity.notFound().build()
		val fileContent=file.readBytes()
		val contentType=Files.probeContentType(file.toPath()) ?: "application/octet-stream"
		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_TYPE,contentType)
			.header(HttpHeaders.CACHE_CONTROL,"no-cache, no-store, must-revalidate") // Отключение кеширования
			.header(HttpHeaders.EXPIRES,"0") // Устанавливаем срок действия в 0
			.body(fileContent)
	}
}

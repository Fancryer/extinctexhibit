package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.configs.StorageConfig
import com.fancryer.extinctexhibit.entities.News
import com.fancryer.extinctexhibit.entities.NewsCover
import com.fancryer.extinctexhibit.entities.NewsCoverRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

@Service
class FileStorageService(
	private val storageConfig:StorageConfig,
	private val newsCoverRepository:NewsCoverRepository
)
{
	fun saveFile(news:News,file:MultipartFile):String
	{
		val directory=File(storageConfig.uploadPath)
		if(!directory.exists()) directory.mkdirs()

		val uniqueFileName="${UUID.randomUUID()}_${file.originalFilename}"
		val targetFile=File(directory,uniqueFileName)

		file.inputStream.use {input->
			targetFile.outputStream().use {output->
				input.copyTo(output)
			}
		}
		NewsCover().apply {
			this.news=news
			this.coverPath=uniqueFileName
		}.let(newsCoverRepository::save)

		return uniqueFileName
	}

	fun deleteFile(name:String)
	{
		val directory=File(storageConfig.uploadPath)
		if(!directory.exists()) return
		File(directory,name).delete()
	}
}
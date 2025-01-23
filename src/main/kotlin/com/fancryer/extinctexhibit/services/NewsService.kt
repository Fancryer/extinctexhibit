package com.fancryer.extinctexhibit.services

import com.fancryer.extinctexhibit.controllers.NewsController.CreateNewsRequest
import com.fancryer.extinctexhibit.controllers.NewsController.UpdateNewsRequest
import com.fancryer.extinctexhibit.dtos.NewsDto
import com.fancryer.extinctexhibit.entities.EventsNews
import com.fancryer.extinctexhibit.entities.EventsNewsRepository
import com.fancryer.extinctexhibit.entities.News
import com.fancryer.extinctexhibit.entities.News.Companion.toDto
import com.fancryer.extinctexhibit.entities.NewsCoverRepository
import com.fancryer.extinctexhibit.repositories.EventRepository
import com.fancryer.extinctexhibit.repositories.NewsRepository
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionTemplate
import kotlin.jvm.optionals.getOrNull

@Service
class NewsService(
	private val newsRepository:NewsRepository,
	private val fileStorageService:FileStorageService,
	private val transactionTemplate:TransactionTemplate,
	private val eventRepository:EventRepository,
	private val eventsNewsRepository:EventsNewsRepository,
	private val newsCoverRepository:NewsCoverRepository
)
{
	fun findAll():(Set<NewsDto>)=
		transactionTemplate.execute {
			newsRepository.findAll(Sort.by("createdAt")).map {
				val newsId=it.id!!
				val cover=newsCoverRepository.findByNews_Id(newsId)
				it.toDto(cover.getOrNull()?.coverPath)
			}.toSet()
		}.orEmpty()

	fun createNews(email:String,request:CreateNewsRequest)
	{
		transactionTemplate.execute {
			val (title,content,cover,eventId)=request
			val news=News().apply {
				this.title=title
				this.content=content
			}.let(newsRepository::save)
			//save relation news:event
			eventId?.let {id->
				eventRepository.findById(id)
					.getOrNull()
					?.let {
						EventsNews().apply {
							this.news=news
							this.event=it
						}.let(eventsNewsRepository::save)
					}
			}
			//save cover
			cover?.let {
				fileStorageService.saveFile(news,it)
			}
		}
	}

	/**
	 * This method omits coverUrl!
	 * */
	fun findById(id:Long):News?
	{
		return newsRepository.findById(id).getOrNull()
	}

	fun findByIdWithCover(id:Long):NewsDto?=
		transactionTemplate.execute {
			val news=newsRepository.findById(id).getOrNull()
					 ?: return@execute null
			news toDto newsCoverRepository.findByNews_Id(id).getOrNull()?.coverPath
		}

	fun updateNews(email:String,request:UpdateNewsRequest)
	{
		transactionTemplate.execute {
			val (newsId,title,content,cover,eventId)=request
			// Проверяем существование новости
			val news=newsRepository.findById(newsId).orElseThrow {
				IllegalArgumentException("News with id $newsId not found")
			}
			newsCoverRepository.findByNews_Id(newsId)
				.getOrNull()
				?.let {oldCover->
					fileStorageService.deleteFile(oldCover.coverPath!!)
					newsCoverRepository.delete(oldCover)
				}
			cover?.takeIf {!it.isEmpty}?.let {
				fileStorageService.saveFile(news,it)
			}
			newsRepository.updateTitleAndContentById(title,content,newsId)
			eventId?.let {
				val event=eventRepository.findById(it).orElseThrow {
					IllegalArgumentException("Event with id $it not found")
				}
				EventsNews().apply {
					this.news=news
					this.event=event
				}.let(eventsNewsRepository::save)
			}
		}
	}

}

package com.fancryer.extinctexhibit

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class ExtinctExhibitApplication

fun <T> Boolean.map(ifTrue:()->T,ifFalse:()->T)=
	if(this) ifTrue() else ifFalse()

fun main(args:Array<String>)
{
	runApplication<ExtinctExhibitApplication>(*args)
}

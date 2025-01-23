import {Config} from 'ziggy-js';
import Cookies  from "js-cookie";

export interface User
{
	id:number,
	prosoponym:string,
	email:string,
	emailVerifiedAt:string|null
}

export interface Auth
{
	user:User,
	roles:Role[]
}

export interface MaybeAuth
{
	user:User|null,
	roles:Role[],
	state:AuthLoadState
}

export type AuthLoadState=
	'ready'
	|'loading'
	|'failed'
	|'unloaded'
	;

export interface Role
{
	name:string,
	permissions:string[]
}

export type PageProps<
	T extends Record<string,unknown>=Record<string,unknown>,
>=T&{
	auth:Auth,
	ziggy:Config&{location:string}
};

export interface Hall
{
	id:number,
	name:string,
	location:string,
	capacity:number
}

export interface Event
{
	id:number,
	organizer:string,
	hall:Hall,
	participants:number[],
	title:string,
	description:string,
	start_time:string,
	end_time:string
}

export interface NewsItem
{
	id:number,
	title:string,
	content:string,
	createdAt:string,
	updatedAt:string,
	coverUrl?:string
}

/*
id
user_id
news_id
content
created_at
updated_at
*/
export interface Comment
{
	id:number,
	ownerId:number,
	ownerProsoponym:string,
	content:string,
	createdAt:string
}

export interface RequestWithPayload<T>
{
	accessToken:string,
	payload:T
}
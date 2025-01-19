import {Auth,MaybeAuth}     from './types';
import Cookies              from 'js-cookie';
import api                  from "./api.tsx";
import {AnyRouter,Register} from "@tanstack/react-router";
import {EMPTY_AUTH}         from "./Components/AuthProvider.tsx";


// export default function getAuth():Auth
// {
// 	api.get(
// 		'auth/roles',
// 		{
// 			params:{refreshToken:Cookies.get()['refreshToken']}
// 		}
// 	).then(roles=>console.warn(roles));
// 	return {} as Auth;
// }

export interface AuthResponse
{
	accessToken:string,
	refreshToken:string
}

type AuthRouterParam=Register extends {router:infer TRouter}?TRouter:AnyRouter;

function redirectToLogin(router:AuthRouterParam)
{
	const currentPath=router.state.location.pathname;
	if(currentPath!=='/login') router.navigate({to:'/auth/login'});
}

async function refreshToken(router:AuthRouterParam,elseRedirectToLogin:boolean=false):Promise<string|null>
{
	const refreshToken=Cookies.get('refreshToken');
	if(!refreshToken)
	{
		console.error('Refresh token is missing.');
		if(elseRedirectToLogin) redirectToLogin(router);
		return null;
	}
	try
	{
		const response=await api.post(
			'/api/auth/refresh',
			{token:refreshToken}
		);
		const newAccessToken=response.data.accessToken;
		Cookies.set('accessToken',newAccessToken);
		return newAccessToken;
	}
	catch(error)
	{
		console.error('Error refreshing token:',error);
		if(elseRedirectToLogin) redirectToLogin(router);
		return null;
	}
}

export default async function getAuth(
	router:AuthRouterParam,
	elseRedirectToLogin:boolean=false
):Promise<MaybeAuth>
{
	let accessToken=Cookies.get('accessToken')||null;
	if(!accessToken)
	{
		// Редирект выполнен в refreshToken
		if(!await refreshToken(router,elseRedirectToLogin)) return EMPTY_AUTH;
	}
	try
	{
		return await api.get<Auth>('auth/info',{params:{accessToken}})
						.then(r=>({...r.data,state:'ready'}))
	}
	catch(error)
	{
		console.error('Error fetching auth info:',error);
		if(elseRedirectToLogin) redirectToLogin(router);
		throw error;
	}
}

// export default async function getAuth():Promise<Auth|null>
// {
// 	const accessToken=Cookies.get('accessToken');
// 	if(!accessToken)
// 	{
// 		return await api.post(
// 			'/api/auth/refresh',
// 			{
// 				params:{
// 					token:Cookies.get('refreshToken')
// 				}
// 			}
// 		).then(
// 			r=>Cookies.set('accessToken',r.data.accessToken)
// 		).then(getAuth);
// 	}
// 	try
// 	{
// 		return await api.get('auth/info',{params:{accessToken}})
// 						.then(r=>r.data as Auth);
// 	}
// 	catch(error)
// 	{
// 		console.error('Error fetching roles:',error);
// 		return null;
// 	}
// }

export function setAuthTokens({accessToken,refreshToken}:AuthResponse)
{
	Cookies.set('accessToken',accessToken);
	Cookies.set('refreshToken',refreshToken);
}
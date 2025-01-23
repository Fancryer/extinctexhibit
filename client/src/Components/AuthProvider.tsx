import {useContext,createContext,ReactNode,useState,useEffect} from 'react';
import {MaybeAuth}                                             from '../types';
import getAuth                                                 from "../Auth.ts";
import {useRouter}                                             from "@tanstack/react-router";

interface AuthProviderProps
{
	children:ReactNode,
	elseRedirectToLogin?:boolean
}

const UNINIT_AUTH={user:null,roles:[]}
export const EMPTY_AUTH=():MaybeAuth=>({...UNINIT_AUTH,state:'unloaded'});
export const FAILED_AUTH=():MaybeAuth=>({...UNINIT_AUTH,state:'failed'});

interface AuthContext
{
	auth:MaybeAuth,
	clearAuth:()=>void
}

const AuthContext=createContext<AuthContext>(
	{
		auth:     EMPTY_AUTH(),
		clearAuth:()=>{
		}
	}
);

export const useAuth=()=>useContext(AuthContext);

export function AuthProvider({children,elseRedirectToLogin=false}:AuthProviderProps)
{
	const [auth,setAuth]=useState<MaybeAuth>(EMPTY_AUTH());
	const clearAuth=()=>setAuth(EMPTY_AUTH());
	const router=useRouter();

	useEffect(()=>{
		(async()=>{
			setAuth({...EMPTY_AUTH(),state:'loading'});
			try
			{
				await getAuth(router,elseRedirectToLogin).then(
					data=>setAuth({...data,state:'ready'})
				).then(
					()=>console.log('Auth loaded:',auth)
				);
			}
			catch(error)
			{
				console.error('Auth loading failed:',error);
				setAuth(FAILED_AUTH());
			}
		})();
	},[]);

	return <AuthContext.Provider value={{auth,clearAuth}} children={children}/>;
}
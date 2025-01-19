import {PropsWithChildren,useContext,createContext} from 'react';
import {Auth,User}                                  from '../types';

interface UserGuardProps extends PropsWithChildren
{
	user:Auth['user']|null;
}

// Создаем контекст с неопределенным значением по умолчанию
const UserContext=createContext<User|undefined>(undefined);

// Хук для удобного доступа к контексту
export const useUser=()=>{
	//return useContext(UserContext)??_throw(new Error('useUser должен использоваться внутри UserGuard'));
	const context=useContext(UserContext);
	if(context===undefined)
		throw new Error('useUser должен использоваться внутри UserGuard');
	return context;
};


// Компонент UserGuard
export default function UserGuard({user,children}:UserGuardProps)
{
	return (
		user
		&&<UserContext.Provider value={user}>
			{children}
        </UserContext.Provider>
	);
}
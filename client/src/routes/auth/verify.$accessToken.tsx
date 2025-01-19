import {useEffect,useState}                      from 'react'
import {createFileRoute,useLocation,useNavigate} from '@tanstack/react-router'
import api                                       from '../../api.tsx'
import {HttpStatusCode}                          from 'axios'
import AuthenticatedLayout                       from '../../Layouts/AuthenticatedLayout.tsx'

export const Route=createFileRoute(
	'/auth/verify/$accessToken')({component:Verify})

function Verify()
{
	const {accessToken}=Route.useParams();
	const [status,setStatus]=useState<'loading'|'success'|'error'>(
		'loading'
	)
	const [statusText,setStatusText]=useState('')
	const location=useLocation()
	const navigate=useNavigate()

	useEffect(()=>{
		if(!accessToken)
		{
			setStatus('error')
			return
		}
		// Отправляем запрос на верификацию
		api
			.put(`verification/verify?accessToken=${accessToken}`)
			.then(async(r)=>{
				setStatus(r.status===HttpStatusCode.Ok?'success':'error')
				setStatusText(r.statusText)
				if(status==='success') await navigate({to:'/'})
			})
			.catch((e)=>{
				setStatus('error')
				setStatusText(e.message)
			})
	},[location.search])
	return (
		<AuthenticatedLayout header={<div>Verification</div>} isCentered>
			{status==='loading'&&<div>Verifying...</div>}
			{
				status==='success'
				&&<div>
                    Account successfully verified!
                </div>
			}
			{status==='error'&&(
				<div>
					Verification failed!
					{statusText}
					<button
						onClick={
							(_)=>
								navigate({to:'/auth/verify/$accessToken',params:{accessToken}})
						}
					>
						Retry
					</button>
				</div>
			)}
		</AuthenticatedLayout>
	)
}

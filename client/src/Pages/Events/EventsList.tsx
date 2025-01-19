import {Auth,Event}               from '../../types';
import EventCard                  from './EventCard';

interface EventsListProps
{
	events:Event[];
	user:Auth['user']|null;
	roles:Auth['roles'];
}

export default function EventsList({events,user,roles}:EventsListProps)
{
	// const [participants,setParticipants]=useState<number[]>([]);
	// useEffect(()=>{
	// 	events.map(
	// 		({id})=>axios.get(
	// 			route('participants.for_event',{id})
	// 		).then(({data})=>{
	// 			setParticipants(data);
	// 			console.debug(data);
	// 		})
	// 	);
	// },[events]);
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
			{events.map(event=><EventCard
				key={event.id}
				event={event}
				user={user}
				roles={roles}
			/>)}
		</div>
	);
}

import {Auth,Event,MaybeAuth} from '../../types';
import EventCard              from './EventCard';

interface EventsListProps
{
	events:Event[]
}

export default function EventsList({events}:EventsListProps)
{
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
			{events.map(event=><EventCard
				key={event.id}
				event={event}
			/>)}
		</div>
	);
}

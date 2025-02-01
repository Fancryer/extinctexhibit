import {Event}   from '../../types';
import EventCard from './EventCard';

interface EventsListProps
{
	events:Event[],
	onEventDelete:()=>Promise<void>
}

export default function EventsList({events,onEventDelete}:EventsListProps)
{
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
			{events.map(event=><EventCard
				key={event.id}
				event={event}
				onEventDelete={onEventDelete}
			/>)}
		</div>
	);
}

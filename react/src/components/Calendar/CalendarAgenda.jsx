import React from 'react'
import { useCalendarState } from '../customHooks/useCalendarState'
import Loading from '../Loading';

export default function CalendarAgenda() {
	const {loading} = useCalendarState();





	const renderMainView = () => loading ? (
		<Loading />
	) : (
		<div className='calendar-agenda-wrapper'>


		</div>
	)
	return renderMainView();
}

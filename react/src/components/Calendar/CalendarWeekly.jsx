import React, { useEffect, useState } from 'react'
import { useCalendarState } from './useCalendarState'
import { calendarUtils } from './calendarUtils';



export default function CalendarWeekly() {
	const [currentWeekDates, setCurrentWeekDates] = useState();
	const {
		dates,
		currentDate,
		allTasks,
	} = 
	useCalendarState()

useEffect(() => {
	if(dates.length != 0) {
		const currentWeekDates = calendarUtils().getCurrentWeekDates(dates, currentDate);
		setCurrentWeekDates(currentWeekDates);
	}
}, [dates])

	return (
		// <div className='calendar-weekly__container'>
		// 	{renderCurrentWeek}
			
			
		// </div>
		<div>
			nig
		</div>
	)
}

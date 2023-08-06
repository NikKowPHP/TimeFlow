import React, { useEffect, useState } from 'react'
import { useCalendarState } from './useCalendarState'
import { calendarUtils } from './calendarUtils';



export default function CalendarWeekly() {
	const [currentWeekDates, setCurrentWeekDates] = useState('');
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

useEffect(() => {
	console.log(currentWeekDates)

}, [currentWeekDates])


const renderCurrentWeekDates = () => (
	<div className='calendar-weekly__dates-container'>
		{
			currentWeekDates.map((date) => (
				<div>{date.getDate()}</div>
			))
		}
	</div>
)

	return (
		<div className='calendar-weekly__container'>
			{renderCurrentWeekDates()}
			
			
		</div>
	)
}

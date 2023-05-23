import React, { useState } from 'react'
import '../styles/calendar.css'

export default function Calendar() {

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [currentYear, setCurrentYear] = useState(null);
		const onClickPerv = () => {

		}
		const onClickNext = () => {

		}
		const handleDateClick = (date) => {
			setSelectedDate(date);
		}


	const renderCalendar = () => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();
		console.log(currentDate);
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
		const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
		const calendarDays = [];

		for(let i = 1; i <= daysInMonth; i++) {
			calendarDays.push(
				<li className={`${currentDate.getDate() === i ? 'active' : 'inactive'}`} key={i} onClick={() => handleDateClick(new Date(currentYear, currentMonth, i))}>{i}</li>
			)
		}
		return calendarDays;
	}

	return (
		<div className='calendar-wrapper'>
			<header>
				<p className="current-date">{currentYear}</p>
				<div className="icons">
					<span onClick = {onClickPerv} className="material-symbols-rounded">chevron_left</span>
					<span onClick={onClickNext} className="material-symbols-rounded">chevron_right</span>
				</div>
			</header>
			<div className="calendar">
				<ul className="weeks">
					<li>Mon</li>
					<li>Tue</li>
					<li>Wed</li>
					<li>Thu</li>
					<li>Fri</li>
					<li>Sat</li>
					<li>Sun</li>
				</ul>
				<div className="days">
					<ul>
						{renderCalendar()}
					</ul>
					</div>
			</div>
		</div>
	)
}

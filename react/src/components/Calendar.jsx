import React, { useEffect, useState } from "react";
import "../styles/calendar.css";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentDate = new Date();
	const currentDateDay = currentDate.getDate();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);


  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

	useEffect(() => {
		getCurrentMonthDates();
	}, [])

	const getCurrentMonthDates = () => {
		const firstDayOfMonth = new Date(year,month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);
		const currentMonthDates = [];

		for(let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
			currentMonthDates.push(i);
		}
		setDates(currentMonthDates);
	}

  const getNextMonthDates = () => {
    const nextMonth = new Date(year, month + 1);
		setYear(nextMonth.getFullYear());
		setMonth(nextMonth.getMonth());
    const nextMonthDates = [];


    while (nextMonth.getMonth() === month + 1) {
      nextMonthDates.push(nextMonth.getDate());
      nextMonth.setDate(nextMonth.getDate() + 1);
    }
    console.log(nextMonth.getMonth());
    setDates(nextMonthDates);
  };





  const getPrevMonthDates = () => {};


  const handleDateClick = (date) => {
    setSelectedDate(date);
  };



  return (
    <div className="calendar-wrapper">
      <header>
        <p className="current-date">{year}</p>
        <p className="current-date">{getMonthName(month)}</p>
        <div className="icons">
          <span
            onClick={getPrevMonthDates}
            className="material-symbols-rounded"
          >
            chevron_left
          </span>
          <span
            onClick={getNextMonthDates}
            className="material-symbols-rounded"
          >
            chevron_right
          </span>
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
						{
							dates.map((date, index)=> (
								<li onClick={handleDateClick} className={currentDateDay === date ? 'active' : 'inactive' }  key={index}>{date}</li>
							))
						}
						</ul>
        </div>
      </div>
    </div>
  );
}

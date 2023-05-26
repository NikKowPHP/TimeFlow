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
		generateMonthDates();
	}, [year, month])

	const generateMonthDates = () => {
		const firstDayOfMonth = new Date(year,month, 1);
    const startingDay = firstDayOfMonth.getDay();
    console.log(startingDay)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
		const currentMonthDates = [];
    for( let i = 1; i < startingDay; i++ ) {
      currentMonthDates.push('');
    }

		for(let i = 1; i <= daysInMonth; i++) {
			currentMonthDates.push(i);
		}
		setDates(currentMonthDates);
	}

  const goToNextMonth = () => {
    if(month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };




  const getActiveDateClass = (date) => {
    const presentDate = new Date();
    const presentMonth = presentDate.getMonth();
    const presentDateDay = presentDate.getDate();
    const presentYear = presentDate.getFullYear();
    if(month === presentMonth && presentDateDay === date && year === presentYear) {
      return 'active';
    } 
    return 'inactive';
  }

  const getPrevMonthDates = () => {
    if(month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };


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
            onClick={goToNextMonth}
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
								<li onClick={handleDateClick} className={getActiveDateClass(date) }  key={index}>{date}</li>
							))
						}
						</ul>
        </div>
      </div>
    </div>
  );
}

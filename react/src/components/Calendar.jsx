import React, { useEffect, useState } from "react";
import "../styles/calendar.css";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());

  const currentDate = new Date();
  const months = generateMonths();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showDates, setShowDates] = useState(false);

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

  const generateMonthDates = () => {
    if (!showMonths) {
      const firstDayOfMonth = new Date(year, month, 1);
      const startingDay = firstDayOfMonth.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const currentMonthDates = [];
      for (let i = 1; i < startingDay; i++) {
        currentMonthDates.push("");
      }

      for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDates.push(i);
      }
      setDates(currentMonthDates);
    } else {
    }
  };

  useEffect(() => {
    generateMonthDates();
  }, [year, month]);

  const goToNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const getActiveDateClass = (date) => {
    const presentDate = new Date().toLocaleDateString();
    date = date.toLocaleDateString();
    console.log(selectedDate);
    if(selectedDate === presentDate === date) {
      return 'active';
    } else if(selectedDate === date) {
      return 'active';
    }
  };

  const getPrevMonthDates = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleDateClick = (date) => {
    const selectedDate = new Date(year, month, date).toLocaleDateString();
    console.log(selectedDate);
    
    setSelectedDate(selectedDate);
  };
  const toggleShowMonths = () => {
    setShowMonths(!showMonths);
  };
  const toggleShowYears = () => {
    setShowYears(!showYears);
  };
  const handleMonthClick = (selectedMonth) => {
    setMonth(selectedMonth);
    setShowMonths(!showMonths);
  };

  const renderDates = () => {
    return (
      <>
        <ul className="weeks animated fadeInDown">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <div className="days animated fadeInDown">
          <ul>
            {dates.map((date, index) => (
              <li
                onClick={() => handleDateClick(date)}
                className={getActiveDateClass(new Date(year,month,date))}
                key={index}
              >
                {date}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderMonths = () => {
    return (
      <ul className="months animated fadeInDown">
        {months.map((month, index) => (
          <li
            onClick={() => handleMonthClick(month)}
            className="month animated fadeInDown"
            key={index}
          >
            {getMonthName(month)}
          </li>
        ))}
      </ul>
    );
  };


  return (
    <div className="calendar-wrapper">
      <header>
        <button
          className="current-date btn-transparent"
          onClick={toggleShowYears}
        >
          {year}
        </button>
        <button
          className="current-month btn-transparent"
          onClick={toggleShowMonths}
        >
          {getMonthName(month)}
        </button>

        <div className="icons">
          <span
            onClick={getPrevMonthDates}
            className="material-symbols-rounded"
          >
            chevron_left
          </span>
          <span onClick={goToNextMonth} className="material-symbols-rounded">
            chevron_right
          </span>
        </div>
      </header>
      <div className="calendar">
        {showMonths && renderMonths()}
        {showDates && renderDates()}
        {!showMonths && renderDates()}
      </div>
    </div>
  );

  // get months 
  function generateMonths() {
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  }
}
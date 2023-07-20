import { useState } from "react";
import "../styles/calendar.css";

export default function Calendar() {

  const [selectedDate,setSelectedDate] = useState('');

  // handle click on date
  const handleDateClick = (date) => {
    const selectedDate = date.toLocaleDateString()  ;
    setSelectedDate(selectedDate);
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

  // render dates of month
  const renderDates = () => {
    return (
      <div className="calendar">
        <ul className={"weeks animated fadeInDown "}>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <div className={"days animated fadeInDown "}>
          {dates.map((date, index) => (
            <div
              onClick={() => handleDateClick(date)}
              className={`${getActiveDateClass(date)}`}
              key={index}
            >
              {date !== "" && date.getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // render calendar view
  return (
    <div className="calendar-wrapper">
      <header>
        <button
          className="current-date btn-transparent"
        >
          {year}
        </button>
        <button
          className="current-month btn-transparent"
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
        {renderDates()}
    </div>
  );
}

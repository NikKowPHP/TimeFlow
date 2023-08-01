import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";
import { useState } from "react";


export default function CalendarAside({handleDateClick }) {

  const {dates, year, month, setMonth, goToNextMonth, goToPrevMonth, currentDate, selectedDate } = useCalendarState();
  const [showMonths, setShowMonths] = useState(false);

  const toggleMonthsView = () => {
    setShowMonths((prevShowMonth)=> !prevShowMonth)
  }
  // Switch month by selecting month
  const handleMonthClick = (month) => {
    setMonth(month);
  }

  // render all months view selection instead of the dates
  const renderMonths = () => {
    const months = calendarUtils().generateMonthNumbers();
    return (
      <ul className="months animated fadeInDown">
        {months.map((month, index) => (
          <li
            onClick={() => handleMonthClick(month)}
            className="month animated fadeInDown"
            key={index}
          >
            {calendarUtils().getMonthName(month)}
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
              className={`${calendarUtils().getActiveDateClass(date, currentDate, selectedDate)}`}
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
        onClick={toggleMonthsView}
          className="current-month btn-transparent"
        >
          {calendarUtils().getMonthName(month)}
        </button>

        <div className="icons">
          <span
            onClick={goToPrevMonth}
            className="material-symbols-rounded"
          >
            chevron_left
          </span>
          <span onClick={goToNextMonth} className="material-symbols-rounded">
            chevron_right
          </span>
        </div>
      </header>
      {
        showMonths ? renderMonths() : renderDates()
      }
    </div>
  );
}

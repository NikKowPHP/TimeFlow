import "../../styles/calendar/calendar-aside.css";
import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";
import { useState } from "react";

export default function CalendarAside({ handleDateClick }) {
  const {
    dates,
    year,
    month,
    setMonth,
    goToNextMonth,
    goToPrevMonth,
    currentDate,
    selectedDate,
  } = useCalendarState();
  const [showMonths, setShowMonths] = useState(false);

  const toggleMonthsView = () => {
    setShowMonths((prevShowMonth) => !prevShowMonth);
  };
  // Switch month by selecting month
  const handleMonthClick = (month) => {
    setMonth(month);
    toggleMonthsView();
  };

  // render all months view selection instead of the dates
  const renderMonths = () => {
    const months = calendarUtils().generateMonthNumbers();
    return (
      <div className="calendar-aside__body-wrapper">
        <ul className="calendar-aside__month-list animated fadeInDown">
          {months.map((month, index) => (
            <li
              onClick={() => handleMonthClick(month)}
              className="calendar-aside__month-block animated fadeInDown"
              key={index}
            >
              {calendarUtils().getMonthName(month)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // render dates of month
  const renderDates = () => {
    return (
      <>
        <div className="calendar-aside__week-list animated fadeInDown">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className="calendar-aside__date-list animated fadeInDown">
  {dates.map((date, index) => (
    <div
      onClick={() => handleDateClick(date)}
      className={`calendar-aside__date-block ${calendarUtils().getActiveDateClass(
        date,
        currentDate,
        selectedDate
      )}`}
      key={index}
    >
      {date !== "" && date.getDate()}
    </div>
  ))}
</div>

        </>
    );
  };

  // render calendar view
  return (
    <div className="calendar-aside__container">
      <div className="calendar-aside__header">
        <button className="current-date btn-transparent">{year}</button>
        <button
          onClick={toggleMonthsView}
          className="current-month btn-transparent"
        >
          {calendarUtils().getMonthName(month)}
        </button>

        <div className="icons">
          <span onClick={goToPrevMonth} className="material-symbols-rounded">
            chevron_left
          </span>
          <span onClick={goToNextMonth} className="material-symbols-rounded">
            chevron_right
          </span>
        </div>
      </div>
      <div className="calendar-aside__body-container">
        {showMonths ? renderMonths() : renderDates()}
      </div>
    </div>
  );
}

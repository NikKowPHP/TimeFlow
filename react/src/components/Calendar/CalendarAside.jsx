import "../../styles/calendar/calendar-aside.css";
import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";
import { useState } from "react";

/**
 * CalendarAside Component
 *
 * This component represents the aside section of the calendar that displays the navigation controls,
 * current date, and month view selection.
 *
 * @returns {JSX.Element} - The JSX element representing the CalendarAside component.
 */

export default function CalendarAside() {

  // Using the custom hook to access calendar state and functions
  const {
    dates,
    year,
    month,
    setMonth,
    goToNextMonth,
    goToPrevMonth,
    currentDate,
    selectedDate,
    setSelectedDate,
  } = useCalendarState();

  // State to manage month view selection
  const [showMonths, setShowMonths] = useState(false);

  // Function to toggle between month view and date view
  const toggleMonthsView = () => {
    setShowMonths((prevShowMonth) => !prevShowMonth);
  };

  // Switch month by selecting month
  const handleMonthClick = (month) => {
    setMonth(month);
    toggleMonthsView();
  };

  // Function to handle month selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Function to render  month view selection
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

  // Function to render date view
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
              className={`calendar-aside__date-block 
      ${calendarUtils().getActiveDateClass(
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

  // Function to render the CalendarAside component
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

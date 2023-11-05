import "../../styles/calendar/calendar-aside.css";
import { calendarUtils } from "../../utils/calendarUtils";
import { useState } from "react";

/**
 * CalendarAside Component
 *
 * This component represents the aside section of the calendar that displays the navigation controls,
 * current date, and month view selection.
 *
 * @returns {JSX.Element} - The JSX element representing the CalendarAside component.
 */

export default function CalendarAside({
  currentDate,
  year,
  selectedDate,
  dispatch,
  month,
  setMonth,
  dates,
  selectDate,
}) {
  const {
    getMonthName,
    getDateActiveClass,
    generateMonthNumbers,
    goToNextMonth,
    goToPrevMonth,
  } = calendarUtils();

  // State to manage month view selection
  const [showMonths, setShowMonths] = useState(false);

  // Function to toggle between month view and date view
  const toggleMonthsView = () => {
    setShowMonths((prevShowMonth) => !prevShowMonth);
  };

  // Switch month by selecting month
  const handleMonthClick = (month) => {
    dispatch(setMonth(month));
    toggleMonthsView();
  };

  // Function to handle month selection
  const handleDateClick = (date) => {
    dispatch(selectDate(date));
  };

  // Function to render  month view selection
  const renderMonths = () => {
    const months = generateMonthNumbers();
    return (
      <div className="calendar-aside__body-wrapper">
        <ul className="calendar-aside__month-list animated fadeInDown">
          {months.map((month, index) => (
            <li
              onClick={() => handleMonthClick(month)}
              className="calendar-aside__month-block animated fadeInDown"
              key={index}
            >
              {getMonthName(month)}
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
      ${getDateActiveClass(date, currentDate, selectedDate)}`}
              key={index}
            >
              {date !== "" && date.getDate()}
            </div>
          ))}
        </div>
      </>
    );
  };
  const renderHeader = () => (
    <div className="calendar-aside__header">
      <button className="current-date btn-transparent">{year}</button>
      <button
        onClick={toggleMonthsView}
        className="current-month btn-transparent"
      >
        {getMonthName(month)}
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
  );
  const renderBody = () => (
    <div className="calendar-aside__body-container">
      {showMonths ? renderMonths() : renderDates()}
    </div>
  );

  return (
    <div className="calendar-aside__container">
      {renderHeader()}
      {renderBody()}
    </div>
  );
}

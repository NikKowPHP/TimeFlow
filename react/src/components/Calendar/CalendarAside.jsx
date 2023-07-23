import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";


export default function CalendarAside({handleDateClick }) {

  const {dates, year, month, goToNextMonth, goToPrevMonth, currentDate, selectedDate } = useCalendarState();

  // // render all months 
  // const renderMonths = () => {
  //   return (
  //     <ul className="months animated fadeInDown">
  //       {months.map((month, index) => (
  //         <li
  //           // onClick={() => handleMonthClick(month)}
  //           className="month animated fadeInDown"
  //           key={index}
  //         >
  //           {getMonthName(month)}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };

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
        {renderDates()}
    </div>
  );
}

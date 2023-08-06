import "../../styles/calendar/calendar-weekly.css";
import React, { useEffect, useState } from "react";
import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";

export default function CalendarWeekly() {
  const [currentWeekDates, setCurrentWeekDates] = useState("");
  const { dates, currentDate, allTasks, selectedDate, setSelectedDate } =
    useCalendarState();

  useEffect(() => {
    if (dates.length != 0) {
      const currentWeekDates = calendarUtils().getCurrentWeekDates(
        dates,
        currentDate
      );
      setCurrentWeekDates(currentWeekDates);
    }
  }, [dates]);

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  const weekDays = () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  const generateHoursOfDay = () => {
    const hoursOfDay = [];
    for (let i = 1; i <= 24; i++) {
      hoursOfDay.push(i);
    }
    return hoursOfDay;
  };
  const renderTimeGrid = () => {
    const hoursOfDay = generateHoursOfDay();
    return (
      <div className="calendar-weekly__time-list">
        {hoursOfDay.map((hour) => (
          <div className="calendar-weekly__time-block" key={hour}>
            <div className="hour-label">{hour}</div>
						<div className="time-cells-list">
							{currentWeekDates && currentWeekDates.map((date, index) => (
								<div
									key={index}
									className={ `calendar-weekly__time-cell ${
										calendarUtils().getActiveDateClass(date, currentDate, selectedDate)}`}
										onClick={() => handleDateClick(date)}
								>
								</div>
							))}
						</div>
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentWeekDates = () => (
    <div className="calendar-weekly__dates-list">
      {currentWeekDates.map((date, index) => (
        <div key={index} className="calendar-weekly__date-block">
          <div className="calendar-weekly__date-block__weekday">
            {weekDays()[index]}
          </div>
          <div
            className={`calendar-weekly__date-block__date
      ${calendarUtils().getActiveDateClass(date, currentDate, selectedDate)}`}
            onClick={() => handleDateClick(date)}
          >
            {date.getDate()}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="calendar-weekly__container">
      {currentWeekDates && renderCurrentWeekDates()}
      {renderTimeGrid()}
    </div>
  );
}

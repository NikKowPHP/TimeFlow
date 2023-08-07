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
      // const formattedHour = i.toString().padStart(2, '0');
      hoursOfDay.push(i);
    }
    return hoursOfDay;
  };

  const handleDateHourClick = (date, hour, isFirstHalf) => {
    const startHour = hour;
    const endHour = isFirstHalf ? hour + 0.5 : hour+1;

    // Convert decimal fractions to minutes
    const startMinutes = Math.floor((startHour % 1) * 60);
    const endMinutes = Math.floor((endHour % 1) * 60);


    const startTime = new Date(date);
    const endTime = new Date(date);
    startTime.setHours(Math.floor(startHour), startMinutes,0,0);
    endTime.setHours(Math.floor(endHour), endMinutes,0,0);
    console.log('clicked period ', startTime, 'to ', endTime);
  }

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
										onClick={(e) => handleDateHourClick(date, hour, e.nativeEvent.offsetY < 30)}
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

import "../../styles/calendar/calendar-weekly.css";
import React, { useEffect, useState } from "react";
import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";

export default function CalendarWeekly() {
  const [currentWeekDates, setCurrentWeekDates] = useState("");

  const [clickedCellIndex, setClickedCellIndex] = useState(null);
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);

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


  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const convertTimePeriod = (startTime, endTime) => {
    const startTimeString = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTimeString = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return startTimeString + "-" + endTimeString;
  };

  const handleDateHourClick = (
    date,
    hour,
    isFirstHalf,
    e,
    dateIndex,
    hourIndex
  ) => {
    const startHour = !isFirstHalf ? hour + 0.5 : hour;
    const endHour = !isFirstHalf ? hour + 1.5 : hour + 1;

    // Convert decimal fractions to minutes
    const startMinutes = Math.floor((startHour % 1) * 60);
    const endMinutes = Math.floor((endHour % 1) * 60);

    const startTime = new Date(date);
    const endTime = new Date(date);
    startTime.setHours(Math.floor(startHour), startMinutes, 0, 0);
    endTime.setHours(Math.floor(endHour), endMinutes, 0, 0);

    const rect = e.target.getBoundingClientRect();
    const clickedY = e.clientY - rect.top;
    const cellHeight = rect.height;

    const clickedHalf = clickedY < cellHeight / 2 ? "first" : "second";
    const clickedCellIndex = hourIndex.toString() + dateIndex.toString();

    setClickedCellIndex(clickedCellIndex);
    setClickedHalf(clickedHalf);

    setClickedPeriod(convertTimePeriod(startTime, endTime));
  };

  const getCellClassName = (hourIndex, dateIndex) => {
    const cellIndex = hourIndex.toString() + dateIndex.toString();
    return clickedCellIndex === cellIndex ? "clicked-cell" : "";
  };

  const getCellHalfClassName = () => {
    switch (clickedHalf) {
      case "first":
        return "first-half";
      case "second":
        return "second-half";
      default:
        return "";
    }
  };

  const renderTimeGrid = () => {
    const hoursOfDay = calendarUtils().generateHoursOfDay();
    return (
      <div className="calendar-weekly__time-list">
        {hoursOfDay.map((hour, hourIndex) => (
          <div className="calendar-weekly__time-block" key={hourIndex}>
            <div className="hour-label">{calendarUtils().convertHour(hour)}</div>
            <div className="time-cells-list">
              {currentWeekDates &&
                currentWeekDates.map((date, dateIndex) => {
                  const cellClassNameSelected = getCellClassName(
                    hourIndex,
                    dateIndex
                  );
                  const cellHalfClassName = getCellHalfClassName();
                  // a cell
                  return (
                    <div
                      key={dateIndex}
                      className={`calendar-weekly__time-cell ${cellClassNameSelected} ${cellHalfClassName}`}
                      onClick={(e) =>
                        handleDateHourClick(
                          date,
                          hour,
                          e.nativeEvent.offsetY < 30,
                          e,
                          dateIndex,
                          hourIndex
                        )
                      }
                    >
                      {cellClassNameSelected === "clicked-cell" && (
                        <div className="clicked-new-task-tooltip">
                          <h4>(Untitled)</h4>
                          <p className="clicked-new-task-tooltip__text">
                            {cellClassNameSelected === "clicked-cell" &&
                              clickedPeriod}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
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
            {calendarUtils().weekDays()[index]}
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

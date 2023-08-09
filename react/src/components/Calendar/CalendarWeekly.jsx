import "../../styles/calendar/calendar-weekly.css";
import React, { useEffect, useState } from "react";
import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import Tooltip from "../tooltips/Tooltip";
import { useTooltipState } from "../tooltips/useTooltipState";

export default function CalendarWeekly() {
  const [currentWeekDates, setCurrentWeekDates] = useState("");

  const [clickedCellIndex, setClickedCellIndex] = useState(null);
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);

  const { dates, currentDate, allTasks, selectedDate, setSelectedDate } =
    useCalendarState();

  // Get tooltip's state from custom hook
  const {
    openedTooltipId,
    isTooltipVisible,
    tooltipPositionClass,
    showTooltip,
    hideTooltip,
  } = useTooltipState();

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

  // Get the class name for an active task
  const toggleTaskActiveClass = (taskId) => {
    return (
      openedTooltipId &&
      openedTooltipId === taskId &&
      isTooltipVisible &&
      "task-active"
    );
  };

  // Handle click on a task or a date to show the tooltip
  const handleOnClick = (event, id) => {
    // Close opened tooltip
    if (openedTooltipId !== null) {
      hideTooltip();
    }
    event.stopPropagation();
    showTooltip(id);
  };

  // Render the header of the tooltip content
  const tooltipContentHeader = () => (
    <div className="tooltip-tools">
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
      </svg>
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
        <path d="M9 8h2v9H9zm4 0h2v9h-2z"></path>
      </svg>
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.8 2L12 10.8 4.8 6h14.4zM4 18V7.87l8 5.33 8-5.33V18H4z"></path>
      </svg>
      <svg
        style={{ cursor: "pointer" }}
        onClick={() => hideTooltip()}
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
      </svg>
    </div>
  );

  const renderDateTasks = (date, hourIndex) => {
    const convertedHourIndex = hourIndex.toString().padStart(2, '0');
    console.log(convertedHourIndex)
    const convertedDate = dateUtils().convertDateSql(date.toLocaleDateString());



    const dateTasks = allTasks.filter((task) => {
      if(task.date === convertedDate) {
        const slicedTaskTime = task.time_start.split(':')[0];
        if(slicedTaskTime === convertedHourIndex) {
          return true;
        }
      }
    });

    const maxTasksToShow = Math.min(dateTasks.length, 4);

    return (
      <div className="tasks-list">
        <ul>
          {dateTasks.slice(0, maxTasksToShow).map((task) => {
            // Calculate cell indexes for task period

            const startTimestamp = new Date(`2000-01-01 ${task.time_start}`);
            const endTimestamp = new Date(`2000-01-01 ${task.time_end}`);
            const taskDurationMinutes = (endTimestamp - startTimestamp) / 60000;
            debugger
            const expandedElementStyle = {
              height: `${taskDurationMinutes + 35}px`,
            }
          
          return (
            <Tooltip
              classes={`tooltip-task-description ${tooltipPositionClass} `}
              key={task.id}
              isTooltipVisible={openedTooltipId === task.id}
              tooltipPositionClass={tooltipPositionClass}
              tooltipId={openedTooltipId}
              content={
                <div>
                  {tooltipContentHeader()}
                  <div className="tooltip-task-title">
                    <h2>{task.title}</h2>
                    <p>
                      {task.date} ⋅ {task.time_start}-{task.time_end}
                    </p>
                  </div>
                  <div className="tooltip-task-additional">
                    {/* TODO: create notifications */}
                    <div className="tooltip-task-notification">
                      <svg
                        focusable="false"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
                      </svg>
                      <p>in 5 minutes before</p>
                    </div>
                    <div className="tooltip-task-owner">
                      <i className="fa fa-calendar"></i>
                      {task.user.name}
                    </div>
                  </div>
                </div>
              }
            >

              <li
                className={`task-option ${toggleTaskActiveClass(task.id)} `}
                onClick={(event) => handleOnClick(event, task.id)}
                style={expandedElementStyle}
              >
                {`${task.title} ${task.time_start} ${task.time_end}`}
              </li>


            </Tooltip>
          )})}
        </ul>
      </div>
    );
  };

  const renderTimeGrid = () => {
    const hoursOfDay = calendarUtils().generateHoursOfDay();
    return (
      <div className="calendar-weekly__time-list">
        {hoursOfDay.map((hour, hourIndex) => (
          <div className="calendar-weekly__time-block" key={hourIndex}>
            <div className="hour-label">
              {calendarUtils().convertHour(hour)}
            </div>
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

                      {renderDateTasks(date, hourIndex)}

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

import "../../styles/calendar/calendar-weekly.css";
import React, { useEffect, useState } from "react";
import { useCalendarState } from "./useCalendarState";
import { calendarUtils } from "./calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import Tooltip from "../tooltips/Tooltip";
import { useTooltipState } from "../tooltips/useTooltipState";
import svgPaths from "../svgPaths";

export default function CalendarWeekly() {
  // Get tooltip's state from custom hook
  const {
    openedTooltipId,
    isTooltipVisible,
    tooltipPositionClass,
    showTooltip,
    hideTooltip,
  } = useTooltipState();

  const { dates, currentDate, allTasks, selectedDate, setSelectedDate } =
    useCalendarState();

  // Destructure functions from calendarUtils
  const {
    getCurrentWeekDates,
    generateHoursOfDay,
    convertHour,
    weekDays,
    getActiveDateClass,
    convertTimePeriod,
  } = calendarUtils();

  const [currentWeekDates, setCurrentWeekDates] = useState("");
  const [clickedCellIndex, setClickedCellIndex] = useState(null);
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);

  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(currentDate);

  const handlePreviousWeek = () => {
    const previousWeekStartDate = new Date(currentWeekStartDate);
    previousWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(previousWeekStartDate);
  };

  const handleNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStartDate);
  };

  useEffect(() => {
    if (dates.length != 0) {
      const currentWeekDates = getCurrentWeekDates(dates, currentWeekStartDate);
      setCurrentWeekDates(currentWeekDates);
    }
  }, [dates, currentWeekStartDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleDateHourClick = (
    date,
    hour,
    isFirstHalf,
    e,
    dateIndex,
    hourIndex
  ) => {
    const tooltipId = `${dateIndex}${hourIndex}`;
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
    setSelectedDate(date)

    setClickedPeriod(convertTimePeriod(startTime, endTime));

    handleOnClick(e, tooltipId);
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
        {svgPaths.edit}
      </svg>
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        {svgPaths.delete}
      </svg>
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        {svgPaths.envelope}
      </svg>
      <svg
        style={{ cursor: "pointer" }}
        onClick={() => hideTooltip()}
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        {svgPaths.close}
      </svg>
    </div>
  );

  const renderDateTasks = (date, hourIndex) => {
    const convertedHourIndex = hourIndex.toString().padStart(2, "0");
    const convertedDate = dateUtils().convertDateSql(date.toLocaleDateString());

    const dateTasks = allTasks.filter((task) => {
      if (task.date === convertedDate) {
        const slicedTaskTime = task.time_start.split(":")[0];
        if (slicedTaskTime === convertedHourIndex) {
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
            const toggledTaskActiveClass = toggleTaskActiveClass(task.id);
            const isTooltipVisible = () => openedTooltipId === task.id;

            const startTimestamp = new Date(`2000-01-01 ${task.time_start}`);
            const endTimestamp = new Date(`2000-01-01 ${task.time_end}`);
            const taskDurationMinutes = (endTimestamp - startTimestamp) / 60000;
            const expandedElementStyle = {
              height: `${taskDurationMinutes + 35}px`,
            };

            return (
              <Tooltip
                classes={`tooltip-task-description ${tooltipPositionClass} `}
                key={task.id}
                isTooltipVisible={isTooltipVisible()}
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
                          {svgPaths.notification}
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
                  className={`task-option ${toggledTaskActiveClass}`}
                  onClick={(event) => handleOnClick(event, task.id)}
                  style={expandedElementStyle}
                >
                  {`${task.title} ${task.time_start} ${task.time_end}`}
                </li>
              </Tooltip>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderTimeGrid = () => {
    const hoursOfDay = generateHoursOfDay();

    return (
      <div className="calendar-weekly__time-list">
        {hoursOfDay.map((hour, hourIndex) => (
          <div className="calendar-weekly__time-block" key={hourIndex}>
            <div className="hour-label">{convertHour(hour)}</div>
            <div className="time-cells-list">
              {currentWeekDates &&
                currentWeekDates.map((date, dateIndex) => {
                  const cellId = `${dateIndex}${hourIndex}`;
                  const cellClassNameSelected = getCellClassName(
                    hourIndex,
                    dateIndex
                  );
                  const cellHalfClassName = getCellHalfClassName();

                  const dayName = weekDays()[date.getDay()];

                  // Tooltip content
                  const tooltipContent = (
                    <div>
                      {/* render header of tooltip */}
                      {tooltipContentHeader()}
                      <div className="tooltip-task-title">
                        <h2>Create a new event </h2>
                        <input type="text" placeholder="Add a name" />
                        <div className="tooltip-task-time">
                          <span>{dayName}</span>
                          <span>{clickedPeriod}</span>
                          {/* <input  type="time" value={} name="" id="" /> */}
                        </div>
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
                            {svgPaths.notification}
                          </svg>
                          <p>in 5 minutes before</p>
                        </div>

                        <div className="tooltip-task-owner">
                          <i className="fa fa-calendar"></i>
                        </div>
                      </div>
                    </div>
                  );

                  // Cell content
                  const cellContent = (
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

                        {/* Click on cell content */}
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
                  )


                  // Tooltip wrapper

                  const tooltip = (
                    <Tooltip
                      isTooltipVisible={openedTooltipId === cellId}
                      tooltipPositionClass={tooltipPositionClass}
                      classes={`tooltip-task-description ${tooltipPositionClass} `}
                      key={cellId}
                      content={tooltipContent}
                    >
                      {/* Children */}
                      {cellContent}
                    </Tooltip>
                  )

                  return tooltip;
                })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentWeekDates = () => (
    <>
      <div className="calendar-weekly__dates-switcher-container">
        <span
          onClick={handlePreviousWeek}
          className="material-symbols-rounded calendar-weekly__dates-switcher_block"
        >
          chevron_left
        </span>
        <span
          onClick={handleNextWeek}
          className="material-symbols-rounded calendar-weekly__dates-switcher_block"
        >
          chevron_right
        </span>
      </div>
      <div className="calendar-weekly__dates-list">
        {currentWeekDates.map((date, index) => (
          <div key={index} className="calendar-weekly__date-block">
            <div className="calendar-weekly__date-block__weekday">
              {weekDays()[index]}
            </div>
            <div
              className={`calendar-weekly__date-block__date
      ${getActiveDateClass(date, currentDate, selectedDate)}`}
              onClick={() => handleDateClick(date)}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="calendar-weekly__container">
      {currentWeekDates && renderCurrentWeekDates()}
      {renderTimeGrid()}
    </div>
  );
}

import "../../styles/calendar/calendar-weekly.css";
import React, { useEffect, useState } from "react";
import { useCalendarState } from "../customHooks/useCalendarState";
import { useTooltipState } from "../customHooks/useTooltipState";
import { calendarUtils } from "../../utils/calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import Tooltip from "../tooltips/Tooltip";
import svgPaths from "../svgPaths";
import { newTaskHandler } from "./newTaskHandler";
import TruncatedText from "../TruncatedText";
import DateSelection from "../DateSelection";
import TimeSelection from "../TimeSelection";


export default function CalendarWeekly() {
  // Get tooltip's state from custom hook
  const {
    openedTooltipId,
    isTooltipVisible,
    tooltipPositionClass,
    showTooltip,
    hideTooltip,
  } = useTooltipState();

  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: handleDataFromChild,
  });

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
  const { convertDateSql } = dateUtils();

  const [currentWeekDates, setCurrentWeekDates] = useState("");
  const [clickedCellIndex, setClickedCellIndex] = useState(null);
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);
  const [clickedPeriodStart, setClickedPeriodStart] = useState(null);
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState(null);

  const [selectedDatesByCell, setSelectedDatesByCell] = useState({});

  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(currentDate);

  function handleDataFromChild(data) {
    if (data) {
      hideTooltip();
      setClickedCellIndex(null);
    }
  }
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

  useEffect(() => {
    console.log(task);
  }, [task]);

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const initiateNewTask = (timeStart, timeEnd, clickedDate) => {
    const formattedTimeStart = convertDecimalToTime(timeStart);
    const formattedTimeEnd = convertDecimalToTime(timeEnd);
    const formattedDate = convertDateSql(clickedDate.toLocaleDateString());
    const newTask = {
      id: null,
      title: "",
      time_start: formattedTimeStart,
      time_end: formattedTimeEnd,
      date: formattedDate,
    };
    setTask({ ...task, ...newTask });
  };

  const handleDateHourClick = (
    date,
    hour,
    isFirstHalf,
    e,
    dateIndex,
    hourIndex
  ) => {
    const tooltipId = `${hourIndex}${dateIndex}`;
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
    const clickedCellIndex = `${hourIndex}${dateIndex}`;

    setClickedCellIndex(clickedCellIndex);
    setClickedHalf(clickedHalf);
    setSelectedDate(date);

    setClickedPeriod(convertTimePeriod(startTime, endTime));
    setClickedPeriodStart(hour);
    setClickedPeriodEnd(endHour);

    handleOnClick(e, tooltipId);
    initiateNewTask(hour, endHour, date);
  };

  useEffect(() => {
    const initialDatesByCells = {};
    const hoursOfDay = generateHoursOfDay();
    hoursOfDay.map((hour, hourIndex) => {
      currentWeekDates &&
        currentWeekDates.map((date, dateIndex) => {
          const dateWithHours = new Date(date);
          dateWithHours.setHours(hour);
          const cellId = `${hourIndex}${dateIndex}`;
          initialDatesByCells[cellId] = dateWithHours;
        });
    });
    setSelectedDatesByCell(initialDatesByCells);
  }, [currentWeekDates]);

  const handleDateSelection = (newSelectedDate) => {
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate.setHours(clickedPeriodStart);
    let cellId = null;
    for (const [key, value] of Object.entries(selectedDatesByCell)) {
      if (value.getTime() == formattedSelectedDate.getTime()) {
        cellId = key;
        break;
      }
    }
    setClickedCellIndex(cellId);
    setSelectedDate(formattedSelectedDate);
    setTask({ ...task, date: newSelectedDate });
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

    const calculateTaskHeight = (taskTimeStart, taskTimeEnd) => {
      const startTimestamp = new Date(`2000-01-01 ${taskTimeStart}`);
      const endTimestamp = new Date(`2000-01-01 ${taskTimeEnd}`);
      const taskDurationMinutes = (endTimestamp - startTimestamp) / 60000;
      const cellTimeAvailableMinutes = 60;
      const heightRatio = taskDurationMinutes / cellTimeAvailableMinutes;
      const cellHeight = 64.83;
      const taskHeight = cellHeight * heightRatio;
      return {
        height: `${taskHeight}px`,
      }
    };

    return (
      <div className="tasks-list">
        <ul>
          {dateTasks.slice(0, maxTasksToShow).map((task) => {
            // Calculate cell indexes for task period
            const toggledTaskActiveClass = toggleTaskActiveClass(task.id);
            const isTooltipVisible = () => openedTooltipId === task.id;


            const tooltipContent = () => (
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
            );

            const tooltipChildren = () => (
              <li
                className={`task-option ${toggledTaskActiveClass}`}
                onClick={(event) => handleOnClick(event, task.id)}
                style={calculateTaskHeight(task.time_start,task.time_end)}
              >
                {`${task.title} ${task.time_start}-${task.time_end}`}
              </li>
            );

            return (
              <Tooltip
                classes={`tooltip-task-description ${tooltipPositionClass} `}
                key={task.id}
                isTooltipVisible={isTooltipVisible()}
                tooltipPositionClass={tooltipPositionClass}
                tooltipId={openedTooltipId}
                content={tooltipContent()}
              >
                {tooltipChildren()}
              </Tooltip>
            );
          })}
        </ul>
      </div>
    );
  };

  const handleTimeSelection = (selectedTime, isStart) => {
    if (isStart) {
      setClickedPeriodStart(selectedTime);
      setTask({ ...task, time_start: selectedTime });
    } else {
      setClickedPeriodEnd(selectedTime);
      setTask({ ...task, time_end: selectedTime });
    }
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
                  const cellId = `${hourIndex}${dateIndex}`;

                  const cellClassNameSelected = getCellClassName(
                    hourIndex,
                    dateIndex
                  );
                  const cellHalfClassName = getCellHalfClassName();
                  const dayName = weekDays()[date.getDay()];

                  const dateSelection = (
                    <DateSelection
                      onSelectDate={(newSelectedDate, cellId) =>
                        handleDateSelection(newSelectedDate, cellId)
                      }
                      defaultDate={selectedDate}
                      cellId={cellId}
                    />
                  );

                  const timeSelection = (time, isStart) => (
                    <div className="time-selection-block">
                      {/*  */}

                      <TimeSelection
                        onSelectTime={(selectedTime) =>
                          handleTimeSelection(selectedTime, isStart)
                        }
                        defaultTime={time}
                      />
                    </div>
                  );

                  // Tooltip content
                  const tooltipContent = (
                    <div>
                      {/* render header of tooltip */}
                      {tooltipContentHeader()}
                      <form onSubmit={handleTaskCreation}>
                        <div className="tooltip-task-title">
                          <h2>Create a new event </h2>
                          <input
                            type="text"
                            placeholder="Add title"
                            onChange={(event) =>
                              setTask({ ...task, title: event.target.value })
                            }
                          />
                          <div className="tooltip-task-time">
                            {dateSelection}

                            <div className="tooltip-task-time_time-selection-container">
                              {timeSelection(clickedPeriodStart, true)}-
                              {timeSelection(clickedPeriodEnd, false)}
                            </div>
                            <div className="tooltip-task-description-container">
                            </div>
                          </div>
                          <div className="tooltip-task__time-period">
                            <span className="tooltip-task-time__day">
                              {dayName}
                            </span>
                            <span>
                              {clickedPeriodStart}-{clickedPeriodEnd}
                            </span>
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
                          <button className="btn btn-block" type="submit">
                            Create
                          </button>
                        </div>
                      </form>
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
                          <h4>
                            {task.title ? (
                              <TruncatedText
                                text={task.title}
                                maxCharacters={10}
                              />
                            ) : (
                              "(Untitled)"
                            )}
                          </h4>
                          <p className="clicked-new-task-tooltip__text">
                            {cellClassNameSelected === "clicked-cell" &&
                              clickedPeriod}
                          </p>
                        </div>
                      )}
                    </div>
                  );

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
                  );

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

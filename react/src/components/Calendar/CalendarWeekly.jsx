import "../../styles/calendar/calendar-weekly.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCalendarState } from "../customHooks/useCalendarState";
import { useTooltipState } from "../customHooks/useTooltipState";
import { calendarUtils } from "../../utils/calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import svgPaths from "../svgPaths";
import  newTaskHandler from "./newTaskHandler";
import Tooltip from "../tooltips/Tooltip";
import TruncatedText from "../TruncatedText";
import DateSelection from "../DateSelection";
import TimeSelection from "../TimeSelection";

/**
 * CalendarWeekly component for displaying a weekly calendar view.
 * @component
 */
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
    convertTime,
    convertDecimalToTime,
  } = calendarUtils();

  const { convertDateSql } = dateUtils();
  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: handleDataFromChild,
  });

  const [currentWeekDates, setCurrentWeekDates] = useState("");
  const [clickedCellIndex, setClickedCellIndex] = useState(null);
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);
  const [clickedPeriodStart, setClickedPeriodStart] = useState(null);
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState(null);
  const [selectedDatesByCell, setSelectedDatesByCell] = useState({});
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(currentDate);

  // Event handlers

  /**
   * Handles data received from a child component (newTaskHandler)
   * @param {Object} data - Data received from the child component
   * @returns {any}
   */
  function handleDataFromChild(data) {
    if (data) {
      hideTooltip();
      setClickedCellIndex(null);
      toast.success(`The task '${data.title}' was successfully created`);
    }
  }

  /**
   * Handles the action to move to the previous week
   */
  const handlePreviousWeek = () => {
    const previousWeekStartDate = new Date(currentWeekStartDate);
    previousWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(previousWeekStartDate);
  };

  /**
   * Handles the action to move to the next week
   */
  const handleNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStartDate);
  };

  /**
   * Handles the click on a specific date.
   * @param {Date} date - The clicked date.
   */
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  /**
   * Handles the click on a specific date-hour cell.
   * @param {Date} date - The clicked date.
   * @param {number} hour - The clicked hour.
   * @param {boolean} isFirstHalf - Whether the clicked cell is in the first half-hour slot.
   * @param {Object} e - The event object.
   * @param {number} dateIndex - The index of the date in the current week's dates.
   * @param {number} hourIndex - The index of the hour within a day.
   * @returns {any}
   */
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
    setClickedPeriodStart(convertTime(startTime));
    setClickedPeriodEnd(convertTime(endTime));

    handleOnClick(e, tooltipId);
    initiateNewTask(hour, endHour, date);
  };

  /**
   * Handles date selection and sets states
   * @param {Date} newSelectedDate - The selected date
   */
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

  /**
   * Handle click on a task or a date to show the tooltip
   * @param {Object} event - The event object
   * @param {number} id - The id of the tooltip
   */
  const handleOnClick = (event, id) => {
    // Close opened tooltip
    if (openedTooltipId !== null) {
      hideTooltip();
    }
    event.stopPropagation();
    showTooltip(id);
  };

  /**
   * Hadles time selection and sets state
   * @param {Date} selectedTime - The selected time
   * @param {boolean} isStart - Whether is start of the time period or the end
   */
  const handleTimeSelection = (selectedTime, isStart) => {
    if (isStart) {
      setClickedPeriodStart(selectedTime);
      setTask({ ...task, time_start: selectedTime });
    } else {
      setClickedPeriodEnd(selectedTime);
      setTask({ ...task, time_end: selectedTime });
    }
  };

  /**
   * A React effect hook that updates the current week's dates based on the selected week's start date and the available dates.
   * It triggers whenever the available dates or the current week's start date changes.
   * @effect
   * @param {Date[]} dates - An array of available dates.
   * @param {Date} currentWeekStartDate - The start date of the currently displayed week.
   */
  useEffect(() => {
    if (dates.length != 0) {
      const currentWeekDates = getCurrentWeekDates(dates, currentWeekStartDate);
      setCurrentWeekDates(currentWeekDates);
    }
  }, [dates, currentWeekStartDate]);

  /**
   * A React effect hook that generates the current week's dates by cell ids based on the selected week dates.
   * It triggers whenever the available dates or the current week's start date changes.
   * @effect
   * @param {Date[]} dates - An array of available dates.
   * @param {Date} currentWeekStartDate - The start date of the currently displayed week.
   */
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

  /**
   * Initiates a default new task state based on selected time and date and sets state.
   * @param {Date} timeStart - represents starting time.
   * @param {Date} timeEnd - represents ending time.
   * @param {Date} clickedDate - represents the clicked date.
   */
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

  /**
   * Determines whether a cell has been clicked or not based on the hour and date indices.
   * @param {number} hourIndex - The hour index representing the hour of the clicked date in 'H' format.
   * @param {number} dateIndex - The date index representing the day of the clicked date in 'd' format.
   * @returns {string} - A string indicating whether the cell is clicked ("clicked-cell") or not ("").
   */
  const getCellClassName = (hourIndex, dateIndex) => {
    const cellIndex = `${hourIndex}${dateIndex}`;
    return clickedCellIndex === cellIndex ? "clicked-cell" : "";
  };

  /**
   * Determines whether a cell has been clicked on the first half of the cell or not based on the clickedHalf state variable.
   * @returns {string} - A string indicating whether the cell is clicked on the first half ("first-half") or second half ("second-half") or neither ("").
   */
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

  /**
   * Determines the class name for an active task based on the tooltip's state and the provided task ID.
   * @param {string} taskId - The ID of the task being evaluated.
   * @returns {string} - The class name "task-active" if the task is active; otherwise, an empty string.
   */
  const toggleTaskActiveClass = (taskId) => {
    const isActive = openedTooltipId === taskId && isTooltipVisible;
    return isActive ? "task-active" : "";
  };

  /**
   * Renders the header content for the tooltip.
   * @returns {JSX.Element} - JSX element containing icons for editing, deleting, and closing the tooltip.
   */
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

  /**
   * Calculates the height of a task in pixels based on its start and end times.
   * @param {string} taskTimeStart - The start time of the task.
   * @param {string} taskTimeEnd - The end time of the task.
   * @returns {Object} CSS style object with the calculated height.
   */
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
    };
  };

  /**
   * Filters allTasks array to extract specific tasks based on date and hour.
   * @param {string} convertedDate - The convertedDate in format 'yyyy-mm-dd'
   * @param {string} convertedHourIndex - The convertedHourIndex in format 'h'.
   * @returns {Array} - An array of task objects that correspond to the filter criteria.
   */
  const filterTasksForDateAndHour = (convertedDate, convertedHourIndex) => {
    return allTasks.filter((task) => {
      const slicedTaskTime = task.time_start.split(":")[0];
      return (
        task.date === convertedDate && slicedTaskTime === convertedHourIndex
      );
    });
  };

  /**
   * Renders the content for the tooltip of the selected task.
   * @param {Object} task - The task object for which the tooltip content is being rendered.
   * @returns {JSX.Element} - JSX element containing the selected task data.
   */
  const renderTooltipContent = (task) => (
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
          <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
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

  /**
   * Renders tasks associated with a specific date and hour.
   * @param {Date} date - The date for which tasks should be rendered.
   * @param {number} hourIndex - Index of the hour within the day.
   * @returns {JSX.Element[]} Array of JSX elements representing tasks.
   */
  const renderDateTasks = (date, hourIndex) => {
    const convertedHourIndex = hourIndex.toString().padStart(2, "0");
    const convertedDate = dateUtils().convertDateSql(date.toLocaleDateString());
    const filteredTasks = filterTasksForDateAndHour(
      convertedDate,
      convertedHourIndex
    );
    const maxTasksToShow = Math.min(filteredTasks.length, 4);

    return (
      <div className="tasks-list">
        <ul>
          {filteredTasks.slice(0, maxTasksToShow).map((task) => {
            const toggledTaskActiveClass = toggleTaskActiveClass(task.id);
            const isTooltipVisible = () => openedTooltipId === task.id;
            return (
              <Tooltip
                classes={`tooltip-task-description ${tooltipPositionClass} `}
                key={task.id}
                isTooltipVisible={isTooltipVisible()}
                tooltipPositionClass={tooltipPositionClass}
                tooltipId={openedTooltipId}
                content={renderTooltipContent(task)}
              >
                <li
                  className={`task-option ${toggledTaskActiveClass}`}
                  onClick={(event) => handleOnClick(event, task.id)}
                  style={calculateTaskHeight(task.time_start, task.time_end)}
                >
                  {`${task.title} ${task.time_start}-${task.time_end}`}
                </li>
              </Tooltip>
            );
          })}
        </ul>
      </div>
    );
  };

  /**
   * Renders the cell content for a particular date and hour.
   *
   * @param {Date} date - The date for which tasks should be rendered.
   * @param {Date} hour - The hour for which tasks should be rendered.
   * @param {number} hourIndex - Index of the hour within the day.
   * @param {number} dateIndex - Index of the date within the day.
   * @returns {JSX.Element}  JSX element representing the cell content.
   */
  const renderCellContent = (date, hour, dateIndex, hourIndex) => {
    const cellClassNameSelected = getCellClassName(hourIndex, dateIndex);
    const cellHalfClassName = getCellHalfClassName();

    const handleCellClick = (e) =>
      handleDateHourClick(
        date,
        hour,
        e.nativeEvent.offSetY < 30,
        e,
        dateIndex,
        hourIndex
      );

    return (
      <div
        key={dateIndex}
        className={`calendar-weekly__time-cell ${cellClassNameSelected} ${cellHalfClassName}`}
        onClick={handleCellClick}
      >
        {renderDateTasks(date, hourIndex)}

        {/* Click on cell content */}
        {cellClassNameSelected === "clicked-cell" && (
          <div className="clicked-new-task-tooltip">
            <h4>
              {task.title ? (
                <TruncatedText text={task.title} maxCharacters={10} />
              ) : (
                "(Untitled)"
              )}
            </h4>
            <p className="clicked-new-task-tooltip__text">
              {cellClassNameSelected === "clicked-cell" && clickedPeriod}
            </p>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders DateSelection component with specified props.
   * @param {string} cellId - The unique id of the cell.
   * @returns {JSX.Element} JSX element representing the DateSelection component.
   */
  const renderDateSelection = (cellId) => (
    <DateSelection
      onSelectDate={(newSelectedDate, cellId) =>
        handleDateSelection(newSelectedDate, cellId)
      }
      defaultDate={selectedDate}
      cellId={cellId}
    />
  );

  /**
   * Renders TimeSelection component with specified props.
   * @param {string} time - The time string of the selected cell in format 'HH:MM'.
   * @param {boolean} isStart - A flag indicating if the time selection is for the start time.
   * @returns {JSX.Element} JSX element representing the TimeSelection component.
   */
  const renderTimeSelection = (time, isStart) => (
    <div className="time-selection-block">
      <TimeSelection
        onSelectTime={(selectedTime) =>
          handleTimeSelection(selectedTime, isStart)
        }
        defaultTime={time}
      />
    </div>
  );

  /**
   * Renders the tooltip content for creating a new task with specified parameters.
   * @param {string} dayName - The name of the day.
   * @param {string} cellId - The unique ID of the cell.
   * @param {JSX.Element} tooltipContentHeader - The JSX element representing the header of the tooltip with icons and layout.
   * @returns {JSX.Element} - The JSX element representing the tooltip content for creating a new task.
   */
  const renderTooltipContentNewTask = (
    dayName,
    cellId,
    tooltipContentHeader
  ) => (
    <div>
      {/* render header of tooltip */}
      {tooltipContentHeader}
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
            {renderDateSelection(cellId)}

            <div className="tooltip-task-time_time-selection-container">
              {renderTimeSelection(clickedPeriodStart, true)}-
              {renderTimeSelection(clickedPeriodEnd, false)}
            </div>
            <div className="tooltip-task-description-container"></div>
          </div>
          <div className="tooltip-task__time-period">
            <span className="tooltip-task-time__day">{dayName}</span>
            <span>
              {clickedPeriodStart}-{clickedPeriodEnd}
            </span>
          </div>
        </div>
        <div className="tooltip-task-additional">
          {/* TODO: create notifications */}
          <div className="tooltip-task-notification">
            <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
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

  /**
   * Renders a wrapper around the Tooltip component with the provided content.
   *
   * @param {string} cellId - The unique ID of the cell.
   * @param {JSX.Element} tooltipContent - The JSX element representing the content of the tooltip.
   * @param {JSX.Element} cellContent - The JSX element representing the content of the cell.
   * @returns {JSX.Element} JSX element representing the wrapped Tooltip component with content.
   */
  const renderTooltipWrapper = (cellId, tooltipContent, cellContent) => (
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

  /**
   * Renders the time grid containing cells for each hour and date within the week.
   *
   * @returns {JSX.Element} JSX element representing the time grid.
   */
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
                  const dayName = weekDays()[date.getDay()];
                  const cellContent = renderCellContent(
                    date,
                    hour,
                    dateIndex,
                    hourIndex
                  );
                  const tooltipContent = renderTooltipContentNewTask(
                    dayName,
                    cellId,
                    tooltipContentHeader()
                  );

                  return renderTooltipWrapper(
                    cellId,
                    tooltipContent,
                    cellContent
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders the list of dates for the current week along with their corresponding weekday labels.
   *
   * @returns {JSX.Element} JSX element representing the list of dates for the current week.
   */
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

import React, { useEffect }  from "react";
import Tooltip from "../tooltips/Tooltip";
import { useCalendarApiContext } from "./CalendarApiContext";
import { calendarUtils } from "./calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import { useTooltipState } from "../tooltips/useTooltipState";

export default function CalendarMonthly({ dates, currentDate, selectedDate }) {
  // Fetch data using custom context API
  const { allTasks, getAllTasks } = useCalendarApiContext();
  
  // Fetch tasks when component mounts
  useEffect(() => {
    getAllTasks();
  }, []);

  // Get tooltip's state from custom hook
  const {
    openedTooltipId,
    isTooltipVisible,
    tooltipPositionClass,
    showTooltip,
    hideTooltip,
  } = useTooltipState();

  // Handle click on a task or a date to show the tooltip
  const handleOnClick = (event, id) => {
    // Close opened tooltip
    if (openedTooltipId !== null) {
      hideTooltip();
    }
    event.stopPropagation();
    showTooltip(id);
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
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
      </svg>
    </div>
  );

  // Render the tasks for a specific date
  const renderDateTasks = (date) => {
    const dateTasks = allTasks.filter(
      (task) =>
        task.date === dateUtils().convertDateSql(date.toLocaleDateString())
    );

    const maxTasksToShow = Math.min(dateTasks.length, 4);

    return (
      <div className="tasks-list">
        <ul>
          {dateTasks.slice(0, maxTasksToShow).map((task) => (
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
              >
                {`${task.title} ${task.time_start} ${task.time_end}`}
              </li>
            </Tooltip>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="calendar-by-month-wrapper">
      <ol className="calendar-by-month-days">
        <li className="day-name">Mon</li>
        <li className="day-name">Tue</li>
        <li className="day-name">Wed</li>
        <li className="day-name">Thu</li>
        <li className="day-name">Fri</li>
        <li className="day-name">Sat</li>
        <li className="day-name">Sun</li>
      </ol>

      <ol className="calendar-by-month-dates">
        {dates.map((date, index) => (
          <Tooltip
              isTooltipVisible={openedTooltipId === date.toLocaleDateString()}
              tooltipPositionClass={tooltipPositionClass}
            classes={`tooltip-task-description ${tooltipPositionClass} `}
            key={date.toLocaleDateString()}
            content={
              <div>
                {/* render header of tooltip */}
                {tooltipContentHeader()}
                <div className="tooltip-task-title">
                  <h2>Create a new event </h2>
                  <p>a new event</p>
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
                  </div>
                </div>
              </div>
            }
          >

            {/* Children */}
            <li
              className={`${calendarUtils().getActiveDateClass(
                date.toLocaleDateString(),
                currentDate,
                selectedDate
              )} date`}
              onClick={(event) =>
                handleOnClick(event, date.toLocaleDateString())
              }
              key={index}
            >
              {date.getDate()}
              {renderDateTasks(date)}
            </li>
          </Tooltip>
        ))}
      </ol>
    </div>
  );
}

import "../../styles/calendar/calendar-monthly.css";
import React, { useState } from "react";
import Modal from "../modals/Modal";
import { calendarUtils } from "../../utils/calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import { useCalendarState } from "../customHooks/useCalendarState";
import { useModalState } from "../customHooks/useModalState";
import newTaskHandler from "./newTaskHandler";
import { toast } from "react-toastify";
import TaskForm from "../Task/TaskForm";

/**
 * CalendarMonthly Component
 *
 * This component represents a monthly calendar view with tasks and modals.
 * It fetches tasks using a custom context API and renders them in a monthly layout.
 * It uses the Modal component to display task details when clicked on a task or date.
 *
 * @param {object} props - The component props.
 * @param {Date[]} props.dates - An array of Date objects representing each day in the month.
 * @param {Date} props.currentDate - The current date.
 * @param {Date} props.selectedDate - The selected date.
 * @returns {JSX.Element} - The JSX element representing the CalendarMonthly component.
 */

export default function CalendarMonthly() {
  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: handleDataFromChild,
  });
  const { dates, currentDate, allTasks, selectedDate, setSelectedDate } =
    useCalendarState();

  const { convertDecimalToTime } = calendarUtils();
  const { convertDateSql } = dateUtils();

  // Get modal's state from custom hook
  const {
    openedModalId,
    isModalVisible,
    modalPositionClass,
    showModal,
    hideModal,
  } = useModalState();

  const [clickedPeriodStart, setClickedPeriodStart] = useState("07:00");
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState("08:00");

  /**
   * Handles data received from a child component (newTaskHandler)
   * @param {Object} data - Data received from the child component
   * @returns {any}
   */
  function handleDataFromChild(data) {
    if (data) {
      hideModal();
      toast.success(`The task '${data.title}' was successfully created`);
    }
  }
  const onTooltipClose = () => {
    hideModal();
  }

  /**
   * Initiates a default new task state based on selected time and date and sets state.
   * @param {Date} timeStart - represents starting time.
   * @param {Date} timeEnd - represents ending time.
   * @param {Date} clickedDate - represents the clicked date.
   */
  const initiateNewTask = (timeStart, timeEnd, clickedDate) => {
    // const formattedTimeStart = convertDecimalToTime(timeStart);
    // const formattedTimeEnd = convertDecimalToTime(timeEnd);
    const formattedDate = convertDateSql(clickedDate.toLocaleDateString());
    const newTask = {
      id: null,
      title: "",
      time_start: timeStart,
      time_end: timeEnd,
      date: formattedDate,
    };
    setTask({ ...task, ...newTask });
  };

  const handleOnDateClick = ({ event, modalId, selectedDate }) => {

    setSelectedDate(selectedDate);
    initiateNewTask(clickedPeriodStart, clickedPeriodEnd, selectedDate);
    handleOnClick({
      event: event,
      modalId: modalId,
      selectedDate: selectedDate,
    });
  };

  // Handle click on a task or a date to show the modal
  const handleOnClick = ({ event, modalId }) => {
    // Close opened modal
    if (openedModalId !== null) {
      hideModal();
    }
    event.stopPropagation();
    showModal(modalId);
  };
  // Get the class name for an active task
  const toggleTaskActiveClass = (taskId) => {
    return (
      openedModalId &&
      openedModalId === taskId &&
      isModalVisible &&
      "task-active"
    );
  };

  /**
   * Handles date selection and sets states
   * @param {Date} newSelectedDate - The selected date
   */
  const handleDateSelection = (newSelectedDate) => {
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate.setHours(clickedPeriodStart);
    setSelectedDate(formattedSelectedDate);
    setTask({ ...task, date: newSelectedDate });
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

  // Render the header of the modal content
  const modalContentHeader = () => (
    <div className="modal-tools">
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
        onClick={() => hideModal()}
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
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
            <Modal
              classes={`modal-task-description ${modalPositionClass} `}
              key={task.id}
              isModalVisible={openedModalId === task.id}
              modalPositionClass={modalPositionClass}
              modalId={openedModalId}
              content={
                <div>
                  {modalContentHeader()}
                  <div className="modal-task-title">
                    <h2>{task.title}</h2>
                    <p>
                      {task.date} ⋅ {task.time_start}-{task.time_end}
                    </p>
                  </div>
                  <div className="modal-task-additional">
                    {/* TODO: create notifications */}
                    <div className="modal-task-notification">
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
                    <div className="modal-task-owner">
                      <i className="fa fa-calendar"></i>
                      {task.user.name}
                    </div>
                  </div>
                </div>
              }
            >
              <li
                className={`task-option ${toggleTaskActiveClass(task.id)} `}
                onClick={(event) => handleOnClick({event:event, modalId:task.id})}
              >
                {`${task.title} ${task.time_start}-${task.time_end}`}
              </li>
            </Modal>
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
        {dates.map((date, index) => {
          const id = date.toLocaleDateString();
          const dayName = calendarUtils().getDayName(date.getDay());

          return (
            <Modal
              isModalVisible={openedModalId === id}
              modalPositionClass={modalPositionClass}
              classes={`modal-task-description ${modalPositionClass} `}
              key={id}
              content={
                <div>
                  <TaskForm 
                    formId={id}
                    openedModalId={openedModalId}
                    selectedDate={date}
                    onDateSelection={handleDateSelection}
                    onTimeSelection={handleTimeSelection}
                    handleTaskCreation={handleTaskCreation}
                    clickedPeriodStart={clickedPeriodStart}
                    clickedPeriodEnd={clickedPeriodEnd}
                    onTooltipClose={onTooltipClose}
                  
                  />
                </div>
              }
            >
              {/* Children */}
              <li
                className={`${calendarUtils().getActiveDateClass(
                  id,
                  currentDate,
                  selectedDate
                )} date`}
                onClick={(event) =>
                  handleOnDateClick({
                    event: event,
                    modalId: id,
                    selectedDate: date,
                  })
                }
                key={index}
              >
                {date.getDate()}
                {renderDateTasks(date)}
              </li>
            </Modal>
          );
        })}
      </ol>
    </div>
  );
}

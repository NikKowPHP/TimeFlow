import "../../../styles/calendar/calendar-monthly.css";
import React, { useState } from "react";
import Modal from "../../modals/Modal";
import { calendarUtils } from "../../../utils/calendarUtils";
import { dateUtils } from "../../../utils/dateUtils";
import { useCalendarState } from "../../customHooks/useCalendarState";
import { useModalState } from "../../customHooks/useModalState";
import newTaskHandler from "../newTaskHandler";
import { toast } from "react-toastify";
import TaskForm from "../../Task/TaskForm";
import ExistingTask from "../../Task/ExistingTask";
import { taskUtils } from "../../../utils/taskUtils";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: handleDataFromChild,
  });
  const {
    dates,
    currentDate,
    allTasks,
    selectedDate,
    setSelectedDate,
    getTasksByDate,
    refreshTasks,
  } = useCalendarState();

  const { convertDateSql } = dateUtils();
  const { onTaskDelete } = taskUtils({
    onStateReceived: handleTaskState,
  });


  // Get modal's state from custom hook
  const {
    openedModalId,
    isModalVisible,
    modalPositionClass,
    showModal,
    hideModal,
  } = useModalState();

  // State for clicked time period
  const [clickedPeriodStart, setClickedPeriodStart] = useState("07:00");
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState("08:00");

  /**
   * Handles data received from a child component (newTaskHandler)
   * @param {Object} data - Data received from the child component
   */
  function handleDataFromChild(data) {
    if (data) {
      hideModal();
      toast.success(`The task '${data.title}' was successfully created`);
    }
  }

  // Function handles closing the current modal
  const onModalClose = () => {
    hideModal();
  };

  // Handles the task state from task utils file.
  function handleTaskState(state) {
    // Handle task deletion.
    if (state.status === 204) {
      hideModal();
      refreshTasks();
      toast.success(`The task '${state.task.title}' was successfully deleted`);
    }
  }

  function onTaskEdit(task) {
    navigate(`/tasks/${task.id}`, {state: {previousLocation: location.pathname}});
    
  }
  /**
   * Initiates a default new task state based on selected time and date and sets state.
   * @param {Date} timeStart - represents starting time.
   * @param {Date} timeEnd - represents ending time.
   * @param {Date} clickedDate - represents the clicked date.
   */
  const initiateNewTask = (timeStart, timeEnd, clickedDate) => {
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

  /**
   * Handles click on a date to initiate new task and show modal
   * @param {Object} options - Click event details
   * @param {Event} options.event - Click event
   * @param {string} options.modalId - ID of the modal
   * @param {Date} options.selectedDate - Selected date
   * @returns {void}
   */
  const handleOnDateClick = ({ event, modalId, selectedDate }) => {
    setSelectedDate(selectedDate);
    initiateNewTask(clickedPeriodStart, clickedPeriodEnd, selectedDate);
    handleOnClick({
      event: event,
      modalId: modalId,
      selectedDate: selectedDate,
    });
  };

  /**
   * Handles click on a task or date to show the modal
   * @param {Object} options - Click event details
   * @param {Event} options.event - Click event
   * @param {string} options.modalId - ID of the modal
   * @returns {void}
   */
  const handleOnClick = ({ event, modalId }) => {
    // Close opened modal
    if (openedModalId !== null) {
      hideModal();
    }
    event.stopPropagation();
    showModal(modalId);
  };
  /**
   * Toggles active class for tasks in modal
   * @param {integer} taskId - ID of the task
   * @returns {any}
   */
  const toggleTaskActiveClass = (taskId) => {
    return (
      openedModalId &&
      openedModalId === taskId &&
      isModalVisible &&
      "task-active"
    );
  };

  /**
   * Sets new task title in state
   * @param {Event} event - Input change event
   * @returns {void}
   */
  const setNewTaskTitle = (event) => {
    setTask({ ...task, title: event.target.value });
  };

  /**
   * Handles date selection and sets states
   * @param {Date} newSelectedDate - The selected date
   * @returns {void}
   */
  const handleDateSelection = (newSelectedDate) => {
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate.setHours(clickedPeriodStart);
    setSelectedDate(formattedSelectedDate);
    setTask({ ...task, date: newSelectedDate });
  };

  /**
   * Handles time selection and sets state
   * @param {Date} selectedTime - The selected time
   * @param {boolean} isStart - Whether is start of the time period or the end
   * @returns {void}
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
   * Render the list of tasks for a specific date.
   * @param {Date} date - specific date to render tasks.
   * @returns {JSX.Element} - JSX element representing the list of tasks.
   */
  const renderDateTasks = (date) => {
    const dateTasks = getTasksByDate(date);
    const maxTasksToShow = Math.min(dateTasks.length, 4);

    // Function to render each task as a modal content
    const modalChildren = (task) => (
      <li
        className={`task-option ${toggleTaskActiveClass(task.id)} `}
        onClick={(event) => handleOnClick({ event: event, modalId: task.id })}
      >
        {`${task.title} ${task.time_start}-${task.time_end}`}
      </li>
    );

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
                <ExistingTask
                  task={task}
                  onModalClose={onModalClose}
                  onDelete={onTaskDelete}
                  onTaskEdit={onTaskEdit}
                />
              }
            >
              {modalChildren(task)}
            </Modal>
          ))}
        </ul>
      </div>
    );
  };
  /**
   * Function to render list of weekdays.
   * @returns {JSX.Element} - JSX Element representing list of weekdays
   */
  const renderDays = () => (
    <ol className="calendar-by-month-days">
      {calendarUtils()
        .weekDays()
        .map((day, index) => (
          <li key={index} className="day-name">
            {day}
          </li>
        ))}
    </ol>
  );

  // Render the main component
  return (
    <div className="calendar-by-month-wrapper">
      {renderDays()}

      <ol className="calendar-by-month-dates">
        {dates.map((date, index) => {
          const id = date.toLocaleDateString();
          // Function to render children content for each date
          const renderChildren = () => (
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
          );

          // Render modal for each date
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
                    onModalClose={onModalClose}
                    onTaskSet={setNewTaskTitle}
                  />
                </div>
              }
            >
              {renderChildren()}
            </Modal>
          );
        })}
      </ol>
    </div>
  );
}

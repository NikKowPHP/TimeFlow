import "../../../styles/calendar/calendar-monthly.css";
import React, { useEffect, useState } from "react";
import Modal from "../../modals/Modal";
import { calendarUtils } from "../../../utils/calendarUtils";
import { dateUtils } from "../../../utils/dateUtils";
import { useCalendarState } from "../../customHooks/useCalendarState";
import { useModalState } from "../../customHooks/useModalState";
import newTaskHandler from "../newTaskHandler";
import { toast } from "react-toastify";
import NewTask from "../../Task/NewTask";
import ExistingTask from "../../Task/ExistingTask";
import { taskUtils } from "../../../utils/taskUtils";
import { useLocationState } from "../../customHooks/useLocationState";
import Loading from "../../Loading";
import TruncatedText from "../../TruncatedText";
import ElipsisTaskList from "../EllipsisTaskList";

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
  const { navigate } = useLocationState();

  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: handleDataFromChild,
  });
  const {
    dates,
    month,
    currentDate,
    selectedDate,
    setSelectedDate,
    refreshTasks,
    allTasks,
    loading,
    goToPrevMonth,
    goToNextMonth,
  } = useCalendarState();

  const { getMonthName, getActiveDateClass } = calendarUtils();
  const { convertDateSql } = dateUtils();
  const { onTaskDelete, getTasksByDate } = taskUtils({
    onStateReceived: handleTaskState,
  });

  // Get modal's state from custom hook
  const {
    openedModalId,
    isModalVisible,
    modalPositionClass,
    modalPositionHeightClass,
    showModal,
    hideModal,
  } = useModalState();

  // State for clicked time period
  const [clickedPeriodStart, setClickedPeriodStart] = useState("07:00");
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState("08:00");
  const modalClasses = `modal-task-description ${modalPositionClass} ${modalPositionHeightClass} `;
  const [clickedCellIndex, setClickedCellIndex] = useState(null);

  /**
   * Handles data received from a child component (newTaskHandler)
   * @param {Object} data - Data received from the child component
   */
  function handleDataFromChild(data) {
    if (data) {
      hideModal();
      setSelectedDate(null);
      setClickedCellIndex(null);
      toast.success(`The task '${data.title}' was successfully created`);
    }
  }
  useEffect(() => {
    openedModalId === null && resetDateState();
  }, [openedModalId])

  const resetDateState = () => {
    setSelectedDate(null);
    setClickedCellIndex(null);
  };

  // Function handles closing the current modal
  const onModalClose = () => {
    resetDateState();
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
  function handleModalState (state) {
    !state.isModalVisible && resetDateState();
  }

  function onTaskEdit(task) {
    navigate(`/tasks/${task.id}`, {
      state: { previousLocation: location.pathname },
    });
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
  const handleOnDateClick = ({ event, modalId, selectedDate, cellId }) => {
    setSelectedDate(selectedDate);
    handleOnClick({
      event: event,
      modalId: modalId,
      selectedDate: selectedDate,
    });
    setClickedCellIndex(cellId);
    initiateNewTask(clickedPeriodStart, clickedPeriodEnd, selectedDate);
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
      resetDateState();
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
  const renderDateTasks = (date, id) => {
    const dateTasks = getTasksByDate(date, allTasks);
    const maxTasksToShow = Math.min(dateTasks.length, 3);
    const tasksRest = dateTasks.length - maxTasksToShow;
    const showEllipsis = dateTasks.length > 3;
    const ellipsisId = date.toLocaleDateString() + `${dateTasks.length}`;

    console.log(clickedCellIndex === id);

    //TODO: pull  the function out of the function
    // Function to render each task as a modal content
    const modalChildren = (task) => (
      <li
        className={`calendar-monthly__date-task-list__item task-option  ${toggleTaskActiveClass(
          task.id
        )} `}
        onClick={(event) => handleOnClick({ event: event, modalId: task.id })}
      >
        <TruncatedText text={task.title} maxCharacters={6} />
        {` ${task.time_start}-${task.time_end}`}
      </li>
    );

    const renderEllipsis = () => {
      return (
        <h5
          onClick={(event) =>
            handleOnClick({ event: event, modalId: ellipsisId })
          }
          className="date-tasks__ellipsis"
        >
          {tasksRest} more
        </h5>
      );
    };

    const renderNewTaskBox = () => (
      <li className="calendar-monthly__clicked-new-task-modal">
        {task.title ? (
          <TruncatedText text={task.title} maxCharacters={10} />
        ) : (
          "(Untitled)"
        )}
      </li>
    );
    return (
      <div className="calendar-monthly__date-task-list">
        <ul className="calendar-monthly__date-task-list__list">
          {dateTasks.slice(0, maxTasksToShow).map((task) => (
            <Modal
              classes={modalClasses}
              key={task.id}
              isModalVisible={openedModalId === task.id}
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

          <Modal
            classes={modalClasses}
            key={task.id}
            isModalVisible={openedModalId === ellipsisId}
            modalId={openedModalId}
            content={
              <ElipsisTaskList
                openedModalId={openedModalId}
                onModalClose={onModalClose}
                onTaskDelete={onTaskDelete}
                onTaskEdit={onTaskEdit}
                taskList={dateTasks}
                handleOnTaskClick={handleOnClick}
              />
            }
          >
            {clickedCellIndex === id && renderNewTaskBox()}
            {showEllipsis && renderEllipsis()}
          </Modal>
        </ul>
      </div>
    );
  };
  /**
   * Function to render list of weekdays.
   * @returns {JSX.Element} - JSX Element representing list of weekdays
   */
  const renderDays = () => (
    <ol className="calendar-monthly-days">
      {calendarUtils()
        .weekDays()
        .map((day, index) => (
          <li key={index} className="day-name">
            {day}
          </li>
        ))}
    </ol>
  );
  const renderDateChildren = (id, date) => (
    <li
      className={`${getActiveDateClass(date, currentDate, selectedDate)} date`}
      onClick={(event) =>
        handleOnDateClick({
          event: event,
          modalId: id,
          selectedDate: date,
          cellId: id,
        })
      }
      key={id}
    >
      {date.getDate()}
      {renderDateTasks(date, id)}
    </li>
  );

  // Render the main component
  return loading ? (
    <Loading />
  ) : (
    <div className="calendar-monthly">
      <div className="dates-switcher-container">
        <span
          onClick={goToPrevMonth}
          className="material-symbols-rounded dates-switcher__block"
        >
          chevron_left
        </span>
        <span className="dates-switcher__month-name">
          {getMonthName(month)}
        </span>
        <span
          onClick={goToNextMonth}
          className="material-symbols-rounded  dates-switcher__block"
        >
          chevron_right
        </span>
      </div>
      <div className="calendar-monthly-wrapper">
        {renderDays()}

        <ol className="calendar-dates calendar-monthly-dates">
          {dates.map((date, index) => {
            const id = date.toLocaleDateString();

            // Render modal for each date
            return (
              <Modal
                isModalVisible={openedModalId === id}
                classes={modalClasses}
                key={id}
                content={
                  <div>
                    <NewTask
                      formId={id}
                      openedModalId={openedModalId}
                      selectedDate={date}
                      onDateSelection={handleDateSelection}
                      onTimeSelection={handleTimeSelection}
                      handleTaskCreation={handleTaskCreation}
                      clickedPeriodStart={clickedPeriodStart}
                      clickedPeriodEnd={clickedPeriodEnd}
                      onModalClose={onModalClose}
                      onTitleSet={setNewTaskTitle}
                    />
                  </div>
                }
              >
                {renderDateChildren(id, date)}
              </Modal>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

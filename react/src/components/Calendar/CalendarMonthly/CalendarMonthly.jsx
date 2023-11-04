import "../../../styles/calendar/calendar-monthly.css";
import React, { useEffect, useRef, useState } from "react";
import Modal from "../../modals/Modal";
import { calendarUtils } from "../../../utils/calendarUtils";
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
import { connect, useDispatch } from "react-redux";
// import {
//   selectDate,
//   clickCell,
//   setYear,
//   setMonth,
// } from "../../../redux/actions/calendarActions";
import { updateTasks } from "../../../redux/actions/taskActions";

function CalendarMonthly({
  dates,
  year,
  setYear,
  setMonth,
  month,
  allTasks,
  currentDate,
  clickedCellIndex,
  selectDate,
  selectedDate,
  clickCell,
  loading,
}) {
  console.log(year);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  console.log("selectedDate ", selectedDate, "clicked", clickedCellIndex);

  const {
    getMonthName,
    getDateActiveClass,
    toggleTaskActiveClass,
    goToNextMonth,
    goToPrevMonth,
  } = calendarUtils();
  const { onTaskDelete, getTasksByDate } = taskUtils({
    onStateReceived: handleTaskState,
  });

  // Get modal's state from custom hook
  const {
    openedModalId,
    isModalVisible,
    modalPosition,
    hideModal,
    displaySuccessTaskCreation,
    onModalClose,
    handleOnTriggerClick,
  } = useModalState({
    modalRef: modalRef,
    dispatch: dispatch,
    handleTaskUpdate: handleTaskUpdate,
  });

  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: displaySuccessTaskCreation,
    dispatch: dispatch,
    updateTasks: updateTasks,
  });
  function handleTaskUpdate(updatedTask) {
    setTask(updatedTask);
  }

  const { navigate } = useLocationState();
  // State for clicked time period
  const [clickedPeriodStart, setClickedPeriodStart] = useState("07:00");
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState("08:00");

  // Handles the task state from task utils file.
  // TODO: move to task utils
  function handleTaskState(state) {
    // Handle task deletion.
    if (state.status === 204) {
      hideModal();
      refreshTasks();
      toast.success(`The task '${state.task.title}' was successfully deleted`);
    }
  }

  function onTaskEdit(task) {
    navigate(`/tasks/${task.id}`, {
      state: { previousLocation: location.pathname },
    });
  }

  /**
   * Handles click on a date to initiate new task and show modal
   * @param {Object} options - Click event details
   * @param {Event} options.event - Click event
   * @param {string} options.modalId - ID of the modal
   * @param {Date} options.selectedDate - Selected date
   * @returns {void}
   */
  const handleOnDateClick = ({ event, modalId, selectedDate, cellId }) => {
    // setSelectedDate(selectedDate);
    // handleOnClick({
    //   event: event,
    //   modalId: modalId,
    //   selectedDate: selectedDate,
    // });
    dispatch(clickCell(cellId));
    dispatch(selectDate(selectedDate.getTime()));
    const startTime = new Date();
    startTime.setHours(7);
    const endTime = new Date();
    endTime.setHours(8);
    handleOnTriggerClick({
      event: event,
      modalId: modalId,
      startTime: startTime,
      endTime: endTime,
      selectedDate: selectedDate,
      newTask: true,
      allTasks: allTasks,
    });
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
   * TODO: move handlers to a custom hook
   */
  // TODO: DISPATCH STATE TO REDUX STORE
  const handleDateSelection = (newSelectedDate) => {
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate.setHours(clickedPeriodStart);
    dispatch(selectDate(formattedSelectedDate));
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

  const renderTaskItem = (task) => (
    <li
      className={`calendar-monthly__date-task-list__item task-option  ${toggleTaskActiveClass(
        task.id,
        openedModalId,
        isModalVisible
      )} `}
      onClick={(event) =>
        handleOnTriggerClick({ event: event, modalId: task.id })
      }
    >
      <TruncatedText text={task.title} maxCharacters={6} />
      {` ${task.time_start}-${task.time_end}`}
    </li>
  );

  const renderEllipsis = (taskRestSum, ellipsisId) => {
    return (
      <h5
        onClick={(event) =>
          handleOnTriggerClick({ event: event, modalId: ellipsisId })
        }
        className="date-tasks__ellipsis"
      >
        {taskRestSum} more
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

  /** * Function to render list of weekdays.  * @returns {JSX.Element} - JSX Element representing list of weekdays
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
  const renderEllipsisModalTrigger = (
    date,
    dateTasks,
    maxTasksToShow,
    cellId
  ) => {
    const dateTasksLength = dateTasks.length;

    const taskRestSum = dateTasksLength - maxTasksToShow;

    const ellipsisId = date.toLocaleDateString() + `${dateTasksLength}`;

    return (
      <Modal
        classes={"modal-task-description"}
        modalRef={modalRef}
        modalPosition={modalPosition}
        isModalVisible={openedModalId === ellipsisId}
        modalId={ellipsisId}
        content={
          <ElipsisTaskList
            onModalClose={onModalClose}
            onTaskDelete={onTaskDelete}
            onTaskEdit={onTaskEdit}
            taskList={dateTasks}
          />
        }
      >
        {clickedCellIndex === cellId && renderNewTaskBox()}
        {dateTasksLength > 3 && renderEllipsis(taskRestSum, ellipsisId)}
      </Modal>
    );
  };

  /**
   * Render the list of tasks for a specific date.
   * @param {Date} date - specific date to render tasks.
   * @returns {JSX.Element} - JSX element representing the list of tasks.
   */
  const renderDateTasks = (date, cellId) => {
    const dateTasks = getTasksByDate(date, allTasks);
    const maxTasksToShow = Math.min(dateTasks.length, 3);

    return (
      <ul className="calendar-monthly__date-task-list__list">
        {dateTasks.slice(0, maxTasksToShow).map((task) => (
          // Renders a task with modal wrapper
          <Modal
            modalRef={modalRef}
            classes={"modal-task-description"}
            modalPosition={modalPosition}
            key={task.id}
            isModalVisible={openedModalId === task.id}
            modalId={task.id}
            content={
              <ExistingTask
                task={task}
                onModalClose={onModalClose}
                onDelete={onTaskDelete}
                onTaskEdit={onTaskEdit}
              />
            }
          >
            {renderTaskItem(task)}
          </Modal>
        ))}
        {renderEllipsisModalTrigger(date, dateTasks, maxTasksToShow, cellId)}
      </ul>
    );
  };

  const renderDateItem = (id, date) => (
    <li
      className={getDateActiveClass(date, currentDate, selectedDate)}
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

  const renderDatesGrid = () => (
    <ol className="calendar-dates calendar-monthly-dates">
      {dates.map((date) => {
        const id = date.toLocaleDateString();

        // Render modal for each date
        return (
          <Modal
            modalPosition={modalPosition}
            modalRef={modalRef}
            isModalVisible={openedModalId === id}
            classes={"modal-task-description"}
            key={id}
            content={
              <NewTask
                formId={id}
                openedModalId={openedModalId}
                selectedDate={date}
                onDateSelection={handleDateSelection}
                onTimeSelection={handleTimeSelection}
                handleTaskCreation={handleTaskCreation}
                clickedPeriodStart={"07:00"}
                clickedPeriodEnd={"08:00"}
                onModalClose={onModalClose}
                onTitleSet={setNewTaskTitle}
              />
            }
          >
            {renderDateItem(id, date)}
          </Modal>
        );
      })}
    </ol>
  );
  const handleNextMonthClick = () => {
    goToNextMonth(year, month, setYear, setMonth, dispatch);
  };
  const handlePrevMonthClick = () => {
    goToPrevMonth(year, month, setYear, setMonth, dispatch);
  };

  const renderMainComponent = () =>
    loading ? (
      <Loading />
    ) : (
      <div className="calendar-monthly">
        <div className="dates-switcher-container">
          <span
            onClick={handlePrevMonthClick}
            className="material-symbols-rounded dates-switcher__block"
          >
            chevron_left
          </span>
          <span className="dates-switcher__month-name">
            {getMonthName(month)}
          </span>
          <span
            onClick={handleNextMonthClick}
            className="material-symbols-rounded  dates-switcher__block"
          >
            chevron_right
          </span>
        </div>
        <div className="calendar-monthly-wrapper">
          {renderDays()}
          {renderDatesGrid()}
        </div>
      </div>
    );

  return renderMainComponent();
}

// const mapStateToProps = (state) => ({
//   selectedDate: state.calendar.selectedDate,
//   clickedCellIndex: state.calendar.clickedCellIndex,
// });
// const mapDispatchToProps = {
//   selectDate,
//   clickCell,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(CalendarMonthly);
export default CalendarMonthly;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/calendar/calendar-weekly.css";
import { useCalendarState } from "../customHooks/useCalendarState";
import { useModalState } from "../customHooks/useModalState";
import { calendarUtils } from "../../utils/calendarUtils";
import newTaskHandler from "./newTaskHandler";
import Modal from "../modals/Modal";
import TruncatedText from "../TruncatedText";
import { useLocationState } from "../customHooks/useLocationState";
import TaskList from "./TaskList";
import Loading from "../Loading";
import NewTask from "../Task/NewTask";
import { taskUtils } from "../../utils/taskUtils";
import { useDataHandlingLogic } from "../customHooks/useDataHandlingLogic";
import TaskItem from "./TaskItem";

/**
 * CalendarWeekly component for displaying a weekly calendar view.
 * @component
 */
export default function CalendarWeekly() {
  const {
    dates,
    currentDate,
    allTasks,
    selectedDate,
    setSelectedDate,
    refreshTasks,
    loading,
  } = useCalendarState();

  const { navigate } = useLocationState();
  const [currentWeekDates, setCurrentWeekDates] = useState("");
  const [clickedCellIndex, setClickedCellIndex] = useState(null);
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);
  const [clickedPeriodStart, setClickedPeriodStart] = useState(null);
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState(null);
  const [selectedDatesByCell, setSelectedDatesByCell] = useState({});
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(currentDate);
  const modalRef = useRef(null);

  // Get modal's state from custom hook
  const { openedModalId, isModalVisible, modalPosition, showModal, hideModal } =
    useModalState({ modalRef });

  // Destructure functions from calendarUtils
  const {
    getCurrentWeekDates,
    generateHoursOfDay,
    convertHour,
    weekDays,
    getActiveDateClass,
    convertTimePeriod,
    convertTime,
    getCellHalfClassName,
    initiateNewTask,
    toggleTaskActiveClass,
    calculateTaskHeight,
    filterTasksForDateAndHour,
    modifyStartEndTime,
    defineClickedHalf
  } = calendarUtils();

  const { onTaskDelete } = taskUtils({
    onStateReceived: handleTaskDeletion,
  });

  const { handleDataFromChild } = useDataHandlingLogic({
    hideModal,
    setClickedCellIndex,
  });

  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: handleDataFromChild,
  });

  useEffect(() => {
    setCurrentWeekDates(currentWeekDays);
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

  useEffect(() => {
    openedModalId === null && closeDateTimeSelectedCell();
  }, [openedModalId]);

  // Event handlers

  function handleTaskDeletion(state) {
    // Handle task deletion.
    if (state.status === 204) {
      hideModal();
      refreshTasks();
      toast.success(`The task '${state.task.title}' was successfully deleted`);
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
  const handleExistingTaskClick = (event, taskId) => {
    closeDateTimeSelectedCell();
    handleOnClick(event, taskId);
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
  const handleDateHourClick = (params) => {
    const { date, hour, e, dateIndex, hourIndex } = params;
    const clickedCellIndex = `${hourIndex}${dateIndex}`;
    const clickedHalf = defineClickedHalf(e);

    const { startTime, endTime } = modifyStartEndTime({
      hour: hour,
      date: date,
      clickedHalf: clickedHalf,
    });

    setClickedCellIndex(clickedCellIndex);
    setClickedHalf(clickedHalf);
    setSelectedDate(date);

    setClickedPeriod(convertTimePeriod(startTime, endTime));
    setClickedPeriodStart(convertTime(startTime));
    setClickedPeriodEnd(convertTime(endTime));

    handleOnClick(e, clickedCellIndex);
    const newTask = initiateNewTask(hour, hour + 1, date);
    setTask({ ...task, ...newTask });
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
   * Handle click on a task or a date to show the modal
   * @param {Object} event - The event object
   * @param {number} id - The id of the modal
   */
  const handleOnClick = (event, id) => {
    // Close opened modal
    if (openedModalId !== null) {
      hideModal();
    }
    event.stopPropagation();
    showModal(id);
  };
  const closeDateTimeSelectedCell = () => {
    setClickedCellIndex(null);
  };

  const onModalClose = () => {
    hideModal();
  };
  const onTaskEdit = (task) => {
    navigate(`/tasks/${task.id}`, {
      state: { previousLocation: location.pathname },
    });
  };

  const onTitleChangeNewTask = (event) => {
    setTask({ ...task, title: event.target.value });
  };

  /**
   * A React effect hook that updates the current week's dates based on the selected week's start date and the available dates.
   * It triggers whenever the available dates or the current week's start date changes.
   * @effect
   * @param {Date[]} dates - An array of available dates.
   * @param {Date} currentWeekStartDate - The start date of the currently displayed week.
   */
  const currentWeekDays = useMemo(() => {
    if (dates.length != -1) {
      return getCurrentWeekDates(dates, currentWeekStartDate);
    }
    return [];
  }, [dates, currentWeekStartDate]);

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

  const renderExistingTaskItem = (task) => {
    const toggledTaskActiveClass = toggleTaskActiveClass(
      task.id,
      openedModalId,
      isModalVisible
    );
    const taskClass = ` calendar-weekly__task-option__wrapper  task-option ${toggledTaskActiveClass}`;

    const taskHeightDimensions = calculateTaskHeight(
      task.time_start,
      task.time_end
    );
    return (
      <TaskItem
        task={task}
        classes={taskClass}
        handleOnTaskClick={(event) => handleExistingTaskClick(event, task.id)}
        styles={taskHeightDimensions}
      />
    );
  };

  const renderNewTaskBox = () => (
    <div className="clicked-new-task-modal">
      <h4>
        {task.title ? (
          <TruncatedText text={task.title} maxCharacters={10} />
        ) : (
          "(Untitled)"
        )}
      </h4>
      <p className="clicked-new-task-modal__text">{clickedPeriod}</p>
    </div>
  );

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
    const cellHalfClassName = getCellHalfClassName(clickedHalf);
    const cellClassName =
      "calendar-weekly__time-cell" +
      `${cellClassNameSelected} ${cellHalfClassName}`;

    const handleCellClick = (e) =>
      handleDateHourClick({
        date: date,
        hour: hour,
        e: e,
        dateIndex: dateIndex,
        hourIndex: hourIndex,
      });

    return (
      <div key={dateIndex} className={cellClassName} onClick={handleCellClick}>
        <TaskList
          modalRef={modalRef}
          modalPosition={modalPosition}
          date={date}
          hourIndex={hourIndex}
          allTasks={allTasks}
          openedModalId={openedModalId}
          classes={"modal-task-description"}
          onModalClose={onModalClose}
          onTaskDelete={onTaskDelete}
          onTaskEdit={onTaskEdit}
          renderExistingTaskItem={renderExistingTaskItem}
          filterTasksForDateAndHour={filterTasksForDateAndHour}
        />
        {/* Click on the empty space  */}
        {cellClassNameSelected === "clicked-cell" && renderNewTaskBox()}
      </div>
    );
  };

  /**
   * Renders a wrapper around the Modal component with the provided content.
   *
   * @param {string} cellId - The unique ID of the cell.
   * @param {JSX.Element} modalContent - The JSX element representing the content of the modal.
   * @param {JSX.Element} cellContent - The JSX element representing the content of the cell.
   * @returns {JSX.Element} JSX element representing the wrapped Modal component with content.
   */
  const renderNewTaskModalWrapper = (cellId, modalContent, cellContent) => (
    <Modal
      isModalVisible={openedModalId === cellId}
      modalRef={modalRef}
      position={modalPosition}
      classes={"modal-task-description"}
      key={cellId}
      content={modalContent}
    >
      {cellContent}
    </Modal>
  );

  const renderNewTaskModalForm = (cellId) => (
    <NewTask
      formId={cellId}
      openedModalId={openedModalId}
      selectedDate={selectedDate}
      onDateSelection={handleDateSelection}
      onTimeSelection={handleTimeSelection}
      handleTaskCreation={handleTaskCreation}
      clickedPeriodStart={clickedPeriodStart}
      clickedPeriodEnd={clickedPeriodEnd}
      onModalClose={onModalClose}
      onTitleSet={onTitleChangeNewTask}
    />
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
                  const cellContent = renderCellContent(
                    date,
                    hour,
                    dateIndex,
                    hourIndex
                  );

                  return renderNewTaskModalWrapper(
                    cellId,
                    renderNewTaskModalForm(cellId),
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

  return loading ? (
    <Loading />
  ) : (
    <div className="calendar-weekly__container">
      {currentWeekDates && renderCurrentWeekDates()}
      {renderTimeGrid()}
    </div>
  );
}

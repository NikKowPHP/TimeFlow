import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/calendar/calendar-weekly.css";
import { useCalendarState } from "../customHooks/useCalendarState";
import { useModalState } from "../customHooks/useModalState";
import { calendarUtils } from "../../utils/calendarUtils";
import { dateUtils } from "../../utils/dateUtils";
import svgPaths from "../svgPaths";
import newTaskHandler from "./newTaskHandler";
import Modal from "../modals/Modal";
import TruncatedText from "../TruncatedText";
import DateSelection from "../DateSelection";
import TimeSelection from "../TimeSelection";
import { useLocationState } from "../customHooks/useLocationState";
import TaskList from "./TaskList";
import Loading from "../Loading";
import NewTask from "../Task/NewTask";
import { taskUtils } from "../../utils/taskUtils";
/**
 * 
 * TODO: REFACTORING:
 * 1) split into smaller components: 
 * Date Header: Responsible for rendering the date labels and navigation buttons.
   Time Grid: Renders the time slots and associated tasks.
    Task Modal: Handles the rendering and interaction of task modals.
   Task Form: Manages the form for creating new tasks.
  2) Consolidate Effect Hooks: combining related effect hooks into a single effect
  3) Component Separation: Instead of having utility functions (calculateTaskHeight, filterTasksForDateAndHour) general functions move to a utility
 * 
 */
/**
 * CalendarWeekly component for displaying a weekly calendar view.
 * @component
 */
export default function CalendarWeekly() {
  const { navigate } = useLocationState();

  // Get modal's state from custom hook
  const {
    openedModalId,
    isModalVisible,
    modalPositionClass,
    showModal,
    hideModal,
  } = useModalState();

  const {
    dates,
    currentDate,
    allTasks,
    selectedDate,
    setSelectedDate,
    refreshTasks,
    loading,
  } = useCalendarState();

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

  const { onTaskDelete } = taskUtils({
    onStateReceived: handleTaskState,
  });

  function handleTaskState(state) {
    // Handle task deletion.
    if (state.status === 204) {
      hideModal();
      refreshTasks();
      toast.success(`The task '${state.task.title}' was successfully deleted`);
    }
  }

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

  // Event handlers

  /**
   * Handles data received from a child component (newTaskHandler)
   * @param {Object} data - Data received from the child component
   * @returns {any}
   */
  function handleDataFromChild(data) {
    if (data) {
      hideModal();
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
  const handleDateHourClick = ({ date, hour, e, dateIndex, hourIndex }) => {
    const rect = e.target.getBoundingClientRect();
    const clickedY = e.clientY - rect.top;
    const cellHeight = rect.height;

    const clickedHalf = clickedY < cellHeight / 2 ? "first" : "second";
    const modalId = `${hourIndex}${dateIndex}`;
    let startHour = hour;
    let endHour = hour + 1;
    if (clickedHalf === "second") {
      startHour += 0.5;
      endHour += 0.5;
    }

    // Convert decimal fractions to minutes
    const startMinutes = Math.floor((startHour % 1) * 60);
    const endMinutes = Math.floor((endHour % 1) * 60);

    const startTime = new Date(date);
    const endTime = new Date(date);
    startTime.setHours(Math.floor(startHour), startMinutes, 0, 0);
    endTime.setHours(Math.floor(endHour), endMinutes, 0, 0);

    const clickedCellIndex = `${hourIndex}${dateIndex}`;

    setClickedCellIndex(clickedCellIndex);
    setClickedHalf(clickedHalf);
    setSelectedDate(date);

    setClickedPeriod(convertTimePeriod(startTime, endTime));
    setClickedPeriodStart(convertTime(startTime));
    setClickedPeriodEnd(convertTime(endTime));

    handleOnClick(e, modalId);
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
  const currentWeekDays = useMemo(() => {
    if (dates.length != -1) {
      return getCurrentWeekDates(dates, currentWeekStartDate);
    }
    return [];
  }, [dates, currentWeekStartDate]);

  const closeDateTimeSelectedCell = () => {
    setClickedCellIndex(null);
  };

  useEffect(() => {
    openedModalId === null && closeDateTimeSelectedCell();
  }, [openedModalId]);

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
   * Determines the class name for an active task based on the modal's state and the provided task ID.
   * @param {string} taskId - The ID of the task being evaluated.
   * @returns {string} - The class name "task-active" if the task is active; otherwise, an empty string.
   */
  const toggleTaskActiveClass = (taskId) => {
    const isActive = openedModalId === taskId && isModalVisible;
    return isActive ? "task-active" : "";
  };

  /**
   * Renders the header content for the modal.
   * @returns {JSX.Element} - JSX element containing icons for editing, deleting, and closing the modal.
   */
  const modalContentHeader = () => (
    <div className="modal-tools">
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
        onClick={() => hideModal()}
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
  const calculateTaskHeight = useMemo(
    () => (taskTimeStart, taskTimeEnd) => {
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
    },
    []
  );

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

  const renderModalChildren = (task) => {
    const toggledTaskActiveClass = toggleTaskActiveClass(task.id);

    return (
      <div
        className={`task-option ${toggledTaskActiveClass}`}
        onClick={(event) => handleExistingTaskClick(event, task.id)}
        style={calculateTaskHeight(task.time_start, task.time_end)}
      >
        {`${task.title} ${task.time_start}-${task.time_end}`}
      </div>
    );
  };

  const onModalClose = () => {
    hideModal();
  };
  const onTaskEdit = (task) => {
    navigate(`/tasks/${task.id}`, {
      state: { previousLocation: location.pathname },
    });
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
      handleDateHourClick({
        date: date,
        hour: hour,
        e: e,
        dateIndex: dateIndex,
        hourIndex: hourIndex,
      });

    return (
      <div
        key={dateIndex}
        className={`calendar-weekly__time-cell ${cellClassNameSelected} ${cellHalfClassName}`}
        onClick={handleCellClick}
      >
        <TaskList
          date={date}
          hourIndex={hourIndex}
          openedModalId={openedModalId}
          modalPositionClass={modalPositionClass}
          onModalClose={onModalClose}
          onTaskDelete={onTaskDelete}
          onTaskEdit={onTaskEdit}
          renderModalChildren={renderModalChildren}
          filterTasksForDateAndHour={filterTasksForDateAndHour}
        />

        {/* Click on cell content */}
        {cellClassNameSelected === "clicked-cell" && (
          <div className="clicked-new-task-modal">
            <h4>
              {task.title ? (
                <TruncatedText text={task.title} maxCharacters={10} />
              ) : (
                "(Untitled)"
              )}
            </h4>
            <p className="clicked-new-task-modal__text">
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
  const onTitleChangeNewTask = (event) => {
    setTask({ ...task, title: event.target.value });
  };

  /**
   * Renders the modal content for creating a new task with specified parameters.
   * @param {string} dayName - The name of the day.
   * @param {string} cellId - The unique ID of the cell.
   * @param {JSX.Element} modalContentHeader - The JSX element representing the header of the modal with icons and layout.
   * @returns {JSX.Element} - The JSX element representing the modal content for creating a new task.
   */
  const renderModalContentNewTask = (dayName, cellId, modalContentHeader) => (
    <div>
      {/* render header of modal */}
      {modalContentHeader}
      <form onSubmit={handleTaskCreation}>
        <div className="modal-task-title">
          <h2>Create a new event </h2>
          <input
            type="text"
            placeholder="Add title"
            onChange={(event) =>
              setTask({ ...task, title: event.target.value })
            }
          />
          <div className="modal-task-time">
            {renderDateSelection(cellId)}

            <div className="modal-task-time_time-selection-container">
              {renderTimeSelection(clickedPeriodStart, true)}-
              {renderTimeSelection(clickedPeriodEnd, false)}
            </div>
            <div className="modal-task-description-container"></div>
          </div>
          <div className="modal-task__time-period">
            <span className="modal-task-time__day">{dayName}</span>
            <span>
              {clickedPeriodStart}-{clickedPeriodEnd}
            </span>
          </div>
        </div>
        <div className="modal-task-additional">
          {/* TODO: create notifications */}
          <div className="modal-task-notification">
            <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
              {svgPaths.notification}
            </svg>
            <p>in 5 minutes before</p>
          </div>
          <div className="modal-task-owner">
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
   * Renders a wrapper around the Modal component with the provided content.
   *
   * @param {string} cellId - The unique ID of the cell.
   * @param {JSX.Element} modalContent - The JSX element representing the content of the modal.
   * @param {JSX.Element} cellContent - The JSX element representing the content of the cell.
   * @returns {JSX.Element} JSX element representing the wrapped Modal component with content.
   */
  const renderModalWrapper = (cellId, modalContent, cellContent) => (
    <Modal
      isModalVisible={openedModalId === cellId}
      modalPositionClass={modalPositionClass}
      classes={`modal-task-description ${modalPositionClass} `}
      key={cellId}
      content={modalContent}
    >
      {/* Children */}
      {cellContent}
    </Modal>
  );

  const renderModalNewTask = (cellId) => {};

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
                  const modalContent = (
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

                  return renderModalWrapper(cellId, modalContent, cellContent);
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

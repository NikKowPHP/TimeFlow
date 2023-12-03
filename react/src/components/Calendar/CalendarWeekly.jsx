import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/calendar/calendar-weekly.css";
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
import { useNotificationState } from "../customHooks/useNotificationState";
import WeekSwitcher from "./items/WeekSwitcher";
import useTouchHandlers from "../customHooks/useTouchHandlers";

/**
 * CalendarWeekly component for displaying a weekly calendar view.
 * @component
 */
export default function CalendarWeekly({
  dates,
  user,
  currentDate,
  setMonth,
  allTasks,
  selectedDate,
  loading,
  dispatch,
  selectDate,
  clickedCellIndex,
  clickCell,
  setNewTask,
  newTask,
  updateTasks,
  deleteTask,
  isMobileLayout,
}) {
  const { requestNotificationPermission, displayNotification } =
    useNotificationState();

  const { navigate } = useLocationState();
  const [currentWeekDates, setCurrentWeekDates] = useState("");
  const [clickedHalf, setClickedHalf] = useState(null);
  const [clickedPeriod, setClickedPeriod] = useState(null);
  const [clickedPeriodStart, setClickedPeriodStart] = useState(null);
  const [clickedPeriodEnd, setClickedPeriodEnd] = useState(null);
  const [selectedDatesByCell, setSelectedDatesByCell] = useState({});
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(currentDate);
  const modalRef = useRef(null);

  const { handleTouchStart, handleTouchEnd, handleTouchMove } =
    useTouchHandlers(handleNextWeek, handlePreviousWeek);

  // Get modal's state from custom hook
  const {
    openedModalId,
    isModalVisible,
    modalPosition,
    showModal,
    hideModal,
    handleOnTriggerClick,
    modalOpacity,
  } = useModalState({
    modalRef: modalRef,
  });

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
    toggleTaskActiveClass,
    calculateTaskHeight,
    filterTasksForDateAndHour,
    modifyStartEndTime,
    defineClickedHalf,
  } = calendarUtils();

  const { onTaskDelete } = taskUtils({
    hideModal: hideModal,
    dispatch: dispatch,
    deleteTask: deleteTask,
  });

  const { handleDataFromChild } = useDataHandlingLogic({
    hideModal,
    clickCell,
    dispatch,
  });

  const { handleTaskCreation } = newTaskHandler({
    dispatch: dispatch,
    newTask: newTask,
    onDataReceived: handleDataFromChild,
    updateTasks: updateTasks,
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
    hoursOfDay.forEach((hour, hourIndex) => {
      currentWeekDates &&
        currentWeekDates.forEach((date, dateIndex) => {
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

  const checkMonthDiff = (previousStartDate, newStartDate) => {
    const monthDiff = previousStartDate.getMonth() - newStartDate.getMonth();
    if (monthDiff !== 0) {
      setMonth(newStartDate.getMonth());
    }
  };

  /**
   * Handles the action to move to the previous week
   */
  function handlePreviousWeek() {
    const newWeekStartDate = new Date(currentWeekStartDate);
    newWeekStartDate.setDate(new Date(currentWeekStartDate).getDate() - 7);
    checkMonthDiff(new Date(currentWeekStartDate), newWeekStartDate);
    setCurrentWeekStartDate(newWeekStartDate);
  }

  /**
   * Handles the action to move to the next week
   */
  function handleNextWeek() {
    const newWeekStartDate = new Date(currentWeekStartDate);
    newWeekStartDate.setDate(new Date(currentWeekStartDate).getDate() + 7);
    checkMonthDiff(new Date(currentWeekStartDate), newWeekStartDate);
    setCurrentWeekStartDate(newWeekStartDate);
  }

  /**
   * Handles the click on a specific date.
   * @param {Date} date - The clicked date.
   */
  const handleDateClick = (date) => {
    dispatch(selectDate(new Date(date).getTime()));
  };
  const handleExistingTaskClick = (event, taskId) => {
    closeDateTimeSelectedCell();
    if (!isMobileLayout) {
      handleOnTriggerClick({ event: event, modalId: taskId, dispatch });
    } else {
      event.stopPropagation();
      navigate(`/task/${taskId}`);
    }
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
    handleDateClick(date);

    const clickedCellIndex = `${hourIndex}${dateIndex}`;

    dispatch(clickCell(clickedCellIndex));

    const clickedHalf = defineClickedHalf(e);
    const { startTime, endTime } = modifyStartEndTime({
      hour: hour,
      date: date,
      clickedHalf: clickedHalf,
    });

    setClickedHalf(clickedHalf);

    setClickedPeriod(convertTimePeriod(startTime, endTime));
    setClickedPeriodStart(convertTime(startTime));
    setClickedPeriodEnd(convertTime(endTime));

    handleOnTriggerClick({
      event: e,
      modalId: clickedCellIndex,
      startTime: startTime,
      endTime: endTime,
      selectedDate: date,
      isNewTask: true,
      allTasks: allTasks,
      dispatch: dispatch,
      setNewTask: setNewTask,
    });
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
    dispatch(clickCell(cellId));
    dispatch(selectDate(formattedSelectedDate));
    dispatch(setNewTask({ date: newSelectedDate }));
  };

  /**
   * Hadles time selection and sets state
   * @param {Date} selectedTime - The selected time
   * @param {boolean} isStart - Whether is start of the time period or the end
   */
  const handleTimeSelection = (selectedTime, isStart) => {
    if (isStart) {
      setClickedPeriodStart(selectedTime);
      setNewTask({ time_start: selectedTime });
    } else {
      setClickedPeriodEnd(selectedTime);
      setNewTask({ time_end: selectedTime });
    }
  };
  const handleNotificationSelection = (event) => {
    setNewTask({ notification_preference: event.target.value });
  };

  /**
   * Handle click on a task or a date to show the modal
   * @param {Object} event - The event object
   * @param {number} id - The id of the modal
   */

  const handleNotificationClick = () => {
    requestNotificationPermission();
  };
  const handleDisplayNotification = () => {
    displayNotification("your task", { body: "clicked" });
  };

  const closeDateTimeSelectedCell = () => {
    dispatch(clickCell(null));
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
    setNewTask({ title: event.target.value });
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

    const existingTaskItemDesktop = (
      <TaskItem
        modalOpacity={modalOpacity}
        modalPosition={modalPosition}
        task={task}
        classes={taskClass}
        handleOnTaskClick={(event) =>
          handleExistingTaskClick(event, task.id, dispatch)
        }
        styles={taskHeightDimensions}
      />
    );
    const existingTaskItemMobile = (
      <TaskItem
        modalOpacity={modalOpacity}
        modalPosition={modalPosition}
        task={task}
        classes={taskClass}
        handleOnTaskClick={(event) =>
          handleExistingTaskClick(event, task.id, dispatch)
        }
        styles={taskHeightDimensions}
        isMobileLayout={isMobileLayout}
      />
    );

    return isMobileLayout ? existingTaskItemMobile : existingTaskItemDesktop;
  };

  const renderNewTaskBox = () => (
    <div className="clicked-new-task-modal">
      <h4>
        {newTask.title ? (
          <TruncatedText text={newTask.title} maxCharacters={10} />
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
      "calendar-weekly__time-cell " +
      `${cellClassNameSelected} ${cellHalfClassName}`;

    const handleCellClick = (e) => {
      if (!isMobileLayout) {
        handleDateHourClick({
          date: date,
          hour: hour,
          e: e,
          dateIndex: dateIndex,
          hourIndex: hourIndex,
        });
      } else {
        navigate("/tasks/new");
      }
    };
    return (
      <div key={dateIndex} className={cellClassName} onClick={handleCellClick}>
        <TaskList
          modalOpacity={modalOpacity}
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
      modalOpacity={modalOpacity}
      isModalVisible={openedModalId === cellId}
      modalRef={modalRef}
      modalPosition={modalPosition}
      classes={"modal-task-description"}
      key={cellId}
      content={modalContent}
    >
      {cellContent}
    </Modal>
  );

  const renderNewTaskModalForm = (cellId, date) => {
    return (
      <NewTask
        user={user}
        newTaskObj={newTask}
        formId={cellId}
        openedModalId={openedModalId}
        selectedDate={date}
        onDateSelection={handleDateSelection}
        onTimeSelection={handleTimeSelection}
        handleTaskCreation={handleTaskCreation}
        clickedPeriodStart={clickedPeriodStart}
        clickedPeriodEnd={clickedPeriodEnd}
        onModalClose={onModalClose}
        onTitleSet={onTitleChangeNewTask}
        handleNotificationClick={handleNotificationClick}
        displayNotification={handleDisplayNotification}
        onNotificationSelection={handleNotificationSelection}
      />
    );
  };

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
                    renderNewTaskModalForm(cellId, date),
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
      {!isMobileLayout && (
        <WeekSwitcher
          handleNextWeek={handleNextWeek}
          handlePreviousWeek={handlePreviousWeek}
        />
      )}
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
  const mobileContent = (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="calendar-weekly__container">
        {currentWeekDates && renderCurrentWeekDates()}
        {renderTimeGrid()}
      </div>
    </div>
  );
  const desktopContent = (
    <div className="calendar-weekly__container">
      {currentWeekDates && renderCurrentWeekDates()}
      {renderTimeGrid()}
    </div>
  );

  return loading ? (
    <Loading />
  ) : isMobileLayout ? (
    mobileContent
  ) : (
    desktopContent
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useCalendarState } from "../customHooks/useCalendarState";
import Loading from "../Loading";
import "../../styles/calendar/calendar-agenda.css";
import { calendarUtils } from "../../utils/calendarUtils";
import { useModalState } from "../customHooks/useModalState";
import newTaskHandler from "./newTaskHandler";
import Modal from "../modals/Modal";
import NewTask from "../Task/NewTask";
import ExistingTask from "../Task/ExistingTask";
import { taskUtils } from "../../utils/taskUtils";

export default function CalendarAgenda() {
  const modalRef = useRef(null);
  // TODO: when task created update the state of AllTask then trigger rerender by effect

  const {
    loading,
    allTasks,
    setAllTasks,
    setSelectedDate,
    selectedDate,
    currentDate,
  } = useCalendarState();
  const {
    toggleTaskActiveClass,
    formatDateToDDMonDay,
    initiateNewTask,
    convertDateToTime,
  } = calendarUtils();

  const { onTaskDelete, onTaskEdit } = taskUtils({
    onStateReceived: handleTaskState,
  });
  function handleTaskState() {}

  // Modal import
  const {
    openedModalId,
    isModalVisible,
    showModal,
    modalPosition,
    hideModal,
    onModalClose,
    displaySuccessTaskCreation,
    handleOnTriggerClick,
  } = useModalState({ modalRef: modalRef });

  // Task import
  const {
    task,
    setTask,
    handleTaskCreation,
    handleDateSelection,
    handleTimeSelection,
  } = newTaskHandler({
    onDataReceived: displaySuccessTaskCreation,
  });

  const [groupedTasks, setGroupedTasks] = useState({});

  useEffect(() => {
    setGroupedTasks(groupTasksByDate());
  }, [allTasks]);

  const sortDaysByOrder = () =>
    allTasks.sort((a, b) => a.date - b.date).reverse();

  const groupTasksByDate = () =>
    sortDaysByOrder().reduce((grouped, task) => {
      const date = task.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
      return grouped;
    }, {});
  // TODO: FIX when creating a new task group task by date is not working

  // const handleOnClick = ({
  //   event,
  //   modalId,
  //   startTime,
  //   endTime,
  //   selectedDate,
  //   newTask = false,
  // }) => {
  //   // Close opened modal
  //   if (openedModalId !== null) {
  //     hideModal();
  //   }
  //   event.stopPropagation();
  //   showModal(modalId);
  //   if (newTask) {
  //     const newTask = initiateNewTask(startTime, endTime, selectedDate);
  //     setTask({ ...task, ...newTask });
  //   }
  // };

  const renderGroupTaskDate = (date) => {
    const { month, dayOfMonth, dayOfWeek } = formatDateToDDMonDay(date);
    const dateObj = new Date(date);
    const id = date;

    const currentDate = new Date();

    const currentMinutes = currentDate.getMinutes();
    const currentHours = currentDate.getHours();

    const timePeriodStartObj = currentDate;
    const timePeriodEndObj = new Date();
    timePeriodEndObj.setHours(currentHours + 1);
    const timePeriodStartString = convertDateToTime(timePeriodStartObj);
    const timePeriodEndString = convertDateToTime(timePeriodEndObj);
    return (
      <div className="calendar-agenda__group-date">
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
              selectedDate={dateObj}
              onDateSelection={handleDateSelection}
              onTimeSelection={handleTimeSelection}
              handleTaskCreation={handleTaskCreation}
              clickedPeriodStart={timePeriodStartString}
              clickedPeriodEnd={timePeriodEndString}
              onModalClose={hideModal}
              onTitleSet={(event) =>
                setTask({ ...task, title: event.target.value })
              }
            />
          }
        >
          <span
            className="calendar-agenda__group-date__dayOfMonth"
            onClick={(event) =>
              handleOnTriggerClick({
                event: event,
                modalId: id,
                startTime: timePeriodStartObj,
                endTime: timePeriodEndObj,
                selectedDate: dateObj,
                newTask: true,
              })
            }
          >
            {dayOfMonth}
          </span>
        </Modal>
        <span className="calendar-agenda__group-date__month">{month}</span>,
        <span className="calendar-agenda__group-date__dayOfWeek">
          {dayOfWeek}
        </span>
      </div>
    );
  };

  const renderGroupTaskInfo = (task) => {
    const activeClass = toggleTaskActiveClass(
      task.id,
      openedModalId,
      isModalVisible
    );
    return (
      <div
        className={`calendar-agenda__group-time-title ${activeClass}`}
        onClick={(event) =>
          handleOnClick({
            event: event,
            modalId: task.id,
            newTask: false,
          })
        }
      >
        <div className="calendar-agenda__group-time">
          {task.time_start}-{task.time_end}
        </div>
        <div className="calendar-agenda__group-title font-bold">
          {task.title}
        </div>
      </div>
    );
  };

  const renderTaskList = () => {
    if (!groupedTasks) return;
    return Object.entries(groupedTasks).map(([date, tasks]) => (
      <div key={date} className="calendar-agenda__group-wrapper">
        {renderGroupTaskDate(date)}
        <div className="calendar-agenda__group-info">
          {tasks.map((task) => {
            return (
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
                {renderGroupTaskInfo(task)}
              </Modal>
            );
          })}
        </div>
      </div>
    ));
  };
  const renderMainView = () =>
    loading ? (
      <Loading />
    ) : (
      <div className="calendar-agenda-wrapper">
        <div>{renderTaskList()}</div>
      </div>
    );
  return renderMainView();
}

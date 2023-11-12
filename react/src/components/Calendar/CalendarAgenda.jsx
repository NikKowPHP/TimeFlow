import React, { useEffect, useRef, useState } from "react";
import Loading from "../Loading";
import "../../styles/calendar/calendar-agenda.css";
import { calendarUtils } from "../../utils/calendarUtils";
import { useModalState } from "../customHooks/useModalState";
import newTaskHandler from "./newTaskHandler";
import Modal from "../modals/Modal";
import NewTask from "../Task/NewTask";
import ExistingTask from "../Task/ExistingTask";
import { taskUtils } from "../../utils/taskUtils";

export default function CalendarAgenda({
  allTasks,
  clickedCellIndex,
  clickCell,
  loading,
  setNewTask,
  newTask,
  dispatch,
  updateTasks,
  currentDate,
  selectedDate,
}) {
  const modalRef = useRef(null);

  const { toggleTaskActiveClass,getActiveDateClass, formatDateToDDMonDay } = calendarUtils();

  const { onTaskDelete, onTaskEdit } = taskUtils({
    onStateReceived: handleTaskState,
  });
  function handleTaskState() {}

  const {
    openedModalId,
    isModalVisible,
    modalPosition,
    hideModal,
    displaySuccessTaskCreation,
    onModalClose,
    handleOnTriggerClick,
    modalOpacity,
  } = useModalState({
    modalRef: modalRef,
    dispatch: dispatch,
    setNewTask: setNewTask,
  });

  function handleTaskUpdate(updatedTask) {
    setNewTask(updatedTask);
  }
  // Handling task creation
  const {
    handleTaskCreation,
    handleDateSelection,
    handleTimeSelection,
    handleNotificationSelection,
  } = newTaskHandler({
    onDataReceived: displaySuccessTaskCreation,
    dispatch: dispatch,
    updateTasks: updateTasks,
    newTask: newTask,
    setNewTask: setNewTask,
    clickedCellIndex,
    clickCell,
  });

  const [groupedTasks, setGroupedTasks] = useState({});

  const filterTasks = () => {
    const uniqueTaskIds = new Set();
    return allTasks.filter((task) => {
      const taskId = task.id;
      const taskDate = new Date(task.date);
      const [hours, minutes] = task.time_start.split(":").map(Number);
      taskDate.setHours(hours, minutes);
      if (
        taskDate.getTime() >= new Date(currentDate).getTime() &&
        !uniqueTaskIds.has(taskId)
      ) {
        uniqueTaskIds.add(taskId);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    setGroupedTasks(groupTasksByDate());
  }, [allTasks, currentDate]);

  const sortDaysByOrder = () =>
    filterTasks().sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  const groupTasksByDate = () =>
    sortDaysByOrder().reduce((grouped, task) => {
      const date = task.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
      return grouped;
    }, {});

  const renderNewTaskContent = ({ id, selectedDate }) => (
    <NewTask
      formId={id}
      openedModalId={openedModalId}
      selectedDate={selectedDate}
      onDateSelection={handleDateSelection}
      onTimeSelection={handleTimeSelection}
      handleTaskCreation={handleTaskCreation}
      onNotificationSelection={handleNotificationSelection}
      newTaskObj={newTask}
      onModalClose={hideModal}
      onTitleSet={(event) => setNewTask({ title: event.target.value })}
    />
  );

  const renderGroupTaskDate = (date) => {
    const { month, dayOfMonth, dayOfWeek } = formatDateToDDMonDay(date);
    const dateObj = new Date(date);
    const id = date;
    const currentDateObj = new Date();
    const currentHours = currentDateObj.getHours();
    const timePeriodStartObj = currentDateObj;
    const timePeriodEndObj = new Date();
    timePeriodEndObj.setHours(currentHours + 1);
    const currentDateClass = getActiveDateClass(date,currentDate, selectedDate)
    const newTaskProps = {
      id: id,
      selectedDate: dateObj,
    };
    const onClickProps = {
      modalId: id,
      startTime: timePeriodStartObj,
      endTime: timePeriodEndObj,
      selectedDate: dateObj,
      dispatch: dispatch,
      setNewTask: setNewTask,
      newTask: newTask,
      isNewTask: true,
      allTasks: allTasks,
    };
    return (
      <div className="calendar-agenda__group-date">
        <Modal
          modalOpacity={modalOpacity}
          modalPosition={modalPosition}
          modalRef={modalRef}
          isModalVisible={openedModalId === id}
          classes={"modal-task-description"}
          key={id}
          content={renderNewTaskContent(newTaskProps)}
        >
          <span
            className={`calendar-agenda__group-date__dayOfMonth ${currentDateClass}`}
            onClick={(event) =>
              handleOnTriggerClick({ ...onClickProps, event: event })
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
          handleOnTriggerClick({
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
                modalOpacity={modalOpacity}
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

  const renderCurrentDateGroup = () => (
    <div
      key={currentDate}
      className="calendar-agenda__group-wrapper calendar-agenda__group-wrapper__currentDate"
    >
      {renderGroupTaskDate(currentDate)}
      <div className="calendar-agenda__group-info"></div>
    </div>
  );
  const renderMainView = () =>
    loading ? (
      <Loading />
    ) : (
      <div className="calendar-agenda-wrapper">
        {renderCurrentDateGroup()}
        <div>{renderTaskList()}</div>
      </div>
    );
  return renderMainView();
}

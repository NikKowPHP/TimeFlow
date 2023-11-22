import React, { useEffect, useRef } from "react";
import DateSelection from "../DateSelection";
import TimeSelection from "../TimeSelection";
import svgPaths from "../svgPaths";
import { useNotificationState } from "../customHooks/useNotificationState";
import "../../styles/modals/newTaskModal.css";

export default function NewTask({
  selectedDate,
  onDateSelection,
  onTimeSelection,
  handleTaskCreation,
  onModalClose,
  onTitleSet,
  handleNotificationClick,
  onNotificationSelection,
  displayNotification,
  newTaskObj,
  user,
}) {
  const { isNotificationGranted } = useNotificationState();
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Renders DateSelection component with specified props.
   * @returns {JSX.Element} JSX element representing the DateSelection component.  */
  const renderDateSelection = () => (
    <DateSelection
      onSelectDate={(newSelectedDate) => onDateSelection(newSelectedDate)}
      defaultDate={selectedDate}
    />
  );

  /**
   * Renders TimeSelection component with specified props.
   * @param {string} time - The time string of the selected cell in format 'HH:MM'.
   * @param {boolean} isStart - A flag indicating if the time selection is for the start time.
   * @returns {JSX.Element} JSX element representing the TimeSelection component.
   */
  const renderTimeSelection = (defaultTime, isStart) => (
    <div className="timeSelection-block">
      <TimeSelection
        onSelectTime={(selectedTime) => onTimeSelection(selectedTime, isStart)}
        defaultTime={defaultTime}
      />
    </div>
  );

  /**
   * Renders the header content for the modal.
   * @returns {JSX.Element} - JSX element containing icons for editing, deleting, and closing the modal.
   */
  const renderModalContentHeader = () => (
    <div className="modal-tools">
      <svg
        onClick={() => onModalClose()}
        className="svg-control"
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        {svgPaths.close}
      </svg>
    </div>
  );

  const renderNotificationSelection = () => (
    <select
      defaultValue={null}
      onChange={(event) => onNotificationSelection(event)}
    >
      <option value={null}>Do not notify me</option>
      <option value="1_day_before">1 day before</option>
      <option value="1_hour_before">1 hour before</option>
      <option value="15_minutes_before">15 minutes before</option>
    </select>
  );

  /**
   * Renders the modal content for creating a new task with specified parameters.
   * @param {JSX.Element} modalContentHeader - The JSX element representing the header of the modal with icons and layout.
   * @returns {JSX.Element} - The JSX element representing the modal content for creating a new task.
   */
  const renderModalNewTaskForm = (modalContentHeader) => (
    <>
      {/* render header of modal */}
      {modalContentHeader}
      <div className="modal-newTask__body">
        <form onSubmit={handleTaskCreation}>
          <div className="modal-newTask__body-main">
            <h2 className="modal-newTask__body-header">Create a new event </h2>
            <input
              ref={inputRef}
              type="text"
              placeholder="Add title"
              onChange={(event) => onTitleSet(event)}
            />
            <div className="modal-newTask__dateTime-container">
              <div className="modal-newTask__dateSelection-container">
                {renderDateSelection()}
              </div>
              <div className="modal-newTask__timeSelection-container">
                {renderTimeSelection(newTaskObj.time_start, true)}-
                {renderTimeSelection(newTaskObj.time_end, false)}
              </div>
            </div>
            <div className="modal-newTask__timePeriod-container">
              <span>
                From {newTaskObj.time_start} until {newTaskObj.time_end}
              </span>
            </div>
          </div>
          <div className="modal-newTask__info">
            <div
              className="modal-newTask__notification-container"
              onClick={handleNotificationClick}
            >
              <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
                {svgPaths.notification}
              </svg>
              {renderNotificationSelection()}
            </div>
            <div className="modal-newTask__info-owner">
              <i className="fa fa-calendar"></i>
              {user.name}
            </div>
          </div>
            <button className="btn btn-block" type="submit">
              Create
            </button>
        </form>
      </div>
    </>
  );

  return renderModalNewTaskForm(renderModalContentHeader());
}

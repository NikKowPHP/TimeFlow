import React from "react";
import DateSelection from "../DateSelection";
import TimeSelection from "../TimeSelection";
import svgPaths from "../svgPaths";
import { useNotificationState } from "../customHooks/useNotificationState";

export default function NewTask({
  selectedDate,
  onDateSelection,
  onTimeSelection,
  handleTaskCreation,
  clickedPeriodStart,
  clickedPeriodEnd,
  onModalClose,
  onTitleSet,
  handleNotificationClick,
  onNotificationSelection,
  displayNotification,
}) {
  const { isNotificationGranted } = useNotificationState();

  /**
   * Renders DateSelection component with specified props.
   * @returns {JSX.Element} JSX element representing the DateSelection component.
   */
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
    <div className="time-selection-block">
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
    <select defaultValue={null} onChange={(event) => onNotificationSelection(event)}>
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
    <div>
      {/* render header of modal */}
      {modalContentHeader}
      <form onSubmit={handleTaskCreation}>
        <div className="modal-task-title">
          <h2>Create a new event </h2>
          <input
            type="text"
            placeholder="Add title"
            onChange={(event) => onTitleSet(event)}
          />
          <div className="modal-task-time">
            {renderDateSelection()}

            <div className="modal-task-time_time-selection-container">
              {renderTimeSelection(clickedPeriodStart, true)}-
              {renderTimeSelection(clickedPeriodEnd, false)}
            </div>
            <div className="modal-task-description-container"></div>
          </div>
          <div className="modal-task__time-period">
            <span>
              {clickedPeriodStart}-{clickedPeriodEnd}
            </span>
          </div>
        </div>
        <div className="modal-task-additional">
          <div
            className="modal-task-notification"
            onClick={handleNotificationClick}
          >
            <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
              {svgPaths.notification}
            </svg>
            {renderNotificationSelection()}
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

  return renderModalNewTaskForm(renderModalContentHeader());
}

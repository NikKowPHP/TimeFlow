import React from "react";

export default function TaskForm() {
  const handleDateSelection = () => {};
  const handleTimeSelection = () => {};

  /**
   * Renders the header content for the tooltip.
   * @returns {JSX.Element} - JSX element containing icons for editing, deleting, and closing the tooltip.
   */
  const tooltipContentHeader = () => (
    <div className="tooltip-tools">
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
        onClick={() => hideTooltip()}
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
   * Renders DateSelection component with specified props.
   * @param {string} id - The unique id of the cell.
   * @returns {JSX.Element} JSX element representing the DateSelection component.
   */
  const renderDateSelection = (id) => (
    <DateSelection
      onSelectDate={(newSelectedDate, id) =>
        handleDateSelection(newSelectedDate, id)
      }
      defaultDate={selectedDate}
      id={id}
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

  /**
   * Renders the tooltip content for creating a new task with specified parameters.
   * @param {string} dayName - The name of the day.
   * @param {string} id - The unique ID of the cell.
   * @param {JSX.Element} tooltipContentHeader - The JSX element representing the header of the tooltip with icons and layout.
   * @returns {JSX.Element} - The JSX element representing the tooltip content for creating a new task.
   */
  const renderTooltipContentNewTask = (dayName, id, tooltipContentHeader) => (
    <div>
      {/* render header of tooltip */}
      {tooltipContentHeader}
      <form onSubmit={handleTaskCreation}>
        <div className="tooltip-task-title">
          <h2>Create a new event </h2>
          <input
            type="text"
            placeholder="Add title"
            onChange={(event) =>
              setTask({ ...task, title: event.target.value })
            }
          />
          <div className="tooltip-task-time">
            {renderDateSelection(id)}

            <div className="tooltip-task-time_time-selection-container">
              {renderTimeSelection(clickedPeriodStart, true)}-
              {renderTimeSelection(clickedPeriodEnd, false)}
            </div>
            <div className="tooltip-task-description-container"></div>
          </div>
          <div className="tooltip-task__time-period">
            <span className="tooltip-task-time__day">{dayName}</span>
            <span>
              {clickedPeriodStart}-{clickedPeriodEnd}
            </span>
          </div>
        </div>
        <div className="tooltip-task-additional">
          {/* TODO: create notifications */}
          <div className="tooltip-task-notification">
            <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
              {svgPaths.notification}
            </svg>
            <p>in 5 minutes before</p>
          </div>
          <div className="tooltip-task-owner">
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
   * Renders a wrapper around the Tooltip component with the provided content.
   *
   * @param {string} id- The unique ID of the tooltip.
   * @param {JSX.Element} tooltipContent - The JSX element representing the content of the tooltip.
   * @param {JSX.Element} childrenContent - The JSX element representing the content of the cell.
   * @returns {JSX.Element} JSX element representing the wrapped Tooltip component with content.
   */
  const renderTooltipWrapper = (id, tooltipContent, childrenContent) => (
    <Tooltip
      isTooltipVisible={openedTooltipId === id}
      tooltipPositionClass={tooltipPositionClass}
      classes={`tooltip-task-description ${tooltipPositionClass} `}
      key={id}
      content={tooltipContent}
    >
      {/* Children */}
      {childrenContent}
    </Tooltip>
  );

  const tooltipContent = renderTooltipContentNewTask(
    dayName,
    id,
    tooltipContentHeader()
  );

  return renderTooltipWrapper(id, tooltipContent, childrenContent);
}

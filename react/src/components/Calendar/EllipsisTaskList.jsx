import "../../styles/calendar/ellipsis.css";
import React from "react";
import svgPaths from "../svgPaths";

export default function ElipsisTaskList({
	taskList,
  onModalClose,
}) {
  // Render the header of the modal content
  const modalContentHeader = () => (
    <div className="modal-tools">
      <svg
        className="svg-control"
        onClick={() => onModalClose()}
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        {svgPaths.close}
      </svg>
    </div>
  );
	const renderTaskList = () => (
		taskList.map((task) => (
			<li key={task.id} className="ellipsis-task-list__item">{task.title} ({task.time_start}-{task.time_end})</li>
		))
	)
  const modalContentBody = () => (
    <div>
      {modalContentHeader()}
			<div className="ellipsis-task-list__body">
				<ul className="ellipsis-task-list__list">
					{renderTaskList()}
				</ul>
			</div>
    </div>
  );

  return modalContentBody();
}
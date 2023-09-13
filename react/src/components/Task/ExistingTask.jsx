import React from "react";
import svgPaths from "../svgPaths";

export default function ExistingTask({ task, onModalClose, onDelete, onTaskEdit }) {
  // Render the header of the modal content
  const modalContentHeader = () => (
    <div className="modal-tools">
      <svg
        className="svg-control cursor--pointer "
        onClick={() => onTaskEdit(task)}
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        {svgPaths.edit}
      </svg>
        <svg className="svg-control" onClick={() => onDelete(task)} focusable="false" width="20" height="20" viewBox="0 0 24 24">
          {svgPaths.delete}
        </svg>
      <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
        {svgPaths.envelope}
      </svg>
      <svg
        style={{ cursor: "pointer" }}
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
  const modalContentBody = (task) => (
    <div>
      {modalContentHeader()}
      <div className="modal-task-title">
        <h2>{task.title}</h2>
        <p>
          {task.date} ⋅ {task.time_start}-{task.time_end}
        </p>
      </div>
      <div className="modal-task-additional">
        {/* TODO: create notifications */}
        <div className="modal-task-notification">
          <svg focusable="false" width="20" height="20" viewBox="0 0 24 24">
            <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
          </svg>
          <p>in 5 minutes before</p>
        </div>
        <div className="modal-task-owner">
          <i className="fa fa-calendar"></i>
          {task.user.name}
        </div>
      </div>
    </div>
  );

  return modalContentBody(task);
}

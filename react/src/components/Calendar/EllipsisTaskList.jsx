import "../../styles/calendar/ellipsis.css";
import React, { useState } from "react";
import svgPaths from "../svgPaths";
import ExistingTask from "../Task/ExistingTask";
import Modal from "../modals/Modal";
import { useModalState } from "../customHooks/useModalState";

export default function ElipsisTaskList({
  taskList,
  onModalClose,
  onTaskDelete,
  onTaskEdit,
}) {
  // Get modal's state from custom hook
  const {
    modalPositionClass,
    nestedOpenedModalId,
    showNestedModal,
    hideNestedModal,
  } = useModalState();

  const handleOnTaskClick = ({ event, nestedModalId }) => {
    debugger;
    // Close opened nested modal
    if (nestedOpenedModalId !== null) {
      hideNestedModal();
    }
    event.stopPropagation();
    showNestedModal(nestedModalId);
  };

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

  const modalTaskChildren = (task) => {
    const taskModalId = `${task.date}-${task.time_start}-${task.time_end}`;
    return (
      <div
        onClick={(event) =>
          handleOnTaskClick({ event: event, nestedModalId: taskModalId })
        }
        key={task.id}
        className="ellipsis-task-list__item"
      >
        {task.title} ({task.time_start}-{task.time_end})
      </div>
    );
  };
  const renderTaskList = () =>
    taskList.map((task) => {
      const taskModalId = `${task.date}-${task.time_start}-${task.time_end}`;

      return (
        <Modal
          classes={`modal-task-description ${modalPositionClass} `}
          key={task.id}
          isModalVisible={nestedOpenedModalId === taskModalId}
          modalPositionClass={modalPositionClass}
          modalId={nestedOpenedModalId}
          content={
            <ExistingTask
              task={task}
              onModalClose={onModalClose}
              onDelete={onTaskDelete}
              onTaskEdit={onTaskEdit}
            />
          }
        >
          {modalTaskChildren(task)}
        </Modal>
      );
    });
  const modalContentBody = () => (
    <div>
      {modalContentHeader()}
      <div className="ellipsis-task-list__body">
        <div className="ellipsis-task-list__list">{renderTaskList()}</div>
      </div>
    </div>
  );

  return modalContentBody();
}

import "../../styles/calendar/ellipsis.css";
import React, { useEffect, useRef, useState } from "react";
import svgPaths from "../svgPaths";
import ExistingTask from "../Task/ExistingTask";
import Modal from "../modals/Modal";
import useNestedModalState from "../customHooks/useNestedModalState";

export default function ElipsisTaskList({
  taskList,
  onModalClose,
  onTaskDelete,
  onTaskEdit,
}) {
  const nestedModalRef = useRef(null);

  // Get modal's state from custom hook
  // const {
  //   nestedOpenedModalId,
  //   showNestedModal,
  //   hideNestedModal,
  //   modalPosition,
  // } = useModalState({nestedModalRef});

  const {
    showNestedModal,
    hideNestedModal,
    nestedOpenedModalId,
    isNestedModalVisible,
    setIsNestedModalVisible,
  } = useNestedModalState({ nestedModalRef: nestedModalRef });

  const handleOnTaskClick = ({ event, nestedModalId }) => {
    // Close opened nested modal
    if (nestedOpenedModalId !== null && nestedOpenedModalId !== undefined) {
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
    const taskModalId = `${task.title}-${task.date}-${task.time_start}-${task.time_end}`;
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
  const onNestedModalClose = () => {
    hideNestedModal();
  };
  const renderTaskList = () =>
    taskList.map((task) => {
      const taskModalId = `${task.title}-${task.date}-${task.time_start}-${task.time_end}`;

      return (
        <Modal
          modalRef={nestedModalRef}
          // modalPosition={modalPosition}
          classes={`ellipsis-modal__content `}
          key={task.id}
          isModalVisible={nestedOpenedModalId === taskModalId}
          modalId={taskModalId}
          content={
            <ExistingTask
              task={task}
              onModalClose={onNestedModalClose}
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

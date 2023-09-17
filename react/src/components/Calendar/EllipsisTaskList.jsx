import "../../styles/calendar/ellipsis.css";
import React from "react";
import svgPaths from "../svgPaths";
import ExistingTask from "../Task/ExistingTask";
import Modal from "../modals/Modal";

export default function ElipsisTaskList({
  taskList,
  onModalClose,
  onTaskDelete,
  onTaskEdit,
  openedModalId,
  modalPositionClass,
  handleOnTaskClick,
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

  const modalTaskChildren = (task) => {
    return (
      <div
        onClick={(event) =>
          handleOnTaskClick({ event: event, modalId: task.id})
        }
        key={task.id}
        className="ellipsis-task-list__item"
      >
        {task.title} ({task.time_start}-{task.time_end})
      </div>
    );
  };
  const renderTaskList = () =>
    taskList.map((task) => (
      <Modal
        classes={`modal-task-description ${modalPositionClass} `}
        key={task.id}
        isModalVisible={openedModalId === task.id}
        modalPositionClass={modalPositionClass}
        modalId={openedModalId}
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
    ));
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

import React, { useEffect, useMemo } from "react";
import Modal from "../modals/Modal";
import { dateUtils } from "../../utils/dateUtils";
import ExistingTask from "../Task/ExistingTask";

const TaskList = ({
  date,
  hourIndex,
  openedModalId,
  classes,
  style,
  onTaskDelete,
  onModalClose,
  onTaskEdit,
  renderModalChildren,
	filterTasksForDateAndHour,
}) => {
  const { convertDateSql } = dateUtils();

  const convertedHourIndex = useMemo(
    () => hourIndex.toString().padStart(2, "0"),
    [hourIndex]
  );
  const convertedDate = useMemo(
    () => convertDateSql(date.toLocaleDateString()),
    [date]
  );
  const filteredTasks = useMemo(
    () => filterTasksForDateAndHour(convertedDate, convertedHourIndex),
    [convertedDate, convertedHourIndex]
  );
  const maxTasksToShow = useMemo(
    () => Math.min(filteredTasks.length, 4),
    [filteredTasks]
  );

  return (
    <div className="tasks-list">
      {filteredTasks.slice(0, maxTasksToShow).map((task) => {
        const isModalVisible = () => openedModalId === task.id;
        return (
          <Modal
            classes={classes}
            style={style}
            key={task.id}
            isModalVisible={isModalVisible()}
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
            {renderModalChildren(task)}
          </Modal>
        );
      })}
    </div>
  );
};

export default TaskList;
import "../../styles/tasks/existingTaskInfo.css";
import React, { useEffect } from "react";
import svgPaths from "../../components/svgPaths";
import { useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import {
  fetchDateTasks,
  fetchSelectedTask,
} from "../../redux/actions/taskActions";
import { useLocationState } from "../../components/customHooks/useLocationState";
import Loading from "../../components/Loading";
import { taskUtils } from "../../utils/taskUtils";

function Task({ selectedTask }) {

  const { onTaskDelete, onTaskEdit } = taskUtils({});
  const dispatch = useDispatch();
  const { goBack } = useLocationState();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchSelectedTask(parseInt(id)));
  }, [id]);

  return selectedTask ? (
    <div className="task__info-wrapper">
      <div className="task__info-header">
        <svg
          className="task__info-header-btn--action"
          onClick={() => goBack()}
          focusable="false"
          viewBox="0 0 24 24"
        >
          {svgPaths.close}
        </svg>
        <div className="task__info-header__actions-wrapper">
          <svg
            className="task__info-header-btn--action"
            onClick={onTaskEdit}
            focusable="false"
            viewBox="0 0 24 24"
          >
            {svgPaths.edit}
          </svg>
          <svg
            className="task__info-header-btn--action"
            onClick={() => onTaskDelete(selectedTask)}
            focusable="false"
            viewBox="0 0 24 24"
          >
            {svgPaths.delete}
          </svg>
        </div>
      </div>
      <div className="task__info-body">
        <h1 className="task__info-body__title">{selectedTask.title}</h1>
        <p className="task__info-body__date">{selectedTask.date} </p>
        <p className="task__info-body__time">
          {selectedTask.time_start} - {selectedTask.time_end}
        </p>
      </div>
      <div className="task__info-footer">
        <p className="task__info-footer__notification-wrapper">
          <svg className="task__info-footer__notification--icon">
            {svgPaths.notification}
          </svg>
          {selectedTask.notification_preference
            ? selectedTask.notification_preference
            : "Notification is not set"}
        </p>
        <p className="task__info-footer__user-email-wrapper">
          <svg>{svgPaths.envelope}</svg>
          {selectedTask.user?.email}
        </p>
      </div>
    </div>
  ) : (
    <Loading />
  );
}

const mapStateToProps = (state) => ({
  selectedTask: state.tasks.selectedTask,
  isMobileLayout: state.app.isMobileLayout,
});
const mapDispatchToProps = {
  fetchDateTasks,
  fetchSelectedTask,
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);

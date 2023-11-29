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

function Task({ selectedTask }) {
  const dispatch = useDispatch();
  const { goBack, navigate } = useLocationState();
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
            onClick={() => onTaskEdit(selectedTask)}
            focusable="false"
            viewBox="0 0 24 24"
          >
            {svgPaths.edit}
          </svg>
          <svg
            className="task__info-header-btn--action"
            onClick={() => onDelete(selectedTask)}
            focusable="false"
            viewBox="0 0 24 24"
          >
            {svgPaths.delete}
          </svg>
        </div>
      </div>
      <div className="task-body">
        <h1>{selectedTask.title}</h1>
        <h1>{selectedTask.date}</h1>
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

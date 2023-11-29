import React, { useEffect } from "react";
import svgPaths from "../../components/svgPaths";
import { useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { fetchDateTasks, fetchSelectedTask } from "../../redux/actions/taskActions";
import { useLocationState } from "../../components/customHooks/useLocationState";

function Task({ selectedTask }) {
  const dispatch = useDispatch();
  const { goBack, navigate } = useLocationState();
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchSelectedTask(parseInt(id)));
  }, [id]);

  return (
    <div className="task-wrapper">
      <div className="task-header">
        <svg
          className="svg-control cursor--pointer "
          onClick={() => onTaskEdit(selectedTask)}
          focusable="false"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          {svgPaths.edit}
        </svg>
        <svg
          className="svg-control"
          onClick={() => onDelete(selectedTask)}
          focusable="false"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          {svgPaths.delete}
        </svg>
        <svg
          className="svg-control"
          onClick={() => goBack()}
          focusable="false"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          {svgPaths.close}
        </svg>
      </div>
      <div className="task-body">
				<h1>{selectedTask.title}</h1>
				<h1>{selectedTask.date}</h1>
			</div>
    </div>
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

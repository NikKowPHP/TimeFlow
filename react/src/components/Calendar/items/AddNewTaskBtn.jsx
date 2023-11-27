import React from "react";
import { Link } from "react-router-dom";
import svgPaths from "../../svgPaths";

function AddNewTaskBtn() {
  return (
    <Link
      to="/tasks/new"
      className={`btn__add-task-wrapper btn__add-task__absolute`}
    >
      <svg className="btn__add-task" width="36" height="36" viewBox="0 0 36 36">
        {svgPaths.addTask}
      </svg>
    </Link>
  );
}

export default AddNewTaskBtn;

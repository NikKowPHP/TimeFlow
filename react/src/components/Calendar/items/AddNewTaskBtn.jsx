import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import svgPaths from "../../svgPaths";
import { useDispatch } from "react-redux";
import { setNewTask } from "../../../redux/actions/taskActions";

function AddNewTaskBtn({date}) {
  
  const dispatch = useDispatch();

  const dispatchInitialTaskData = () => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const timePeriodStartObj = currentDate;
    const timePeriodEndObj = new Date();
    timePeriodEndObj.setHours(currentHours + 1);
    dispatch(setNewTask({date: date, time_start: timePeriodStartObj, time_end:timePeriodEndObj }))
  };
  useEffect(() => {
    dispatchInitialTaskData();
  }, [])
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

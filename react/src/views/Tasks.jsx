import "../styles/tasks/tasks.css";
import React, { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { connect, useDispatch } from "react-redux";
import { fetchDateTasks } from "../redux/actions/taskActions";
import { dateUtils } from "../utils/dateUtils";
import { calendarUtils } from "../utils/calendarUtils";
import AddNewTaskBtn from "../components/Calendar/items/AddNewTaskBtn";
import { useLocationState } from "../components/customHooks/useLocationState";
import { Link } from "react-router-dom";
import svgPaths from "../components/svgPaths";

function Tasks({ selectedDate, dateTasks, isMobileLayout }) {
  const { loading, setNotification } = useStateContext();
  const { goBack, navigate } = useLocationState();
  const dispatch = useDispatch();
  const { convertDateSql } = dateUtils();
  const { weekDays } = calendarUtils();

  useEffect(() => {
    if (!selectedDate) {
      goBack();
    } else {
      const convertedSelectedDate = convertDateSql(
        new Date(selectedDate).toLocaleDateString()
      );
      dispatch(fetchDateTasks(convertedSelectedDate));
    }
  }, [selectedDate]);

  const handleOnTaskClick = (taskId) => {
    return navigate(`/task/${taskId}`);
  };
  const renderDesktopContent = () => {};

  const renderMobileContent = () => {
    const selectedDateObject = new Date(selectedDate);
    const selectedDateNumber = selectedDateObject.getDate();
    const selectedDateDay = weekDays()[selectedDateObject.getDay() - 1];

    return (
      <>
      <div className="tasks__date-header">
        <svg onClick={goBack}>{svgPaths.close}</svg>
      </div>
        <div className=" tasks-date-container">
          <div className="tasks-date-section">
            <h5 className="tasks-date__day">{selectedDateDay}</h5>
            <h2 className="tasks-date__date">{selectedDateNumber}</h2>
          </div>
          <div className="tasks-date__tasks-container">
            {dateTasks.map((task) => (
              <div
                className="tasks-item-container"
                key={task.id}
                onClick={() => handleOnTaskClick(task.id)}
              >
                <h4 className="tasks-item__title">{task.title}</h4>
                <span className="tasks-item__time">
                  {task.time_start} - {task.time_end}
                </span>
              </div>
            ))}
          </div>
          <AddNewTaskBtn date={new Date(selectedDate)} />
        </div>
      </>
    );
  };
  return (
    <div className="tasks-wrapper">
      {isMobileLayout ? renderMobileContent() : renderDesktopContent()}
    </div>
  );
}

const mapStateToProps = (state) => ({
  selectedDate: state.calendar.selectedDate,
  dateTasks: state.tasks.dateTasks,
  isMobileLayout: state.app.isMobileLayout,
});
const mapDispatchToProps = {
  fetchDateTasks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);

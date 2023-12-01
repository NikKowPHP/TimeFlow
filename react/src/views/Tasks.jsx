import "../styles/tasks/tasks.css";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { connect, useDispatch } from "react-redux";
import { fetchDateTasks } from "../redux/actions/taskActions";
import { dateUtils } from "../utils/dateUtils";
import { calendarUtils } from "../utils/calendarUtils";
import AddNewTaskBtn from "../components/Calendar/items/AddNewTaskBtn";
import { useLocationState } from "../components/customHooks/useLocationState";
import svgPaths from "../components/svgPaths";
import { taskUtils } from "../utils/taskUtils";
import { useParams } from "react-router-dom";

function Tasks({ selectedDate, dateTasks, isMobileLayout, allTasks }) {
  const { date } = useParams();
  const { loading, setNotification } = useStateContext();
  const { goBack, navigate } = useLocationState();
  const dispatch = useDispatch();
  const { convertDateSql } = dateUtils();
  const { weekDays, getMonthName } = calendarUtils();
  const { onTaskDelete, onTaskEdit } = taskUtils({});

  const [groupedTasks, setGroupedTasks] = useState({});

  useEffect(() => {
    if (!date && isMobileLayout && !allTasks) {
      goBack();
    } else {
      const convertedSelectedDate = convertDateSql(
        new Date(selectedDate).toLocaleDateString()
      );
      dispatch(fetchDateTasks(convertedSelectedDate));
    }
  }, [selectedDate]);
  useEffect(() => {
    setGroupedTasks(groupTasksByDate());
  }, [allTasks]);

  const sortDaysByOrder = () =>
    allTasks.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const groupTasksByDate = () =>
    sortDaysByOrder().reduce((grouped, task) => {
      const date = task.date;
      const monthNumber = new Date(task.date).getMonth();
      const month = getMonthName(monthNumber);

      debugger;
      if (!grouped[month]) {
        grouped[month] = {};
      }
      if (!grouped[month][date]) {
        grouped[month][date] = [];
      }
      grouped[month][date].push(task);
      return grouped;
    }, {});

  const handleOnTaskClick = (taskId) => {
    return navigate(`/task/${taskId}`);
  };

  const renderDesktopContent = () => {
    return (
      <div className="tasks__desktop-content">
        <table className="tasks__desktop-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.date}</td>
                <td>{task.time_start}</td>
                <td>{task.time_end}</td>
                <td className="tasks__desktop-table__actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => onTaskEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => onTaskDelete(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const renderAllTasksMobile = () => {};

  const renderMobileContent = () => {
    const selectedDateObject = new Date(selectedDate);
    const selectedDateNumber = selectedDateObject.getDate();
    const selectedDateDay = weekDays()[selectedDateObject.getDay() - 1];

    return (
      <>
        <div className="tasks__date-header">
          <svg onClick={goBack}>{svgPaths.close}</svg>
        </div>
        <div className="tasks__body-container">
          {date
            ? dateTasks.map((task) => (
                <>
                  <div className="tasks-date__tasks-container">
                    <div className="tasks-date-section">
                      <h5 className="tasks-date__day">{selectedDateDay}</h5>
                      <h2 className="tasks-date__date">{selectedDateNumber}</h2>
                    </div>

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
                  </div>
                </>
              ))
            : groupedTasks &&
              Object.entries(groupedTasks).map(([month, dates]) => {
                return (
                  <div key={month} className="tasks-date__tasks-container">
                    <h5 className="tasks-date__month">{month}</h5>
                    {dates &&
                      Object.entries(dates).map(([date, tasks]) => {
                        const dateObj = new Date(date);
                        const dateNum = dateObj.getDate();
                        const dateDay = weekDays()[dateObj.getDay() - 1];

                        return (
                          <div
                            key={date}
                            className="tasks-date__tasks__block-container"
                          >
                            <div className="tasks-date-section">
                              <h5 className="tasks-date__day">{dateDay}</h5>
                              <h2 className="tasks-date__date">{dateNum}</h2>
                            </div>
                            <div className="tasks-date__items-container">
                              {tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="tasks-item-container"
                                  onClick={() => handleOnTaskClick(task.id)}
                                >
                                  <h4 className="tasks-item__title">
                                    {task.title}
                                  </h4>
                                  <span className="tasks-item__time">
                                    {task.time_start} - {task.time_end}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
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
  allTasks: state.tasks.allTasks,
});
const mapDispatchToProps = {
  fetchDateTasks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);

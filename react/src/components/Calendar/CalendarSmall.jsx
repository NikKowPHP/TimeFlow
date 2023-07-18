import { useEffect, useState } from "react";
import "../styles/calendar.css";
import axiosClient from "../../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import TaskList from "../TaskList";
import Tooltip from "../tooltips/Tooltip";
import CalendarMonthly from "./CalendarMonthly";
import { toast } from "react-toastify";

export default function Calendar() {
  const currentDate = new Date();
  const months = generateMonths();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [layout, setLayout] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );

  const navigate = useNavigate();
  const calendarType = useLocation().pathname;




  const hasTasks = (date) => {
    const thisDate = modifyDateSql(date);
    if (allTasks.some((task) => task.date === thisDate)) {
      return "has-tasks";
    } else {
      return "";
    }
  };


  // handle clicks
  const handleDateClick = (date) => {
    const selectedDate = date.toLocaleDateString();
    setSelectedDate(selectedDate);
    navigate(`/calendar/${convertDateSql(selectedDate)}`);
  };
  const handleMonthClick = (selectedMonth) => {
    setMonth(selectedMonth);
    setShowMonths(!showMonths);
  };
  const handleTaskClick = (taskId, event) => {
    console.log(taskId);
    event && event.stopPropagation();
    setOpenTooltipId(taskId);
  };

  const handleActiveTaskState = (newState) => {
    setIsTooltipVisible(newState);
  };

  //toggle views
  const toggleShowMonths = () => {
    setShowMonths(!showMonths);
  };
  const toggleShowYears = () => {
    setShowYears(!showYears);
  };

  // render views

  const renderDates = () => {
    return (
      <>
        <ul className={"weeks animated fadeInDown "}>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <div className={"days animated fadeInDown "}>
          {dates.map((date, index) => (
            <div
              onClick={() => handleDateClick(date)}
              className={`${getActiveDateClass(date)} ${hasTasks(date)} `}
              key={index}
            >
              {date !== "" && date.getDate()}
            </div>
          ))}
        </div>
        {tasks && <TaskList selectedDate={selectedDate} tasksArray={tasks} />}
      </>
    );
  };


  return (
    <div className="calendar-wrapper">
      <header>
        <button
          className="current-date btn-transparent"
          onClick={toggleShowYears}
        >
          {year}
        </button>
        <button
          className="current-month btn-transparent"
          onClick={toggleShowMonths}
        >
          {getMonthName(month)}
        </button>

        <div className="icons">
          <span
            onClick={getPrevMonthDates}
            className="material-symbols-rounded"
          >
            chevron_left
          </span>
          <span onClick={goToNextMonth} className="material-symbols-rounded">
            chevron_right
          </span>
        </div>
      </header>
      <div className="calendar">
        {showMonths && renderMonths()}
        {!showMonths && renderDates()}
      </div>
    </div>
  );
}

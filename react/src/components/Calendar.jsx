import { useEffect, useState } from "react";
import "../styles/calendar.css";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import TaskList from "./TaskList";
import Tooltip from "./tooltips/Tooltip";
import { toast } from "react-toastify";

export default function Calendar({ size }) {
  const currentDate = new Date();
  const months = generateMonths();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [layout, setLayout] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );

  const navigate = useNavigate();
  const calendarType = useLocation().pathname;

  const renderLayout = () => {
    switch (layout) {
      case "month":
        return renderCalendarByMonth();
        break;
      case "week":
        break;
      // break
      default:
        return renderCalendarByMonth();
    }
  };
  useEffect(() => {
    const modifiedCalendarType = calendarType.replace("/calendar/", "");
    setLayout(modifiedCalendarType);
  }, [calendarType]);

  // get tasks
  const getAllTasks = () => {
    axiosClient
      .get(`/calendar/calendar`)
      .then(({ data }) => {
        setAllTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error);
      });
  };
  const getTasksOfSelectedDay = () => {
    axiosClient
      .get(`/calendar/calendar/${convertDateSql(selectedDate)}`)
      .then(({ data }) => {
        setTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch tasks");
      });
  };
  useEffect(() => {
    getAllTasks();
    generateMonthDates();
  }, [year, month]);

  useEffect(() => {
    getTasksOfSelectedDay();
  }, [selectedDate]);

  // css togglers
  const getActiveDateClass = (date) => {
    const presentDate = new Date().toLocaleDateString();
    const modifiedDate = new Date(date).toLocaleDateString();
    if (presentDate === modifiedDate) {
      return "current-date";
    } else if (selectedDate === modifiedDate) {
      return "active";
    }
    return "";
  };

  //modify dates to match the mysql date format
  const modifyDateSql = (date) => {
    const modifiedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const modifiedDate = date.getDate().toString().padStart(2, "0");
    return `${year}-${modifiedMonth}-${modifiedDate}`;
  };

  const hasTasks = (date) => {
    const thisDate = modifyDateSql(date);
    if (allTasks.some((task) => task.date === thisDate)) {
      return "has-tasks";
    } else {
      return "";
    }
  };

  // go to next or prev month
  const goToNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const getPrevMonthDates = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
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
  const handleTaskClick = (taskId,event) => {
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

  const renderMonths = () => {
    return (
      <ul className="months animated fadeInDown">
        {months.map((month, index) => (
          <li
            onClick={() => handleMonthClick(month)}
            className="month animated fadeInDown"
            key={index}
          >
            {getMonthName(month)}
          </li>
        ))}
      </ul>
    );
  };

  const getDateTasks = (date) => {
    const modifiedDate = modifyDateSql(date);
    const filteredTasks = allTasks.filter((task) => task.date === modifiedDate);
    if (filteredTasks.length > 3) {
      return filteredTasks.slice(0, 3);
    } else {
      return filteredTasks;
    }
  };
  const renderDateTasks = (date) => {
    const dateTasks = getDateTasks(date);

    return (
      <div className="tasks-list">
        <ul>
          {dateTasks.map((task) => (
            <Tooltip
              classes="tooltip-task-description"
              key={task.id}
              tooltipVisible={openTooltipId === task.id}
              onVisibilityChange={handleActiveTaskState}
              content={
                <div>
                  <div className="tooltip-tools">
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
                      <path d="M9 8h2v9H9zm4 0h2v9h-2z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.8 2L12 10.8 4.8 6h14.4zM4 18V7.87l8 5.33 8-5.33V18H4z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                    </svg>
                  </div>
                  <div className="tooltip-task-title">
                    <h2>{task.title}</h2>
                    <p>
                      {task.date} ⋅ {task.time_start}-{task.time_end}
                    </p>
                  </div>
                  <div className="tooltip-task-additional">
                    {/* TODO: create notifications */}
                    <div className="tooltip-task-notification">
                      <svg
                        focusable="false"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
                      </svg>
                      <p>in 5 minutes before</p>
                    </div>

                    <div className="tooltip-task-owner">
                      <i className="fa fa-calendar"></i>
                      {task.user.name}
                    </div>
                  </div>
                </div>
              }
            >

              <li
                  className={`task-option 
                ${
                      openTooltipId &&
                      openTooltipId === task.id &&
                      isTooltipVisible &&
                      "task-active"
                  }
                `}
                  onClick={(event) => handleTaskClick(task.id, event)}
              >
                {`${task.title} ${task.time_start} ${task.time_end}`}
              </li>

            </Tooltip>
          ))}
        </ul>
      </div>
    );
  };

  const renderCalendarByMonth = () => {
    return (
      <div className="calendar-by-month-wrapper">
        <ol className="calendar-by-month-days">
          <li className="day-name">Mon</li>
          <li className="day-name">Tue</li>
          <li className="day-name">Wed</li>
          <li className="day-name">Thu</li>
          <li className="day-name">Fri</li>
          <li className="day-name">Sat</li>
          <li className="day-name">Sun</li>
        </ol>

        <ol className="calendar-by-month-dates">
          {dates.map((date, index) => (
            <Tooltip
              classes="tooltip-task-description"
              key={date}
              tooltipVisible={openTooltipId === date.toLocaleDateString()}
              onVisibilityChange={handleActiveTaskState}
              children={
                <li
                  className={`${getActiveDateClass(date)} date`}
                  onClick={() => handleTaskClick(date.toLocaleDateString())}
                  key={index}
                >
                  {date.getDate()}
                  {renderDateTasks(date)}
                </li>
              }
              content={
                <div>
                  <div className="tooltip-tools">
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
                      <path d="M9 8h2v9H9zm4 0h2v9h-2z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.8 2L12 10.8 4.8 6h14.4zM4 18V7.87l8 5.33 8-5.33V18H4z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                    </svg>
                  </div>
                  <div className="tooltip-task-title">
                    <h2>Create a new event </h2>
                    <p>
                      a new event
                    </p>
                  </div>
                  <div className="tooltip-task-additional">
                    {/* TODO: create notifications */}
                    <div className="tooltip-task-notification">
                      <svg
                        focusable="false"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
                      </svg>
                      <p>in 5 minutes before</p>
                    </div>

                    <div className="tooltip-task-owner">
                      <i className="fa fa-calendar"></i>
                    </div>
                  </div>
                </div>
              }
            />
          ))}
        </ol>
      </div>
    );
  };

  return (
    <div className={"calendar-wrapper " + size && size}>
      {size ? (
        <>
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
              <span
                onClick={goToNextMonth}
                className="material-symbols-rounded"
              >
                chevron_right
              </span>
            </div>
          </header>
          <div className="calendar">
            {showMonths && renderMonths()}
            {!showMonths && renderDates()}
          </div>
        </>
      ) : (
        renderLayout()
      )}
    </div>
  );

  //helper functions
  // get months
  function generateMonths() {
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  }

  // generate dates of the month
  function generateMonthDates() {
    if (!showMonths) {
      const currentMonthDates = [];
      const fullCalendarDates = 42;
      const firstDayOfMonth = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const previousMonthYear = month === 0 ? year - 1 : year;
      const previousMonth = month === 0 ? 11 : month - 1;
      const previousMonthDays = new Date(
        previousMonthYear,
        previousMonth + 1,
        0
      ).getDate();

      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;

      const startingDay = firstDayOfMonth.getDay();

      for (let i = startingDay - 1; i >= 0; i--) {
        const modifiedMonth =
          previousMonth < 9 ? "0" + (previousMonth + 1) : previousMonth + 1;
        const modifiedDate = previousMonthDays - i;
        const fullDate = `${previousMonthYear}-${modifiedMonth}-${modifiedDate}`;
        const fullDateObj = new Date(fullDate);
        currentMonthDates.push(fullDateObj);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        const modifiedMonth = month < 9 ? "0" + (month + 1) : month + 1;
        const modifiedDate = i < 10 ? "0" + i : i;
        const fullDate = `${year}-${modifiedMonth}-${modifiedDate}`;
        const fullDateObj = new Date(fullDate);
        currentMonthDates.push(fullDateObj);
      }
      let nextMonthDay = 0;

      for (let i = currentMonthDates.length; i < fullCalendarDates; i++) {
        const modifiedMonth =
          nextMonth < 9 ? "0" + (nextMonth + 1) : nextMonth + 1;
        nextMonthDay = nextMonthDay + 1;

        const fullDate = `${nextMonthYear}-${modifiedMonth}-${nextMonthDay}`;
        const fullDateObj = new Date(fullDate);
        currentMonthDates.push(fullDateObj);
      }
      setDates(currentMonthDates);
    }
  }
  function getLastDayOfMonth() {
    const nextMonthDate = new Date(year, month + 1, 1);
    nextMonthDate.setDate(nextMonthDate.getDate() - 1);
    return nextMonthDate.getDate();
  }
  // get month names
  function getMonthName(month) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  }

  function convertDateSql(date) {
    if (typeof date === "string" && date !== "") {
      const dateArr = date.split("/");
      const year = dateArr[2];
      const month = dateArr[0].padStart(2, "0");
      const day = dateArr[1].padStart(2, "0");
      const mysqlDate = `${year}-${month}-${day}`;

      return mysqlDate;
    }
  }
  // helper functions end
}

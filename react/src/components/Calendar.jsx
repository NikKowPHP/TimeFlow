import React, { useEffect, useState } from "react";
import "../styles/calendar.css";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import TaskList from "./TaskList";
import Tooltip from "./Tooltip";

export default function Calendar({ size }) {
  const currentDate = new Date();
  const months = generateMonths();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);
  const [startingDay, setStartingDay] = useState(null);

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
      case "week":
      //
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
        console.log(error);
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
      return "active current-date";
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
  const handleTaskClick = (taskId) => {
    setOpenTooltipId(taskId);
  }

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
          <ul>
            {dates.map((date, index) => (
              <li
                onClick={() => handleDateClick(date)}
                className={`${getActiveDateClass(date)} ${hasTasks(date)}`}
                key={index}
              >
                {date !== "" && date.getDate()}
              </li>
            ))}
          </ul>
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
            key={task.id}
              tooltipVisible={openTooltipId === task.id}
              children={
                <li onClick={() => handleTaskClick(task.id)}>
                  {`${task.title} ${task.time_start} ${task.time_end}`}
                </li>
              }
              content ={
                <li>
                  {`${task.title} ${task.time_start} ${task.time_end}`}
                </li>

              }
            />
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
            <li className={`${getActiveDateClass(date)} date`} key={index}>
              {date.getDate()}
              {renderDateTasks(date)}
            </li>
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
            {showDates && renderDates()}
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
      const nextMonthDays = new Date(nextMonthYear, nextMonth + 1, 0).getDate();

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
      setStartingDay(startingDay);
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

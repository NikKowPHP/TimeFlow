import React, { useEffect, useState } from "react";
import "../styles/calendar.css";
import axiosClient from "../axios-client";
import { useLocation, useNavigate } from "react-router-dom";
import TaskList from "./TaskList";

export default function Calendar({ size }) {
  const currentDate = new Date();
  const months = generateMonths();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showDates, setShowDates] = useState(false);

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
    const modifiedCalendarType = calendarType.replace("/calendar/");
    setLayout(modifiedCalendarType);
  }, [calendarType]);
  // get tasks
  const getTasks = () => {
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

  useEffect(() => {
    getAllTasks();
    generateMonthDates();
  }, [year, month]);
  useEffect(() => {
    if (selectedDate) getTasks();
  }, [selectedDate]);

  const convertDateSql = (date) => {
    const dateArr = date.split("/");
    const year = dateArr[2];
    const month = dateArr[0];
    const day = dateArr[1];
    const mysqlDate = `${year}-${month}-${day}`;

    return mysqlDate;
  };

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

  const hasTasks = (date) => {
    let modifiedMonth = month + 1;
    let modifiedDate = date;

    if (month < 10) {
      modifiedMonth = "0" + modifiedMonth;
    }
    if (date < 10) {
      modifiedDate = "0" + modifiedDate;
    }
    const thisDate = `${year}-${modifiedMonth}-${modifiedDate}`;
    if (allTasks.some((task) => task.date === thisDate)) {
      return "has-tasks";
    }
    return "";
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
  const handleDateClick = (event, date) => {
    const selectedDate = new Date(year, month, date).toLocaleDateString();
    setSelectedDate(selectedDate);
    navigate(`/calendar/${convertDateSql(selectedDate)}`);
    getTasks();
  };
  const handleMonthClick = (selectedMonth) => {
    setMonth(selectedMonth);
    setShowMonths(!showMonths);
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
          <ul>
            {dates.map((date, index) => (
                  <li
                    onClick={(ev) => handleDateClick(ev, date)}
                    className={`${getActiveDateClass(date)} ${hasTasks(date)}`}
                    key={index}
                  >
                    {date !== '' && date.getDate()}
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

  const getTasksOfDate = (date) => {
    let modifiedMonth = month + 1;
    let modifiedDate = date;

    if (month < 10) {
      modifiedMonth = "0" + modifiedMonth;
    }
    if (date < 10) {
      modifiedDate = "0" + modifiedDate;
    }
    const thisDate = `${year}-${modifiedMonth}-${modifiedDate}`;
    return tasks.map((task) => {
      task.date === date && task;
    });
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
            <li
              className={`${getActiveDateClass(date)} ${hasTasks(date)}`}
              key={index}
            >
              {date !== '' && date.getDate()}
              {getTasksOfDate(date)}
            </li>
          ))}
        </ol>
      </div>
    );
  };

  return (
    //TODO: MAKE A TOOLBAR AND TO ADJUST THE VIEW , PUSH CALENDAR TO NAVIGATION BAR AND SHOW THE TABLE OF DAYS
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
      const firstDayOfMonth = new Date(year, month, 1);
      const startingDay = firstDayOfMonth.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const currentMonthDates = [];
      for (let i = 1; i < startingDay; i++) {
        currentMonthDates.push("");
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const modifiedMonth = month < 9 ? "0" + (month + 1) : month + 1;
        const modifiedDate = i < 10 ? "0" + i : i;
        const fullDate = `${year}-${modifiedMonth}-${modifiedDate}`;
        const fullDateObj = new Date(fullDate);
        currentMonthDates.push(fullDateObj);
      }
      setDates(currentMonthDates);
    }
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
  // helper functions end
}

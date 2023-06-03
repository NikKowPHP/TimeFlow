import React, { useEffect, useState } from "react";
import "../styles/calendar.css";
import Task from "./Task";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";


import TaskList from "./TaskList";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());

  const currentDate = new Date();
  const months = generateMonths();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);

  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [showDates, setShowDates] = useState(false);

  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  const getTasks = () => {
    axiosClient
      .get(`/calendar/${convertDateSql(selectedDate)}`)
      .then(({ data }) => {
        setTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error);
      });
  };

  console.log(tasks);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    generateMonthDates();
  }, [year, month]);

  const convertDateJs = (date) => {
    const newDate = new Date(date.replace(/-/g, "/")).toLocaleDateString();
  };
  const convertDateSql = (date) => {
    const dateArr = date.split('/');
    console.log(dateArr);
    const year = dateArr[2];
    const month = dateArr[0];
    const day = dateArr[1];
    const mysqlDate = `${year}-${month}-${day}`;
    return mysqlDate;


  };



  const getActiveDateClass = (date) => {
    const presentDate = new Date().toLocaleDateString();
    date = date.toLocaleDateString();
    if( presentDate === date) {
      return 'active current-date';
    } else if(selectedDate === date) {
      return 'active';
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
  const handleDateClick = (event, date) => {
    const selectedDate = new Date(year, month, date).toLocaleDateString();
    setSelectedDate(selectedDate);
    navigate(`/calendar/${convertDateSql(selectedDate)}`);
    


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


  const renderDates = () => {
    return (
      <>
        <ul className="weeks animated fadeInDown">
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
          <li>Sun</li>
        </ul>
        <div className="days animated fadeInDown">
          <ul>
            {dates.map((date, index) => (
              <li
                onClick={(ev) => handleDateClick(ev, date)}
                className={getActiveDateClass(new Date(year,month,date))}
                key={index}
              >
                {date}
              </li>
            ))
            
            }
          </ul>
        </div>
          {selectedDate && (
            <TaskList selectedDate={selectedDate}  />
          )
  }
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
        {showDates && renderDates()}
        {!showMonths && renderDates()}
      </div>
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
  function generateMonthDates()  {
    if (!showMonths) {
      const firstDayOfMonth = new Date(year, month, 1);
      const startingDay = firstDayOfMonth.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const currentMonthDates = [];
      for (let i = 1; i < startingDay; i++) {
        currentMonthDates.push("");
      }

      for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDates.push(i);
      }
      setDates(currentMonthDates);
    } else {
    }
  };
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
  };
  // helper functions end
}
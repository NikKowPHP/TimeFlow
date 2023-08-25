import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCalendarApiContext } from "../Calendar/CalendarApiContext";
import { calendarUtils } from "../../utils/calendarUtils.js";

/**
 * useCalendarState Hook
 * 
 * This hook manages the state and behavior of a calendar.
 * 
 * @returns {object} - An object containing calendar state and functions.
 * @property {Date} currentDate - represents the current date.
 * @property {number} year - represents the current year.
 * @property {number} month - represents the current month.
 * @property {Date[]} dates - contains dates of current month which are dynamically filled.
 * @property {string} selectedDate - contains the user's selected date in 'YYYY-MM-DD' format.
 * @property {string} layout - represents layout of the calendar ('month', 'week', 'agenda').
 * @function goToNextMonth - Function to navigate to the next month.
 * @function goToPrevMonth - Function to navigate to the previous month.
 * @function fetchTasksAndGenerateDates - Function to fetch tasks and generate dates for the current month.
 * @function fetchTasks - Function to fetch tasks for the selected date.
 * 
 */
export function useCalendarState() {

	// State for current date
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Select calendar layout
  const [layout, setLayout] = useState('month');

  // Use the useCalendarApi hook to access the functions
  const { allTasks, getAllTasks, loading } = useCalendarApiContext();

  // Fetch tasks when component mounts
  useEffect(() => {
    getAllTasks();
  }, []);


  // Refresh list of tasks
  const refreshTasks = () => {
    getAllTasks();
  }

  // Get url pathname
  const calendarLayout = useLocation().pathname;

  // Set layout depending on the current url 
  useEffect(() => {
    const calendarType = calendarLayout.replace('/calendar/', '');
    setLayout(calendarType);
  }, [calendarLayout])

  // // Fetch tasks for the selected date
  // useEffect(() => {
  //     fetchTasks(selectedDate);
  // }, [selectedDate]);

  // Fetch tasks and generate month dates on year and month change
  useEffect(() => {
    fetchTasksAndGenerateDates();
  }, [year, month]);

  // // Function to fetch tasks for the selected date
  // const fetchTasks = (date) => {
  //   getTasksOfSelectedDay(date);
  // }

  // Function to fetch tasks and generate month dates
  const fetchTasksAndGenerateDates = () => {
    getAllTasks();
    setDates(calendarUtils().generateMonthDates(year, month));
  }

  // Function to calculate the next month
  const goToNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  // Function to calculate the previous month
  const goToPrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

	return {
		year,
		setYear,
		month,
		setMonth,
		goToNextMonth,
		goToPrevMonth,
		dates,
		setDates,
		layout,
		setLayout,
		selectedDate,
		setSelectedDate,
    currentDate,
    allTasks,
    refreshTasks,
    loading,
	};
}
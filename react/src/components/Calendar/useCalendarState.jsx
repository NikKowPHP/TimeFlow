import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCalendarApiContext } from "./CalendarApiContext";
import { calendarUtils } from "./calendarUtils.js";

export function useCalendarState() {

	// State for current date
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);
  const [openTooltipId, setOpenTooltipId] = useState(null);

  const [layout, setLayout] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Use the useCalendarApi hook to access the functions
  const { getAllTasks, getTasksOfSelectedDay } = useCalendarApiContext();

  // Get url pathname
  const calendarLayout = useLocation().pathname;

  // Set layout depending on the current url 
  useEffect(() => {
    const calendarType = calendarLayout.replace('/calendar/', '');
    setLayout(calendarType);
  }, [calendarLayout])

  // Fetch tasks for the selected date
  useEffect(() => {
      fetchTasks(selectedDate);
  }, [selectedDate]);

  // Fetch tasks and generate month dates on year and month change
  useEffect(() => {
    fetchTasksAndGenerateDates();
  }, [year, month]);

  // Function to fetch tasks for the selected date
  const fetchTasks = (date) => {
    getTasksOfSelectedDay(date);
  }

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
		openTooltipId,
		setOpenTooltipId,
		layout,
		setLayout,
		selectedDate,
		setSelectedDate,
    currentDate
	};
}
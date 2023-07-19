import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCalendarApi } from "./CalendarApiContext";
import { generateMonthDates } from "./calendarUtils.js";

export function useCalendarState() {

	// State for current date 
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState(null);

  const [layout, setLayout] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );

  // Use the useCalendarApi hook to access the functions
  const {allTasks, getAllTasks, getTasksOfSelectedDay } = useCalendarApi();

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
    generateMonthDates(year, month);
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
		isTooltipVisible,
		setIsTooltipVisible,
		openTooltipId,
		setOpenTooltipId,
		layout,
		setLayout,
		selectedDate,
		setSelectedDate,
	};
}
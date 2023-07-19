import { useState, useEffect } from "react";
  const currentDate = new Date();

	// current date
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [dates, setDates] = useState([]);

  const months = generateMonths();

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState(null);


  const [layout, setLayout] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );

  const navigate = useNavigate();
  const calendarType = useLocation().pathname;


	
  useEffect(() => {
    const modifiedCalendarType = calendarType.replace("/calendar/", "");
    setLayout(modifiedCalendarType);
  }, [calendarType]);

  useEffect(() => {
    getTasksOfSelectedDay();
  }, [selectedDate]);

  // get tasks
  useEffect(() => {
    getAllTasks();
    generateMonthDates();
  }, [year, month]);
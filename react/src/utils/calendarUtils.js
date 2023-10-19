import { dateUtils } from "./dateUtils";

/**
 *
 * @returns {object} - An object containing calendar utility functions.
 * @property {function} getActiveDateClass - Determines the appropriate CSS class for a given date based on the current date and the selected date.
 * @property {function} generateMonths - Generates an array of month indices (0 to 11) representing the months of the year.
 * @property {function} generateMonthDates - Generates an array of dates for the specified month and year to fill the calendar grid.
 * @property {function} getMonthName - Returns the name of the month based on the month index.
 */
export function calendarUtils() {
  const { convertDateSql } = dateUtils();

  // Checks if a given date is the current date or the selected date and returns the appropriate class
  function getActiveDateClass(date, presentDate, selectedDate) {
    const modifiedDate = date instanceof Date ? date.toLocaleDateString() : "";
    const presentDateModified =
      presentDate instanceof Date ? presentDate.toLocaleDateString() : "";

    let selectedDateModified = selectedDate;
    if (selectedDate) {
      selectedDateModified = selectedDate.toLocaleDateString();
    }
    if (presentDateModified === modifiedDate) {
      return "current-date";
    } else if (selectedDateModified === modifiedDate) {
      return "selected-date";
    }
    return "";
  }

  function replaceUnderscoresWithSpaces(inputString) {
    return inputString.replace(/_/g, " ");
  }

  // Generates an array of month indices (0 to 11) representing the months of the year.
  function generateMonths() {
    const months = [];

    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  }

  // Generates an array of dates for the specified month and year to fill the calendar grid
  function generateMonthDates(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();
    // COMMIT: Resolve issue with displaying first day of month 'sunday';

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const fullCalendarDates = startingDay === 0 ? 42 : 35;

    const previousMonthYear = month === 0 ? year - 1 : year;
    const previousMonth = month === 0 ? 11 : month - 1;
    const previousMonthDays = new Date(
      previousMonthYear,
      previousMonth + 1,
      0
    ).getDate(); // previous month's dates quantity;

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    const currentMonthDates = [];

    const datesFromPreviousMonth = startingDay === 0 ? 6 : startingDay - 1;

    // Generates dates from the previous month
    for (
      let i = previousMonthDays - datesFromPreviousMonth + 1;
      i <= previousMonthDays;
      i++
    ) {
      const modifiedMonth =
        previousMonth < 9 ? "0" + (previousMonth + 1) : previousMonth + 1;
      const modifiedDate = i < 10 ? "0" + i : i;
      const fullDate = `${previousMonthYear}-${modifiedMonth}-${modifiedDate}`;
      const fullDateObj = new Date(fullDate);
      currentMonthDates.push(fullDateObj);
    }

    // Generates dates from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const modifiedMonth = month < 9 ? "0" + (month + 1) : month + 1;
      const modifiedDate = i < 10 ? "0" + i : i;
      const fullDate = `${year}-${modifiedMonth}-${modifiedDate}`;
      const fullDateObj = new Date(fullDate);
      currentMonthDates.push(fullDateObj);
    }

    // Generates dates from the next month
    let nextMonthDay = 0;
    for (let i = currentMonthDates.length; i < fullCalendarDates; i++) {
      const modifiedMonth =
        nextMonth < 9 ? "0" + (nextMonth + 1) : nextMonth + 1;
      nextMonthDay = nextMonthDay + 1;
      const fullDate = `${nextMonthYear}-${modifiedMonth}-${nextMonthDay}`;
      const fullDateObj = new Date(fullDate);
      currentMonthDates.push(fullDateObj);
    }

    return currentMonthDates;
  }

  // Function to get the current week dates array based on the current date
  const getCurrentWeekDates = (dates, currentDate) => {
    const weeks = 5; // Is always 5 weeks based on the type of the calendar
    let currentWeekIndex = -1; // Initialize with an invalid value
    let currentWeekDates = [];
    // Find the week index of the current date
    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      const startIndex = weekIndex * 7;
      const endIndex = startIndex + 7;
      const weekDates = dates.slice(startIndex, endIndex);
      console.log(dates);
      if (
        weekDates.some(
          (date) => date.toDateString() === currentDate.toDateString()
        )
      ) {
        currentWeekIndex = weekIndex;
      }
      if (currentWeekIndex !== -1) {
        const startIndex = currentWeekIndex * 7;
        const endIndex = startIndex + 7;
        currentWeekDates = dates.slice(startIndex, endIndex);
      }
    }
    return currentWeekDates;
  };

  // Generates the array of month numbers (0-11) representing january - december.
  function generateMonthNumbers() {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  }

  // Returns the name of the month based on the month index
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

  // Function to convert time to 'HH:mm' 24 hour format
  const convertTime = (time) => {
    return time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const convertTimePeriod = (startTime, endTime) => {
    const startTimeString = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTimeString = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startTimeString}-${endTimeString}`;
  };

  //TODO: change to the full name e.g. 'mon'-> monday and then slice it where it is needed
  const weekDays = () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDayName = (dayIndex) => {
    return weekDays()[dayIndex];
  };
  function formatDateToDDMonDay(dateStr) {
    const date = new Date(dateStr);

    const month = getMonthName(date.getUTCMonth()).substring(0,3);
    const dayOfMonth = date.getUTCDate();
    const dayOfWeek = getDayName(date.getUTCDay());

    return `${dayOfMonth} ${month}, ${dayOfWeek}`;
  }

  const convertHour = (hour) => {
    const date = new Date();
    date.setHours(hour);
    const options = {
      hour: "numeric",
      hour12: true,
    };
    return date.toLocaleTimeString(undefined, options);
  };

  const generateHoursOfDay = () => {
    const hoursOfDay = [];
    for (let i = 1; i <= 24; i++) {
      hoursOfDay.push(i);
    }
    return hoursOfDay;
  };

  const convertDateToTime = (dateObject) => {
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  function getDateActiveClass(date, currentDate, selectedDate) {
    return "date " + getActiveDateClass(date, currentDate, selectedDate);
  }
  /**
   * Toggles active class for tasks in modal
   * @param {integer} taskId - ID of the task
   * @returns {any}
   */
  const toggleTaskActiveClass = (taskId, openedModalId, isModalVisible) => {
    return (
      openedModalId &&
      openedModalId === taskId &&
      isModalVisible &&
      "task-active"
    );
  };

  /**
   * Determines whether a cell has been clicked on the first half of the cell or not based on the clickedHalf state variable.
   * @returns {string} - A string indicating whether the cell is clicked on the first half ("first-half") or second half ("second-half") or neither ("").
   */
  const getCellHalfClassName = (clickedHalf) => {
    switch (clickedHalf) {
      case "first":
        return "first-half";
      case "second":
        return "second-half";
      default:
        return "";
    }
  };

  /**
   * Initiates a default new task state based on selected time and date and sets state.
   * @param {Date} timeStart - represents starting time.
   * @param {Date} timeEnd - represents ending time.
   * @param {Date} clickedDate - represents the clicked date.
   */
  const initiateNewTask = (timeStartObj, timeEndObj, clickedDate) => {
    const formattedTimeStart = convertDateToTime(timeStartObj);

    const formattedTimeEnd = convertDateToTime(timeEndObj);

    const formattedDate = convertDateSql(clickedDate.toLocaleDateString());

    return {
      id: null,
      title: "",
      time_start: formattedTimeStart,
      time_end: formattedTimeEnd,
      date: formattedDate,
      notification_preference: null,
    };
  };

  /**
   * Calculates the height of a task in pixels based on its start and end times.
   * @param {string} taskTimeStart - The start time of the task.
   * @param {string} taskTimeEnd - The end time of the task.
   * @returns {Object} CSS style object with the calculated height.
   */
  const calculateTaskHeight = (taskTimeStart, taskTimeEnd) => {
    const startTimestamp = new Date(`2000-01-01 ${taskTimeStart}`);
    const endTimestamp = new Date(`2000-01-01 ${taskTimeEnd}`);
    const taskDurationMinutes = (endTimestamp - startTimestamp) / 60000;
    const cellTimeAvailableMinutes = 60;
    const heightRatio = taskDurationMinutes / cellTimeAvailableMinutes;
    const cellHeight = 64.83;
    const taskHeight = cellHeight * heightRatio;
    const top = taskTimeStart.includes("30") ? "-65px" : "-100px";
    return {
      top: top,
      height: `${taskHeight}px`,
    };
  };

  /**
   * Filters allTasks array to extract specific tasks based on date and hour.
   * @param {string} convertedDate - The convertedDate in format 'yyyy-mm-dd'
   * @param {string} convertedHourIndex - The convertedHourIndex in format 'h'.
   * @returns {Array} - An array of task objects that correspond to the filter criteria.
   */
  const filterTasksForDateAndHour = (
    convertedDate,
    convertedHourIndex,
    allTasks
  ) => {
    return (
      allTasks &&
      allTasks.filter((task) => {
        const slicedTaskTime = task.time_start.split(":")[0];
        return (
          task.date === convertedDate && slicedTaskTime === convertedHourIndex
        );
      })
    );
  };
  const defineClickedHalf = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickedY = e.clientY - rect.top;
    const cellHeight = rect.height;
    return clickedY < cellHeight / 2 ? "first" : "second";
  };

  const modifyStartEndTime = ({ hour, date, clickedHalf }) => {
    let startHour = hour;
    let endHour = hour + 1;
    if (clickedHalf === "second") {
      startHour += 0.5;
      endHour += 0.5;
    }
    // Convert decimal fractions to minutes
    const startMinutes = Math.floor((startHour % 1) * 60);
    const endMinutes = Math.floor((endHour % 1) * 60);

    const startTime = new Date(date);
    const endTime = new Date(date);
    startTime.setHours(Math.floor(startHour), startMinutes, 0, 0);
    endTime.setHours(Math.floor(endHour), endMinutes, 0, 0);
    return { startTime: startTime, endTime: endTime };
  };

  return {
    getActiveDateClass,
    generateMonths,
    generateMonthDates,
    generateMonthNumbers,
    getMonthName,
    getCurrentWeekDates,
    weekDays,
    convertHour,
    generateHoursOfDay,
    convertTimePeriod,
    convertTime,
    convertDateToTime,
    getDayName,
    getDateActiveClass,
    toggleTaskActiveClass,
    getCellHalfClassName,
    initiateNewTask,
    calculateTaskHeight,
    filterTasksForDateAndHour,
    defineClickedHalf,
    modifyStartEndTime,
    replaceUnderscoresWithSpaces,
    formatDateToDDMonDay,
  };
}

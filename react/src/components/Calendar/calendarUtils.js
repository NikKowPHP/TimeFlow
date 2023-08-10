/**
 *
 * @returns {object} - An object containing calendar utility functions.
 * @porperty {function} getActiveDateClass - Determines the appropriate CSS class for a given date based on the current date and the selected date.
 * @porperty {function} generateMonths - Generates an array of month indices (0 to 11) representing the months of the year.
 * @property {function} generateMonthDates - Generates an array of dates for the specified month and year to fill the calendar grid.
 * @property {function} getMonthName - Returns the name of the month based on the month index.
 */
export function calendarUtils() {
  // checks if a given date is the current date or the selected date and returns the appropriate class
  function getActiveDateClass(date, presentDate, selectedDate) {
    const modifiedDate = new Date(date).toLocaleDateString();
    const presentDateModified = presentDate.toLocaleDateString();
    let selectedDateModified = selectedDate;
    if (selectedDate) {
      selectedDateModified = selectedDate.toLocaleDateString();
    }
    if (presentDateModified === modifiedDate) {
      return "current-date";
    } else if (selectedDateModified === modifiedDate) {
      return "date-active";
    }
    return "";
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
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const fullCalendarDates = 42;

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

    const currentMonthDates = [];

    // Generates dates from the previous month
    for (let i = startingDay - 2; i >= 0; i--) {
      const modifiedMonth =
        previousMonth < 9 ? "0" + (previousMonth + 1) : previousMonth + 1;
      const modifiedDate = previousMonthDays - i;
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
		const weeks = 6; // Is always 6 weeks based on the type of the calendar
		let currentWeekIndex = -1; // Initialize with an invalid value
		let currentWeekDates = [];
		
		// Find the week index of the current date
		for (let weekIndex = 0; weekIndex < weeks; weekIndex++){
			const startIndex = weekIndex * 7;
			const endIndex = startIndex + 7;
			const weekDates = dates.slice(startIndex, endIndex);
			if(weekDates.some(date => date.toDateString() === currentDate.toDateString())) {
				currentWeekIndex = weekIndex;
			}
			if(currentWeekIndex !== -1) {
				const startIndex = currentWeekIndex * 7;
				const endIndex = startIndex + 7;
				currentWeekDates = dates.slice(startIndex, endIndex);
			}
		}
			return currentWeekDates;
  }

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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  }


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

  const weekDays = () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


  const convertHour = (hour) => {
    const date = new Date();
    date.setHours(hour);
    const options = {
      hour: 'numeric',
      hour12: true
    };
    return date.toLocaleTimeString(undefined, options );
  }


  const generateHoursOfDay = () => {
    const hoursOfDay = [];
    for (let i = 1; i <= 24; i++) {
      hoursOfDay.push(i);
    }
    return hoursOfDay;
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
    convertTimePeriod
  };
}

import { createContext, useContext, useState } from "react";
import axiosClient from "../../axios-client";

const CalendarApiContext = createContext({
  allTasks: [],
  dayTasks: [],
  setAllTasks: () => {},
  setDayTasks: () => {},
  getAllTasks: () => {},
  getTasksOfSelectedDay: () => {},
});

export function CalendarApiProvider({ children }) {
  const [allTasks, setAllTasks] = useState([]);
  const [dayTasks, setDayTasks] = useState([]);

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
  const getTasksOfSelectedDay = (selectedDate) => {
    axiosClient
      .get(`/calendar/calendar/${selectedDate}`)
      .then(({ data }) => {
        setDayTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch tasks");
      });
  };

  const calendarApiValue = {
    allTasks,
    dayTasks,
    setAllTasks,
    setDayTasks,
    getAllTasks,
    getTasksOfSelectedDay,
  };

  return (
    <CalendarApiContext.Provider value={calendarApiValue}>
      {children}
    </CalendarApiContext.Provider>
  );
}

export const useCalendarApiContext = () => useContext(CalendarApiContext);

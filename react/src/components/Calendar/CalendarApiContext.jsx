import { createContext, useContext, useState } from "react";
import axiosClient from "../../axios-client";

const CalendarApiContext =  createContext();

export function useCalendarApi() {
  return useContext(CalendarApiContext);
}

export function CalendarApiProvider({children}) {

  const [allTasks, setAllTasks] = useState([]);

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
        setTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch tasks");
      });
  };

  const calendarApiValue = {
    allTasks,
    getAllTasks,
    getTasksOfSelectedDay,
  }

  return (
    <CalendarApiContext.Provider value={calendarApiValue}>
      {children}
    </CalendarApiContext.Provider>
  )

}



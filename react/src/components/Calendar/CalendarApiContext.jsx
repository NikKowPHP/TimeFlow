import { createContext, useContext, useState } from "react";
import axiosClient from "../../axios-client";

/**
 * Calendar API Context
 *
 * This context provides access to the calendar-related data and functions using React's Context API.
 *
 * @typedef {object} calendarApiValue
 * @property {Array} allTasks - An array containing all tasks.
 * @property {Array} dayTasks - An array containing all tasks of the selected day.
 * @property {function} setAllTasks - A function to update the allTasks state.
 * @property {function} setDayTasks - A function to update the dayTasks state.
 * @property {function} getAllTasks - A function to fetch all tasks from the API and update the allTasks state.
 * @property {function} getTasksOfSelectedDay - A function to fetch tasks of the selected date from the API and update the dayTasks state.
 */

const CalendarApiContext = createContext({
  allTasks: [],
  dayTasks: [],
  setAllTasks: () => {},
  setDayTasks: () => {},
  getAllTasks: () => {},
  getTasksOfSelectedDay: () => {},
});

/**
 * Calendar API Provider Component
 *
 * The CalendarApiProvider is a wrapper component that provides the CalendarApiContext to its child components.
 * It also contains the state and functions related to calendar data management.
 *
 * @param {object} props - The props for the CalendarApiProvider component.
 * @param {React.ReactNode} props.children - The child components wrapped by the CalendarApiProvider.
 * @returns {React.ReactNode} - The JSX element representing the wrapped child components.
 */

export function CalendarApiProvider({ children }) {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks from the API and update the allTasks state.
  const getAllTasks = () => {
    setLoading(true);
    axiosClient
      .get(`/calendar/calendar/`)
      .then(({ data }) => {
        setAllTasks(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        console.log(error);
      });
  };
  // The value provided by the context that will be accessible by child components
  const calendarApiValue = {
    allTasks,
    setAllTasks,
    getAllTasks,
    loading,
  };

  return (
    <CalendarApiContext.Provider value={calendarApiValue}>
      {children}
    </CalendarApiContext.Provider>
  );
}

/**
 * Hook to Access Calendar API Context
 *
 * This hook provides easy access to the CalendarApiContext.
 *
 * @returns {CalendarApiValue} - The context value containing calendar-related data and functions.
 *
 */
export const useCalendarApiContext = () => useContext(CalendarApiContext);

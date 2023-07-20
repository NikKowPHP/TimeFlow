import { createContext, useContext } from "react";

const CalendarApiFunctionsContext = createContext();

export function useCalendarApiFunctions() {
  return useContext(CalendarApiFunctionsContext);
}

export default CalendarApiFunctionsContext;
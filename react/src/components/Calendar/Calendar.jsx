import "../../styles/calendar.css";
import { useCalendarState } from "../customHooks/useCalendarState";
import CalendarMonthly from "./CalendarMonthly/CalendarMonthly";
import CalendarWeekly from "./CalendarWeekly";
import CalendarAgenda from "./CalendarAgenda";
import { CalendarApiProvider } from "./CalendarApiContext";

/**
 * Calendar component is responsible for displaying the calendar layout based on the selected "layout" value.
 * It uses the useCalendarState hook to manage the calendar's state and fetch data from the API.
 *
 * @returns {JSX.Element} The JSX representation of the Calendar component.
 */

export function Calendar() {
  // Destructure state and functions from the useCalendarState hook
  const {
    layout = "month",
    dates,
    selectedDate,
    getAllTasks,
    currentDate,
  } = useCalendarState();

  // Determine the appropriate layout component based on the "layout" state
  let CalendarLayoutComponent;
  if (layout === "week") {
    CalendarLayoutComponent = CalendarWeekly;
  } else if (layout === "agenda") {
    CalendarLayoutComponent = CalendarAgenda;
  } else {
    CalendarLayoutComponent = CalendarMonthly;
  }

  return (
    // Wrap the selected layout component with the CalendarApiProvider for API context sharing
    <CalendarApiProvider>
        <CalendarLayoutComponent
          dates={dates}
          selectedDate={selectedDate}
          getAllTasks={getAllTasks}
          currentDate={currentDate}
        />
    </CalendarApiProvider>
  );
}

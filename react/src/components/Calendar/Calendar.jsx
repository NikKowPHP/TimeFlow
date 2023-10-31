import "../../styles/calendar.css";
import { useCalendarState } from "../customHooks/useCalendarState";
import CalendarMonthly from "./CalendarMonthly/CalendarMonthly";
import CalendarWeekly from "./CalendarWeekly";
import CalendarAgenda from "./CalendarAgenda";
import { CalendarApiProvider } from "./CalendarApiContext";
import { Provider, connect  } from "react-redux";
import { selectDate, clickCell } from "../../redux/actions/calendarActions";
import store from "../../redux/store";

/**
 * Calendar component is responsible for displaying the calendar layout based on the selected "layout" value.
 * It uses the useCalendarState hook to manage the calendar's state and fetch data from the API.
 *
 * @returns {JSX.Element} The JSX representation of the Calendar component.
 */

export function Calendar({
  // layout = "month",
  // dates,
  selectedDate,
  selectDate,
  clickedCellIndex,
  clickCell,
}) {
  // Destructure state and functions from the useCalendarState hook
  const {
    layout = "month",
    dates,
    //   selectedDate,
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
    <Provider store={store}>
      <CalendarApiProvider>
        <CalendarLayoutComponent
          dates={dates}
          getAllTasks={getAllTasks}
          currentDate={currentDate}
          selectedDate={selectedDate}
          selectDate={selectDate}
          clickCell={clickCell}
          clickedCellIndex={clickedCellIndex}
        />
      </CalendarApiProvider>
    </Provider>
  );
}
const mapStateToProps = (state) => ({
  layout: state.calendar.layout,
  dates: state.calendar.selectedDate,
  currentDate: state.calendar.currentDate,
  selectedDate: state.calendar.selectedDate,
  clickedCellIndex: state.calendar.clickedCellIndex,
});

const mapDispatchToProps = {
  selectDate,
  clickCell,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);

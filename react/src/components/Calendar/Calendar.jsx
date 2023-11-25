import "../../styles/calendar.css";
import CalendarMonthly from "./CalendarMonthly/CalendarMonthly";
import CalendarWeekly from "./CalendarWeekly";
import CalendarAgenda from "./CalendarAgenda";
import {
  clickCell,
  selectDate,
  setMonth,
  setYear,
  setMonthDates,
  setLayout,
} from "../../redux/actions/calendarActions";

import {
  fetchTasks,
  setNewTask,
  updateTasks,
  deleteTask,
} from "../../redux/actions/taskActions";
import { connect, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLocationState } from "../customHooks/useLocationState";
import { calendarUtils } from "../../utils/calendarUtils";
import { useStateContext } from "../../contexts/ContextProvider";

/**
 * Calendar component is responsible for displaying the calendar layout based on the selected "layout" value.
 * It uses the useCalendarState hook to manage the calendar's state and fetch data from the API.
 *
 * @returns {JSX.Element} The JSX representation of the Calendar component.
 */

function Calendar({
  year,
  month,
  layout,
  dates,
  allTasks,
  selectedDate,
  currentDate,
  clickedCellIndex,
  loading,
  setNewTask,
  newTask,
  deleteTask,
  isMobileLayout,
}) {
  const dispatch = useDispatch();
  const { user } = useStateContext();
  const { currentLocation } = useLocationState();
  const { getCurrentPath, setActualLayout } = calendarUtils();

  useEffect(() => {
    dispatch(setNewTask({ user_id: user?.id }));
  }, [user]);
  useEffect(() => {
    const currentUrlPath = getCurrentPath(currentLocation);
    setActualLayout(currentUrlPath, layout, dispatch, setLayout);
  }, [currentLocation]);

  useEffect(() => {
    dispatch(setMonthDates(year, month));
    dispatch(fetchTasks());
  }, [dispatch, year, month]);

  // Determine the appropriate layout component based on the "layout" state
  let CalendarLayoutComponent;
  if (layout === "week") {
    CalendarLayoutComponent = CalendarWeekly;
  } else if (layout === "agenda") {
    CalendarLayoutComponent = CalendarAgenda;
  } else {
    CalendarLayoutComponent = CalendarMonthly;
  }

  // Wrap the selected layout component with the CalendarApiProvider for API context sharing

  return (
    <CalendarLayoutComponent
      user={user}
      dispatch={dispatch}
      dates={dates}
      allTasks={allTasks}
      year={year}
      layout={layout}
      month={month}
      currentDate={currentDate}
      selectedDate={selectedDate}
      selectDate={selectDate}
      clickCell={clickCell}
      clickedCellIndex={clickedCellIndex}
      loading={loading}
      setMonth={setMonth}
      setYear={setYear}
      setNewTask={setNewTask}
      newTask={newTask}
      updateTasks={updateTasks}
      deleteTask={deleteTask}
      isMobileLayout={isMobileLayout}
    />
  );
}

const mapStateToProps = (state) => ({
  layout: state.calendar.layout,
  dates: state.calendar.dates,
  year: state.calendar.year,
  month: state.calendar.month,
  currentDate: state.calendar.currentDate,
  selectedDate: state.calendar.selectedDate,
  clickedCellIndex: state.calendar.clickedCellIndex,
  allTasks: state.tasks.allTasks,
  loading: state.tasks.loading,
  error: state.tasks.error,
  newTask: state.tasks.newTask,
  isMobileLayout: state.app.isMobileLayout
});

const mapDispatchToProps = {
  selectDate,
  clickCell,
  setMonth,
  setYear,
  fetchTasks,
  setMonthDates,
  setLayout,
  setNewTask,
  updateTasks,
  deleteTask
};
export default connect(mapStateToProps, mapDispatchToProps)(Calendar);

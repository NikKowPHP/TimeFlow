import "../../styles/calendar.css";
import { useCalendarState } from "./useCalendarState";
import CalendarMonthly from "./CalendarMonthly";
import CalendarWeekly from "./CalendarWeekly";
import CalendarAgenda from "./CalendarAgenda";
import { CalendarApiProvider } from "./CalendarApiContext";

export function Calendar() {
  const {
    layout = "month",
    dates,
    openTooltipId,
    setOpenTooltipId,
    setIsTooltipVisible,
    selectedDate,
    getAllTasks,
    getTasksOfSelectedDay,
  } = useCalendarState();

  const handleTaskClick = (taskId, event) => {
    console.log(taskId);
    event && event.stopPropagation();
    setOpenTooltipId(taskId);
  };

  const handleActiveTaskState = (newState) => {
    setIsTooltipVisible(newState);
  };

  let CalendarLayoutComponent;
  if (layout === "week") {
    CalendarLayoutComponent = CalendarWeekly;
  } else if (layout === "agenda") {
    CalendarLayoutComponent = CalendarAgenda;
  } else {
    CalendarLayoutComponent = CalendarMonthly;
  }

  return (
    <CalendarApiProvider>
        <CalendarLayoutComponent
          dates={dates}
          openTooltipId={openTooltipId}
          selectedDate={selectedDate}
          handleTaskClick={handleTaskClick}
          handleActiveTaskState={handleActiveTaskState}
          getAllTasks={getAllTasks}
        />
    </CalendarApiProvider>
  );
}

import { useCalendarState } from "./useCalendarState";
import CalendarMonthly from "./CalendarMonthly";
import CalendarWeekly from "./CalendarWeekly";
import CalendarAgenda from "./CalendarAgenda";

export function Calendar() {
  const { layout = "month", dates, openTooltipId, selectedDate} = useCalendarState();

  let CalendarLayoutComponent;
  if(layout === "week") {
    CalendarLayoutComponent = CalendarWeekly;
  } else if (layout === "agenda") {
    CalendarLayoutComponent = CalendarAgenda;
  } else {
    CalendarLayoutComponent = CalendarMonthly;
  }

	return (
    <CalendarLayoutComponent
      dates={dates}
      openTooltipId={openTooltipId}
      selectedDate={selectedDate}
    />
  )

}
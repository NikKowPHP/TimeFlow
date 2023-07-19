import { layout } from "./useCalendarState";
export function Calendar() {

	  const renderCalendarLayout = () => {
    switch (layout) {
      case "month":
        return (
          <CalendarMonthly
            dates={dates}
            openTooltipId={openTooltipId}
            handleActiveTaskState={handleActiveTaskState}
          />
        );
      case "week":
        break;
      default:
        return (
          <CalendarMonthly
            dates={dates}
            openTooltipId={openTooltipId}
            handleActiveTaskState={handleActiveTaskState}
          />
        );
    }
  };

	return({renderCalendarLayout});

}
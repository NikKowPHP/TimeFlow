import { createSelector } from "@reduxjs/toolkit";
import { selectDate, clickCell, resetSelectedDate } from "../actions/calendarActions";

const selectCalendarState = (state) => state.calendar;
export const selectCalendarData = createSelector(
  selectCalendarState,
  (calendar) => ({
    selectedDate: calendar.selectedDate,
    clickedCellIndex: calendar.clickedCellIndex,
    dates: calendar.dates,
    month: calendar.month,
  })
);
export const calendarActions = {
	selectDate,
	clickCell,
  resetSelectedDate,
}

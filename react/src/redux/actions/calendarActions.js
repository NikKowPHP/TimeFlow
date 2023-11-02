import { calendarUtils } from "../../utils/calendarUtils";
import {
  SELECT_DATE,
  SET_DATES,
  CLICK_CELL,
  RESET_SELECTED_DATE,
  SET_YEAR,
  SET_MONTH,
} from "./actionTypes";

export const selectDate = (date) => ({
  type: SELECT_DATE,
  payload: date,
});
export const clickCell = (index) => ({
  type: CLICK_CELL,
  payload: index,
});
export const resetSelectedDate = () => ({
  type: RESET_SELECTED_DATE,
});
export const setYear = (year) => ({
  type: SET_YEAR,
  payload: year,
});
export const setMonth = (month) => ({
  type: SET_MONTH,
  payload: month,
});
export const setMonthDates = (year, month) => (dispatch) => {
  const dates = calendarUtils().generateMonthDates(year, month);
  dispatch({
    type: SET_DATES,
    payload: dates,
  });
};

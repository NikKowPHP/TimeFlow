export const SET_ALL_TASKS = "SET_ALL_TASKS";
export const SELECT_DATE = "SELECT_DATE";
export const CLICK_CELL = "CLICK_CELL";
export const RESET_SELECTED_DATE = "RESET_SELECTED_DATE";
export const SET_LOADING = "SET_LOADING";

export const selectDate = (date) => ({
  type: "SELECT_DATE",
  payload: date,
});
export const clickCell = (index) => ({
  type: "CLICK_CELL",
  payload: index,
});
export const resetSelectedDate = () => ({
  type: "RESET_SELECTED_DATE",
});
export const setAllTasks = () => ({
  type: "SET_ALL_TASKS",
});

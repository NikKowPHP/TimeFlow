export const selectDate = (date) => ({
  type: "SELECT_DATE",
  payload: date,
});
export const clickCell = (index) => ({
  type: "CLICK_CELL",
  payload: index,
});

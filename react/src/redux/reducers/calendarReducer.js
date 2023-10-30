const initialState = {
  selectedDate: null,
  clickedCellIndex: null,
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "CLICK_CELL":
      return { ...state, clickedCellIndex: action.payload };
    case "RESET_SELECTED_DATE":
      return { ...state, selectedDate: null, clickedCellIndex: null };
    default:
      return state;
  }
};
export default calendarReducer;

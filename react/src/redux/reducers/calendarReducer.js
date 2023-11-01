const initialState = {
  selectedDate: null,
  clickedCellIndex: null,
  allTasks: []
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "CLICK_CELL":
      return { ...state, clickedCellIndex: action.payload };
    case "RESET_SELECTED_DATE":
      return { ...state, selectedDate: null, clickedCellIndex: null };
    case "SET_ALL_TASKS":
      return { ...state, allTasks: action.payload };
    default:
      return state;
  }
};
export default calendarReducer;

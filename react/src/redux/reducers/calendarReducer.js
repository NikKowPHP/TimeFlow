const initialState = {
  selectedDate: null,
  clickedCellIndex: null,
  dates: [],
  currentDate: new Date(),
  year: new Date().getFullYear(),
  layout: "month"
};

const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_DATE":
      return { ...state, selectedDate: action.payload };
    case "CLICK_CELL":
      return { ...state, clickedCellIndex: action.payload };
    case "RESET_SELECTED_DATE":
      return { ...state, selectedDate: null, clickedCellIndex: null };
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_DATES":
      return { ...state, dates: action.payload };
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    default:
      return state;
  }
};
export default calendarReducer;

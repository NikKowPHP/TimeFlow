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
    default:
      return state;
  }
};
export default calendarReducer;

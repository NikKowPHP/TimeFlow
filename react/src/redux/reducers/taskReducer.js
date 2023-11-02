const initialState = {
  allTasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TASKS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_TASKS_SUCCESS":
      return { ...state, loading: false, allTasks: action.payload };
    case "FETCH_TASKS_FAILURE":
      return { ...state, loading: false, error: action.payload };
			
    default:
      return state;
  }
};

import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  UPDATE_TASKS,
} from "../actions/actionTypes";

const initialState = {
  allTasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      return { ...state, loading: true };
    case FETCH_TASKS_SUCCESS:
      return { ...state, loading: false, allTasks: action.payload };
    case FETCH_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_TASKS:
      const newTask = action.payload;
      return { ...state, allTasks: [...state.allTasks, newTask] };
    default:
      return state;
  }
};

export default taskReducer;

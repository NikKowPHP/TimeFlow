import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  UPDATE_TASKS,
  DELETE_TASK,
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
    case DELETE_TASK:
      const taskId = action.payload;
      const updatedTasks = state.allTasks.filter((task) => task.id !== taskId);
      return { ...state, allTasks: updatedTasks };
    default:
      return state;
  }
};

export default taskReducer;

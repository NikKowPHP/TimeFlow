import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  FETCH_DATE_TASKS_SUCCESS,
  UPDATE_TASKS,
  UPDATE_TASK,
  DELETE_TASK,
  SET_NEW_TASK,
} from "../actions/actionTypes";

const initialState = {
  allTasks: [],
  dateTasks: [],
  loading: false,
  error: null,
  newTask: {
    id: null,
    user_id: "",
    title: "",
    time_start: "",
    time_end: "",
    date: "",
    notified: false,
    notification_preference: "",
  },
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
      return { ...state, loading: true };
    case FETCH_TASKS_SUCCESS:
      return { ...state, loading: false, allTasks: action.payload };
    case FETCH_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_DATE_TASKS_SUCCESS:
      return { ...state, loading: false, dateTasks: action.payload };
    case UPDATE_TASKS:
      const newTask = action.payload;
      return { ...state, allTasks: [...state.allTasks, newTask] };
    case UPDATE_TASK:
      const updatedTask = action.payload;
      const updatedTasksArray = state.allTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return { ...state, allTasks: updatedTasksArray };
    case DELETE_TASK:
      const taskId = action.payload;
      const updatedTasks = state.allTasks.filter((task) => task.id !== taskId);
      return { ...state, allTasks: updatedTasks };
    case SET_NEW_TASK:
      return { ...state, newTask: { ...state.newTask, ...action.payload } };
    default:
      return state;
  }
};

export default taskReducer;

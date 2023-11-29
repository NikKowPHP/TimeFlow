import axiosClient from "../../axios-client";
import {
  DELETE_TASK,
  FETCH_TASKS_FAILURE,
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  SET_NEW_TASK,
  UPDATE_TASKS,
  UPDATE_TASK,
  FETCH_DATE_TASKS_SUCCESS,
  FETCH_SELECTED_TASK,
} from "./actionTypes";

export const fetchTasksRequest = () => ({
  type: FETCH_TASKS_REQUEST,
});
export const fetchTasksSuccess = (data) => ({
  type: FETCH_TASKS_SUCCESS,
  payload: data,
});
export const fetchDateTasksSuccess = (data) => ({
  type: FETCH_DATE_TASKS_SUCCESS,
  payload: data,
});
export const fetchSelectedTaskSuccess = (data) => ({
  type: FETCH_SELECTED_TASK,
  payload: data,
});
export const fetchTasksFailure = (error) => ({
  type: FETCH_TASKS_FAILURE,
  payload: error,
});
export const updateTasks = (newTask) => ({
  type: UPDATE_TASKS,
  payload: newTask,
});

export const deleteTask = (taskId) => ({
  type: DELETE_TASK,
  payload: taskId,
});
export const setNewTask = (data) => ({
  type: SET_NEW_TASK,
  payload: data,
});
export const updateTask = (task) => ({
  type: UPDATE_TASK,
  payload: task,
});

export const fetchTasks = () => {
  return (dispatch) => {
    dispatch(fetchTasksRequest());

    axiosClient
      .get(`/calendar/calendar/`)
      .then(({ data }) => {
        dispatch(fetchTasksSuccess(data.data));
      })
      .catch((error) => {
        dispatch(fetchTasksFailure(error));
      });
  };
};
export const fetchDateTasks = (date) => {
  return (dispatch, getState) => {
    const allTasks = getState().tasks.allTasks;

    const dateTasks = allTasks.filter((task) => task.date === date);
    dispatch(fetchDateTasksSuccess(dateTasks))
  }
}
export const fetchSelectedTask = (id) => {
  return (dispatch, getState) => {
    const dateTasks = getState().tasks.dateTasks;

    const selectedTask = dateTasks.find((task) => task.id === id);
    dispatch(fetchSelectedTaskSuccess(selectedTask))
  }
}

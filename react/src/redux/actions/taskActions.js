import axiosClient from "../../axios-client";
import {
  DELETE_TASK,
  FETCH_TASKS_FAILURE,
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  UPDATE_TASKS,
} from "./actionTypes";

export const fetchTasksRequest = () => ({
  type: FETCH_TASKS_REQUEST,
});
export const fetchTasksSuccess = (data) => ({
  type: FETCH_TASKS_SUCCESS,
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

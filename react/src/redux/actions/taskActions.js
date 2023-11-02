import axiosClient from "../../axios-client";

export const fetchTasksRequest = () => ({
  type: "FETCH_TASKS_REQUEST",
});
export const fetchTasksSuccess = () => ({
  type: "FETCH_TASKS_SUCCESS",
  payload: data,
});
export const fetchTasksFailure = () => ({
  type: "FETCH_TASKS_FAILURE",
  payload: error,
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

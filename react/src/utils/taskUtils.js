import { toast } from "react-toastify";
import axiosClient from "../axios-client";
import { dateUtils } from "./dateUtils";
import { useNavigate } from "react-router-dom";
import { calendarUtils } from "./calendarUtils";

export function taskUtils({ hideModal, dispatch, deleteTask }) {
  const { convertDateToTime } = calendarUtils();
  const { convertDateSql } = dateUtils();
  const navigate = useNavigate();

  function onTaskEdit(task) {
    navigate(`/tasks/${task.id}`, {
      state: { previousLocation: location.pathname },
    });
  }
  const handleTaskState = (state) => {
    if (state.status === 204) {
      hideModal();
      dispatch(deleteTask(state.task.id));
      toast.success(`The task '${state.task.title}' was successfully deleted`);
    }
  };
  // Function to delete the task.
  const onTaskDelete = (task) => {
    console.log(task);
    axiosClient.delete(`/tasks/${task.id}`).then((state) => {
      handleTaskState({ ...state, task: task });
    });
  };

  // Function to fetch tasks of a date.
  const getTasksByDate = (date, allTasks) =>
    allTasks.filter(
      (task) =>
        task.date === dateUtils().convertDateSql(date.toLocaleDateString())
    );

  const getNewTaskId = (allTasks) => {
    if(allTasks.length === 0) return 1;
    const sortedTasks = allTasks.sort((a, b) => a.id - b.id);
    return sortedTasks[sortedTasks.length - 1].id + 1;
  };

  /**
   * Initiates a default new task state based on selected time and date and sets state.
   * @param {Date} timeStart - represents starting time.
   * @param {Date} timeEnd - represents ending time.
   * @param {Date} clickedDate - represents the clicked date.
   */
  const initiateNewTask = (
    timeStartObj,
    timeEndObj,
    clickedDate,
    newTaskId
  ) => {
    const formattedTimeStart = convertDateToTime(timeStartObj);
    const formattedTimeEnd = convertDateToTime(timeEndObj);
    const formattedDate = convertDateSql(clickedDate.toLocaleDateString());

    return {
      id: newTaskId,
      title: "",
      time_start: formattedTimeStart,
      time_end: formattedTimeEnd,
      date: formattedDate,
      notification_preference: null,
    };
  };

  return {
    onTaskDelete,
    getTasksByDate,
    onTaskEdit,
    getNewTaskId,
    initiateNewTask,
  };
}

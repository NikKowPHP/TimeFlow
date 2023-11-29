import { toast } from "react-toastify";
import axiosClient from "../axios-client";
import { dateUtils } from "./dateUtils";
import { calendarUtils } from "./calendarUtils";
import { deleteTask } from "../redux/actions/taskActions";
import { useDispatch } from "react-redux";
import { useLocationState } from "../components/customHooks/useLocationState";

export function taskUtils({ hideModal }) {
  const dispatch = useDispatch();
  const { convertDateToTime } = calendarUtils();
  const { navigate, goBack } = useLocationState();
  const { convertDateSql } = dateUtils();

  function onTaskEdit(task) {
    navigate(`/task/edit/${task.id}`);
  }
  const handleTaskState = (state) => {
    if (state.status === 204) {
      dispatch(deleteTask(state.task.id));
      goBack();
      toast.success(`The task '${state.task.title}' was successfully deleted`);
    }
  };
  // Function to delete the task.
  const onTaskDelete = (task) => {
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

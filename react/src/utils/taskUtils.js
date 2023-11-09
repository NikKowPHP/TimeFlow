import { toast } from "react-toastify";
import axiosClient from "../axios-client";
import { dateUtils } from "./dateUtils";
import { useNavigate } from "react-router-dom";

export function taskUtils({ onStateReceived, hideModal, dispatch, deleteTask }) {
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

  }
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
    const sortedTasks = allTasks.sort((a, b) => a.id - b.id);
    return sortedTasks[sortedTasks.length - 1].id + 1;
  };

  return {
    onTaskDelete,
    getTasksByDate,
    onTaskEdit,
    getNewTaskId,
  };
}

import axiosClient from "../axios-client";
import { dateUtils } from "./dateUtils";
import { useNavigate } from "react-router-dom";

export function taskUtils({ onStateReceived }) {
  const navigate = useNavigate();

  function onTaskEdit(task) {
    navigate(`/tasks/${task.id}`, {
      state: { previousLocation: location.pathname },
    });
  }
  // Function to delete the task.
  const onTaskDelete = (task) => {
    console.log(task);
    axiosClient.delete(`/tasks/${task.id}`).then((data) => {
      onStateReceived({ ...data, task: task });
    });
  };


  // Function to fetch tasks of a date.
  const getTasksByDate = (date, allTasks) =>
    allTasks.filter(
      (task) =>
        task.date === dateUtils().convertDateSql(date.toLocaleDateString())
    );

  return {
    onTaskDelete,
    getTasksByDate,
    onTaskEdit,
  };
}

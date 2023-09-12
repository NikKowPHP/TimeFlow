import axiosClient from "../axios-client";
import { dateUtils } from "./dateUtils";

export function taskUtils({onStateReceived}) {

  // Function to delete the task.
  const onTaskDelete = (task) => {
    console.log(task);
    axiosClient.delete(`/tasks/${task.id}`)
    .then((data) => {
			onStateReceived({...data, 'task': task});
    });
  }

  // Function to fetch tasks of a date.
  const getTasksByDate = (date, allTasks) =>
    allTasks.filter(
      (task) =>
        task.date === dateUtils().convertDateSql(date.toLocaleDateString())
    );

	return {
		onTaskDelete,
    getTasksByDate,
	}
}
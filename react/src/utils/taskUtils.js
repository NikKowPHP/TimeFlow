import axiosClient from "../axios-client";

export function taskUtils({onStateReceived}) {

  // Function to delete the task.
  const onTaskDelete = (task) => {
    console.log(task);
    axiosClient.delete(`/tasks/${task.id}`)
    .then((data) => {
			onStateReceived({...data, 'task': task});
    });
  }

	return {
		onTaskDelete,
	}
}
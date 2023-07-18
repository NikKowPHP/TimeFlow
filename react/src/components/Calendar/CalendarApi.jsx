import axiosClient from '../../axios-client';

export default function CalendarApi() {
  const getAllTasks = () => {
    axiosClient
      .get(`/calendar/calendar`)
      .then(({ data }) => {
        setAllTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error);
      });
  };
  const getTasksOfSelectedDay = () => {
    axiosClient
      .get(`/calendar/calendar/${convertDateSql(selectedDate)}`)
      .then(({ data }) => {
        setTasks(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch tasks");
      });
  };

	return {
		getAllTasks,
		getTasksOfSelectedDay
	}

}

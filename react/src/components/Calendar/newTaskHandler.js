import { toast } from "react-toastify";
import axiosClient from "../../axios-client";
import {
  resetSelectedDate,
  selectDate,
} from "../../redux/actions/calendarActions";

export default function newTaskHandler({
  onDataReceived,
  updateTasks,
  dispatch,
  newTask,
  setNewTask,
  clickCell,
}) {
  const validateNewTaskForm = () => {
    let error = "";
    if (!newTask.title.trim()) {
      error = "Title is required";
    } else if (!newTask.date) {
      error = "Date is required";
    } else if (!newTask.time_start) {
      error = "Starting time is required";
    } else if (!newTask.date) {
      error = "Endling time is required";
    }
    return error ? error : null;
  };
  const handleTaskCreation = (ev) => {
    ev.preventDefault();

    const validationError = validateNewTaskForm();

    if (validationError) {
      toast.error(`${validationError}`);
    } else {
      axiosClient.post(`/calendar/calendar`, newTask).then(({ data }) => {
        dispatch(updateTasks(newTask));
        dispatch(resetSelectedDate());
        onDataReceived(data);
      });
    }
  };

  /**
   * Handles time selection and sets state
   * @param {Date} selectedTime - The selected time
   * @param {boolean} isStart - Whether is start of the time period or the end
   * @returns {void}
   */
  const handleTimeSelection = (selectedTime, isStart) => {
    if (isStart) {
      dispatch(setNewTask({ time_start: selectedTime }));
    } else {
      dispatch(setNewTask({ time_end: selectedTime }));
    }
  };

  const handleDateSelection = (newSelectedDate) => {
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate;
    dispatch(selectDate(formattedSelectedDate));
    dispatch(setNewTask({ date: newSelectedDate }));
  };

  const handleNotificationSelection = (event) => {
    setNewTask({ notification_preference: event.target.value });
  };

  return {
    handleTaskCreation,
    handleDateSelection,
    handleTimeSelection,
    handleNotificationSelection,
  };
}

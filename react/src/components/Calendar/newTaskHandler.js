import axiosClient from "../../axios-client";
import { selectDate } from "../../redux/actions/calendarActions";

export default function newTaskHandler({
  onDataReceived,
  updateTasks,
  dispatch,
  newTask,
  setNewTask,
  clickCell
}) {
  const handleTaskCreation = (ev) => {
    ev.preventDefault();

    axiosClient.post(`/calendar/calendar`, newTask).then(({ data }) => {
      dispatch(updateTasks(newTask));
      // refreshTasks();
      onDataReceived(data);
    });
  };

  /**
   * Handles time selection and sets state
   * @param {Date} selectedTime - The selected time
   * @param {boolean} isStart - Whether is start of the time period or the end
   * @returns {void}
   */
  const handleTimeSelection = (selectedTime, isStart) => {
    if (isStart) {
      debugger
      setClickedPeriodStart(selectedTime);
      setNewTask({ time_start: selectedTime });
    } else {
      setClickedPeriodEnd(selectedTime);
      setNewTask({ time_end: selectedTime });
    }
  };

  const handleDateSelection = (newSelectedDate) => {
    debugger
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate;
    dispatch(selectDate(formattedSelectedDate));
    dispatch(setNewTask({ date: newSelectedDate }));
    // dispatch(clickCell('02'))
  };

  return {
    handleTaskCreation,
    handleDateSelection,
    handleTimeSelection,
  };
}

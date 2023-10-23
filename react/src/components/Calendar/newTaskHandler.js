import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { useCalendarState } from "../customHooks/useCalendarState";
import { useModalState } from "../customHooks/useModalState";

export default function newTaskHandler() {
  const { user } = useStateContext();
  const { refreshTasks, updateTasks,  setSelectedDate, setClickedCellIndex } = useCalendarState();

const [task, setTask] = useState({
    id: null,
    user_id: user?.id || "",
    title: "",
    time_start: "",
    time_end: "",
    date: "",
    notified: false,
    notification_preference: "",
    // description: ''
  });
  useEffect(() => {
    setTask({ ...task, user_id: user?.id });
  }, [user]);

	function displaySuccessTaskCreation(data) {
    if (data) {
      hideModal();
      setSelectedDate(null);
      setClickedCellIndex(null);
      toast.success(`The task '${data.title}' was successfully created`);
    }
  }

  const handleTaskCreation = (ev) => {
    ev.preventDefault();

    axiosClient.post(`/calendar/calendar`, task).then(({ data }) => {
      // updateTasks(task);
      refreshTasks();
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
      setClickedPeriodStart(selectedTime);
      setTask({ ...task, time_start: selectedTime });
    } else {
      setClickedPeriodEnd(selectedTime);
      setTask({ ...task, time_end: selectedTime });
    }
  };

  const handleDateSelection = (newSelectedDate) => {
    const formattedSelectedDate = new Date(newSelectedDate);
    formattedSelectedDate;
    setSelectedDate(formattedSelectedDate);
    setTask({ ...task, date: newSelectedDate });
  };

  return {
    task,
    setTask,
    handleTaskCreation,
    handleDateSelection,
    handleTimeSelection,
    displaySuccessTaskCreation,
  };
}

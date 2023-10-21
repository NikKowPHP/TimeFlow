import { toast } from "react-toastify";
import newTaskHandler from "../components/Calendar/newTaskHandler";

export function modalUtils() {
  const { setSelectedDate, selectedDate } = useCalendarState();
  // Modal import
  const { openedModalId, showModal, hideModal } = useModalState();
  // Task import
  const { task, setTask, handleTaskCreation } = newTaskHandler({
    onDataReceived: displaySuccessTaskCreation,
  });

  const resetDateState = () => {
    setSelectedDate(null);
    setClickedCellIndex(null);
  };

  const handleOnClick = ({ event, modalId }) => {
    // Close opened modal
    if (openedModalId !== null) {
      hideModal();
      resetDateState();
    }
    event.stopPropagation();
    showModal(modalId);
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
}

/**
 * @param [Date] newSelectedDate - newSelectedDate from new task form
 *
 */
const handleDateSelection = (newSelectedDate) => {
  const formattedSelectedDate = new Date(newSelectedDate);
  formattedSelectedDate.setHours(clickedPeriodStart);
  setSelectedDate(formattedSelectedDate);
  setTask({ ...task, date: newSelectedDate });
};

/**
 * @param [Object] data - The returned data from the server
 *
 */
function displaySuccessTaskCreation(data) {
  if (data) {
    hideModal();
    setSelectedDate(null);
    setClickedCellIndex(null);
    toast.success(`The task '${data.title}' was successfully created`);
  }

  return {
    handleTaskCreation,
    setTask,
    task,
    resetDateState,
    handleOnClick,
    handleTimeSelection,
    handleDateSelection,
    displaySuccessTaskCreation,
  };
}

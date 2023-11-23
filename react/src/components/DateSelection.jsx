import React, { useEffect, useState } from "react";
import "../styles/dateSelection.css";

export default function DateSelection({
  onSelectDate,
  defaultDate,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [defaultUpdate, setDefaultUpdate] = useState(0);
  useEffect(() => {
    if (defaultUpdate === 0) {
      const formattedDate = defaultDate.toISOString().slice(0, 10);
      setSelectedDate(formattedDate);
      setDefaultUpdate(1);
    }
  }, [defaultDate]);

  const handleDateChange = (event) => {
    const newSelectedDate = event.target.value;
    setSelectedDate(newSelectedDate);
    onSelectDate(newSelectedDate);
  };
  return (
    <input
      name="date"
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      className="dateSelection-item"
    />
  );
}

import React, { useEffect, useState } from 'react'
import "../styles/dateSelection.css"

export default function DateSelection({onSelectDate, defaultDate}) {
	const [selectedDate, setSelectedDate] = useState(defaultDate);
	useEffect(() =>{
		const formattedDate = defaultDate.toISOString().slice(0,10);
		setSelectedDate(formattedDate);

	}, [defaultDate])

	const handleDateChange = (event) => {
		const  newSelectedDate = event.target.value;
		setSelectedDate(newSelectedDate);
		onSelectDate(newSelectedDate);
	}
	return (

		<div className="date-selection-container">
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="date-selection-input"
      />
    </div>
	)
}

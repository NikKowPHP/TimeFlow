import React, { useEffect, useState } from 'react'

export default function TimeSelection({onSelectTime, defaultTime}) {

	const [selectedTime, setSelectedTime] = useState('');

	useEffect(() => {
		setSelectedTime(convertTime(defaultTime));
	}, [defaultTime])

	const convertTime = (time) => {
		const timePad = time.toString().padStart(2, '0');
		const formattedTime = `${timePad}:00`;
		return formattedTime;
	}

	const handleTimeChange = (event) => {
		const selectedTimeValue = event.target.value;
		setSelectedTime(selectedTimeValue);
		onSelectTime(selectedTimeValue);

	}

	return (
			<input 
			type="time"
			value={selectedTime}
			onChange={handleTimeChange}
			className='timeSelection-item'
			/>
	)
}

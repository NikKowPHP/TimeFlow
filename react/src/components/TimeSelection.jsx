import React, { useEffect } from 'react'

export default function TimeSelection({onSelectTime, defaultTime}) {

	const [selectedTime, setSelectedTime] = useState('');

	useEffect(() => {
		setSelectedTime(defaultTime);

	}, [defaultTime])

	const handleTimeChange = (event) => {
		const selectedTimeValue = event.target.value;
		setSelectedTime(selectedTimeValue);
		onSelectTime(selectedTimeValue);

	}


	return (
		<div className='time-selection-container'>
			<input 
			type="time"
			value={selectedTime}
			onChange={handleTimeChange}
			className='time-selection-input'
			
			/>
			</div>
	)
}

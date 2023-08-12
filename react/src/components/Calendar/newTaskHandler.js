import { useState } from "react";

export function newTaskHandler() {
	const [title, setTitle] = useState(null);
	const [startTimePeriod, setStartTimePeriod] = useState(null);
	const [endTimePeriod, setEndTimePeriod] = useState(null);


	return {
		title,
		setTitle,
		startTimePeriod,
		setStartTimePeriod,
		endTimePeriod,
		setEndTimePeriod
	}
}
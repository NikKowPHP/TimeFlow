import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { useCalendarState } from "../customHooks/useCalendarState";

export default function newTaskHandler({ onDataReceived }) {
	const {user} = useStateContext();
	const {refreshTasks} = useCalendarState();

	const [task, setTask] = useState({
		id: null,
		user_id: user?.id || '',
		title: '',
		time_start: '',
		time_end: '',
		date: '',
		// description: ''
	})
	useEffect(() => {
		setTask({...task, user_id: user?.id});
	}, [user])

	const handleTaskCreation = (ev) => {
		ev.preventDefault();

		axiosClient.post(`/calendar/calendar`, task)
		.then(({data}) => {
			refreshTasks();
			onDataReceived(data)

		})
	}


	return {
		task,
		setTask, 
		handleTaskCreation
	}
}
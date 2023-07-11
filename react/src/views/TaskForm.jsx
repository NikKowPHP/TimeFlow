import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../axios-client';

export default function TaskForm() {
	const {id} = useParams();
	const [task, setTask] = useState({});
	if(id) {
		useEffect(() => {
			const getTask = () => {
				axiosClient.get(`/tasks/${id}`)
				.then (({data}) => {
					setTask(data.data);
					debugger;
				})
			}
			getTask();

		}, [])
	}
	return (
		<>
		{task.id && (
			<div>
			</div>
		)}
		</>
	)
}

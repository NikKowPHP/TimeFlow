import React, { useRef } from 'react'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/ContextProvider';

export default function RoleForm({dataToParent}) {

	const roleNameRef = useRef();
	const {setNotification} = useStateContext();

	const onSubmit = (ev) => {
		ev.preventDefault();
		const payload = {
			role: roleNameRef.current.value,
		}
		axiosClient
		.post('/roles/new', payload)
		.then(({data}) => { 
			const newData = {
				role: data.data.role,
				isCreated:true,
			}
			dataToParent(newData) 
			setNotification(`Role ${newData.role} was created successfully`)
			console.log('data a new role', data);
			console.log('data to parent', dataToParent);

		})
		.catch((error) => {
			console.error(error);
		})
	}
	return (
		<form action='' onSubmit={onSubmit} className='create-role-form'>
			<h3>Create a new role</h3>
			<input type="text" placeholder='Role name' ref={roleNameRef} />
			<button className='btn-add'>Create</button>
		</form>
	)
}

import React, { useRef } from 'react'
import axiosClient from '../axios-client'

export default function RoleForm() {

	const roleNameRef = useRef();

	const onSubmit = (ev) => {
		ev.preventDefault();
		const payload = {
			role: roleNameRef.current.value,
		}
		axiosClient
		.post('/roles/new', payload)
		.then(({data}) => {})
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

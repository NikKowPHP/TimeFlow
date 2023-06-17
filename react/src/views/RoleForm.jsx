import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosClient from '../axios-client';
import CheckboxForm from '../components/CheckboxForm';

export default function RoleForm() {
		const {id} =  useParams();
		const [user, setUser] = useState({});
		const [roles, setRoles] = useState([]);
		const [allRoles, setAllRoles] = useState([]);
		const [showAllRoleNames, setShowAllRoleNames] = useState(false);

		useEffect(() => {
		if(id) {
				axiosClient
				.get(`/roles/${id}`)
				.then(({data}) => {
					setUser(data);
					if(data.roles) {
						setRoles(data.roles);
					}
				})
		}
			
		}, [id])

		const getAllRoleNames = () => {

			axiosClient.get('/roles/all')
			.then(({data}) =>{
				setAllRoles(data.data);

			})
			.catch((error) => {
				console.error(error);
			})

		}

		const showRolesToggler = () => {
			setShowAllRoleNames((prevShowAllRoleNames) => !prevShowAllRoleNames);
		}
		useEffect(() => {
			if(showAllRoleNames){
				getAllRoleNames();
			}
		}, [showAllRoleNames]);

	return (
		<>
		<div> userid: {id}</div>

		<div>Username: {user.name}</div>

		{roles && roles.map((role, index) => (
			<span key={index}>role: {role}</span>
		))
		
		}
		 {roles && (
			<button className='btn-add' onClick={showRolesToggler}>Add roles</button>
    )}
		{  showAllRoleNames && allRoles && (
				<CheckboxForm  takenRoles={roles} checkboxObjectsArray={allRoles}  />
			// allRoles.map((role, index) => (
			// 	// <div key={index}>{role.id} {role.role}</div>

			// ))
		)}

		</>
	)
}

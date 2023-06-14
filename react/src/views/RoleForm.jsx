import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosClient from '../axios-client';

export default function RoleForm() {
		const {id} =  useParams();
		const [user, setUser] = useState({});
		const [roles, setRoles] = useState([]);
		const [allRoles, setAllRoles] = useState([]);
		const [showAllRoleNames, setShowAllRoleNames] = useState(false);

		if(id) {
			useEffect(() => {
				axiosClient
				.get(`/roles/${id}`)
				.then(({data}) => {
					setUser(data);
					if(data.roles) {
						setRoles(data.roles);
					}
				})

			}, [])
		}
		useEffect(() => {
			if(showAllRoleNames) getAllRoleNames();
		}, [showAllRoleNames]);

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
			setShowAllRoleNames(!showAllRoleNames);
			console.log(showAllRoleNames)
		}
		console.log(allRoles);

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
		{ showAllRoleNames === true && (
			allRoles.map((role, index) => (
				<div key={index}>{role.id} {role.role}</div>

				// <CheckboxForm  checkboxes={allRoles}  />
			))
		)}

		</>
	)
}

// const CheckboxForm = (checkboxes = []) => {
// 	const [parentChecked, setParentChecked] = useState(false);
// 	const [checkboxes, setCheckboxes] = useState([]);
// 	const handleParentCheckboxChange = (event) => {
// 		const isChecked = event.target.checked;
// 		setParentChecked(isChecked);
// 	}

// 	const updatedCheckboxes = checkboxes.map((checkbox) => ({
// 		...checkbox,
// 		checked: isChecked,
// 	}));
// }

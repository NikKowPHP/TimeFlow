import React, { useEffect, useState } from 'react'
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';

export default function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getUsers();

	}, [])
	const getUsers = () => {
		setLoading(true);
		axiosClient.get('/users')
		.then(({data}) => {
			setUsers(data.data);
		})
		.catch(() => {
			setLoading(false);
		})

	}
	return (
		<div>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<h1>Users</h1>
				<Link className='btn-add' to={'/users/new'}>Add new</Link>
			</div>
			<div className="card animated fadeInDown">
				<table>
					<tr>
						<th>
							ID
						</th>
						<th>
							Name
						</th>
						<th>
							Email
						</th>
						<th>
							Create Date
						</th>
						<th>
							Actions
						</th>
					</tr>
					<tbody>
						{users.map(u => (
							<tr>
								<td>{u.id}</td>
								<td>{u.name}</td>
								<td>{u.email}</td>
								<td>{u.created_at}</td>
								<td>
									<Link className='btn-edit' style={{marginRight: '5px'}}  to={'/users/' + u.id}>Edit</Link>
									<button className='btn-delete'>Delete</button>
								</td>
							</tr>
						))}

					</tbody>
				</table>
			</div>
		</div>

	)
}

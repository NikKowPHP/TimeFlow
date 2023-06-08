import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';

export default function Roles() {
	const [loading, setLoading] = useState(false);
	const [roles, setRoles] = useState([]);

	useEffect(() => {
		getRoles();
	}, [])

	const getRoles = () => {
		setLoading(true);
		axiosClient
		.get("/roles")
		.then(({data}) => {
      console.log(data)
			setRoles(data.data);
			setLoading(false);
		})
		.catch(() => {
			setLoading(false);
		})
	}

	return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Roles</h1>
        <Link className="btn-add" to={"/users/new"}>
          Add new role
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>

              <th>Username</th>
              <th>Role</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}

          {!loading && (
            <tbody>
              {roles.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link
                      className="btn-edit"
                      style={{ marginRight: "5px" }}
                      to={"/users/" + u.id}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(ev) => onDelete(u)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
	)
}

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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
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
              {roles.map((r, index) => (
                <tr key={index}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.roles.length !== 0 ? r.roles : 'unassigned' }</td>
                  <td>
                    <Link
                      className="btn-edit"
                      style={{ marginRight: "5px" }}
                      to={"/users/" + r.id}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(ev) => onDelete(r)}
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

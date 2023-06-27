import React, { useState } from 'react'
import axiosClient from '../axios-client';

export default function RoleNames() {
	const [roleNames, setRoleNames] = useState([]);

	axiosClient.get(`/roles/names`)

	.then(({data}) => {


	})


	return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Role names</h1>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Role name</th>
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
              {roles.length > 0 &&
                roles.map((r, index) => (
                  <tr key={index}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>
                      {r.roles.length !== 0
                        ? r.roles.map((role, roleIndex) =>
                            roleIndex === r.roles.length - 1 ? (
                              <span key={roleIndex}>{role}</span>
                            ) : (
                              <span key={roleIndex}>{role}, </span>
                            )
                          )
                        : "unassigned"}
                    </td>
                    <td>
                      
                      {/* TOOLTIP IMPLEMENTATION */}

                      <Tooltip
                      tooltipVisible={r.isUpdatedRoles}
                        children={
                          <button
                            className="btn-edit"
                            style={{ marginRight: "5px" }}
                            onClick={showRolesToggler}
                            
                          >
                            Edit
                          </button>
                        }
                        content={
                          <CheckboxForm
                            userId={r.id}
                            takenRoles={r.roles}
                            checkboxObjectsArray={allRoles}
                            onSubmit={handleCheckboxFormSubmit}
                          />
                        }
                      />
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

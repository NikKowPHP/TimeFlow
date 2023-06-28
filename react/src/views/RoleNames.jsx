import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { toast } from "react-toastify";

export default function RoleNames() {
  const [allRoleNames, setAllRoleNames] = useState([]);
  const { loading, setNotification } = useStateContext();

  const getAllRoleNames = () => {
    axiosClient
      .get("/roles/all")
      .then(({ data }) => {
        setAllRoleNames(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

const onDelete = (role)=> {
	if(!window.confirm('Are you sure you want to delete role?')) {
		return;
	}
	axiosClient.delete(`/roles/all/${role.id}`).then(()=>{ 
    setNotification(`Role ${role.role} was successfully deleted`);
		getAllRoleNames();
	})

}

	useEffect(() => {
		getAllRoleNames();
}, []);


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
              {allRoleNames.length > 0 &&
                allRoleNames.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.role}</td>
                    <td>
                      <button
                        onClick={() => onDelete(role)}
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
  );
}

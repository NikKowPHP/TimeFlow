import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function RoleNames() {
  const [allRoleNames, setAllRoleNames] = useState([]);
  const { loading } = useStateContext();

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
  );
}

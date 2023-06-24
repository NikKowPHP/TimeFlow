import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import Tooltip from "../components/Tooltip";
import CheckboxForm from "../components/CheckboxForm";

export default function Roles() {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [showAllRoleNames, setShowAllRoleNames] = useState(false);

  const handleCheckboxFormSubmit = (dataFromChild) => {
    updateRoles(dataFromChild.userId, dataFromChild.roles);
  };
  const handleRolesChange = (prevRoles, userId, userRoles) => {
    console.log(allRoles);
    return prevRoles.map((user) =>
      user.id === userId ? { ...user, roles: userRoles } : user
    );
  };

  const updateRoles = (userId, selectedRoles) => {
    const payload = { user_id: userId, role_id: selectedRoles };
    const updatedRoles = handleRolesChange(roles, userId, selectedRoles);
    setRoles(updatedRoles);
    // showRolesToggler();
    setShowAllRoleNames(false)

    axiosClient
      .put(`/roles/${userId}`, payload)
      .then(({ data }) => {
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showRolesToggler = () => {
    setShowAllRoleNames((prevShowAllRoleNames) => !prevShowAllRoleNames);
  };

  useEffect(() => {
    if (showAllRoleNames) {
      getAllRoleNames();
    }
  }, [showAllRoleNames]);

  useEffect(() => {
    getRoles();
  }, []);
  useEffect(() => {
    console.log(roles);
  }, [roles]);

  const getRoles = () => {
    setLoading(true);
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setRoles(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getAllRoleNames = () => {
    axiosClient
      .get("/roles/all")
      .then(({ data }) => {
        setAllRoles(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
        <Link className="btn-add" to={"/roles/new"}>
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
              {roles.length > 0 &&
                roles.map((r, index) => (
                  <tr key={index}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.roles.length !== 0 ? r.roles : "unassigned"}</td>

                    <td>
                      {/* TOOLTIP IMPLEMENTATION */}
                      <Tooltip
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
  );
}

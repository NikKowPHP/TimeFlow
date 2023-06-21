import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import CheckboxForm from "../components/CheckboxForm";

export default function RoleForm() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [showAllRoleNames, setShowAllRoleNames] = useState(false);

  const handleCheckboxFormSubmit = (selectedRoles) => {
    setRoles(selectedRoles);
  }


  useEffect(() => {
    if (id) {
      axiosClient.get(`/roles/${id}`).then(({ data }) => {
        setUser(data);
        if (data.roles) {
          setRoles(data.roles);
        }
      });
    }
  }, [id]);

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

  const showRolesToggler = () => {
    setShowAllRoleNames((prevShowAllRoleNames) => !prevShowAllRoleNames);
  };
  useEffect(() => {
    if (showAllRoleNames) {
      getAllRoleNames();
    }
  }, [showAllRoleNames]);

  return (
    <div className="edit-roles-user-info">
    
      <div> userid: {id}</div>

      <div>Username: {user.name}</div>
      <div>
        <h3>Actual roles:</h3>
        {roles && 
          roles.map((role, index) => <span key={index}>{role} </span>)}
      </div>
      {roles && (
        <button className="btn-add" onClick={showRolesToggler}>
          Add roles
        </button>
      )}
      {showAllRoleNames && allRoles && (
        <CheckboxForm
          userId={id}
          takenRoles={roles}
          checkboxObjectsArray={allRoles}
          onSubmit={handleCheckboxFormSubmit}
        />
      )}
    </div>
  );
}

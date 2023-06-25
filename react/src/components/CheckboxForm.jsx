import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function CheckboxForm({
  checkboxObjectsArray,
  takenRoles,
  userId,
  onSubmit,
}) {
  const { setNotification } = useStateContext();
  const [parentChecked, setParentChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);

  useEffect(() => {
    setCheckboxes(generateCheckboxesInitialState());
  }, [checkboxObjectsArray, takenRoles]);
  useEffect(() => {
    checkCheckboxes(checkboxes);
  }, [checkboxes]);

  const generateCheckboxesInitialState = () =>
    checkboxObjectsArray.map((role) => ({
      id: role.id,
      name: role.role,
      checked: takenRoles.includes(role.role),
    }));

  const checkCheckboxes = (checkboxes) => {
    if (checkboxes.length != 0) {
      const allChecked = checkboxes.every((checkbox) => checkbox.checked);
      setParentChecked(allChecked);
    }
  };

  const handleParentCheckboxChange = () => {
    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      checked: !parentChecked,
    }));
    setCheckboxes(updatedCheckboxes);
    setParentChecked(!parentChecked);
  };

  const handleCheckboxChange = (checkboxId) => {
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      return checkbox.id === checkboxId
        ? { ...checkbox, checked: !checkbox.checked }
        : checkbox;
    });
    setCheckboxes(updatedCheckboxes);
  };

  const onSubmitForm = (ev) => {
    ev.preventDefault();
    const selectedRoles = checkboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.id);
        setCheckboxes((prevCheckboxes) =>
          prevCheckboxes.map((checkbox) => ({
            ...checkbox,
            checked: selectedRoles.includes(checkbox.id),
          }))
        );
        const filterRoles = checkboxes
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.id)
        const rolesDataToSend = ({
          userId: userId,
          roles: filterRoles,
        })

        onSubmit(rolesDataToSend);
        setNotification(`Roles were updated`);
      };
  // };

  return (
    <form className="form-checkbox" onSubmit={onSubmitForm}>
      {checkboxes && (
        <div className="checkbox-item">
          <label>
            All
            <input
              name="parent-checkbox"
              type="checkbox"
              checked={parentChecked}
              onChange={() => handleParentCheckboxChange()}
            />
          </label>
        </div>
      )}

      {checkboxes.map((checkbox) => (
        <div className="checkbox-item" key={checkbox.id}>
          <label>
            {checkbox.name}
            <input
              type="checkbox"
              checked={checkbox.checked}
              onChange={() => handleCheckboxChange(checkbox.id)}
            />
          </label>
        </div>
      ))}
      <button className="btn" type="submit">
        Submit
      </button>
    </form>
  );
}

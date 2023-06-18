import React, { useEffect, useState } from "react";

export default function CheckboxForm({ checkboxObjectsArray, takenRoles }) {
  const [parentChecked, setParentChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);


  useEffect(() => {
    setCheckboxes(generateCheckboxesInitialState());
  }, [checkboxObjectsArray, takenRoles]);

  const generateCheckboxesInitialState = () => 
    checkboxObjectsArray.map((role) => ({
      id: role.id,
      name: role.role,
      checked: takenRoles.includes(role.role),
    }));
 

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

    const allChecked = updatedCheckboxes.every((checkbox) => checkbox.checked);
    setParentChecked(allChecked);
  };



  return (
    <form className="form-checkbox" onSubmit={onSubmitForm}>
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

      <div className="checkbox-item">
        {checkboxes.map((checkbox) => (
          <label key={checkbox.id}>
            {checkbox.name}
            <input
              type="checkbox"
              checked={checkbox.checked}
              onChange={() => handleCheckboxChange(checkbox.id)}
            />
          </label>
        ))}
      </div>
      <button className="btn" type="submit">
        Submit
      </button>
    </form>
  );
}

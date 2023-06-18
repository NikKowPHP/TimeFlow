import React, { useEffect, useState } from "react";

export default function CheckboxForm({ checkboxObjectsArray, takenRoles }) {
  const [parentChecked, setParentChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  useEffect(() => {
    setCheckboxes(generateCheckboxesInitialState());
  }, [checkboxObjectsArray, takenRoles]);

  const generateCheckboxesInitialState = () => {
    return checkboxObjectsArray.map((role) => ({
      id: role.id,
      name: role.role,
      checked: takenRoles.includes(role.role),
    }));
  };

  const handleParentCheckboxChange = () => {
    setParentChecked(!parentChecked);
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      return {
        ...checkbox,
        checked: !parentChecked,
      };
    });
    setCheckboxes(updatedCheckboxes);
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
    <form className="form-checkbox">
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

import React, { useEffect } from "react";
import { useState } from "react";

export default function CheckboxForm({ checkboxObjectsArray, takenRoles }) {
  const [parentChecked, setParentChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  useEffect(() => {
    setCheckboxes(generateCheckboxesInitialState());

  }, [checkboxObjectsArray])

  const generateCheckboxesInitialState = () => {

    const checkboxesArr = [];
    checkboxObjectsArray.map((role) => {
        checkboxesArr.push({
          id: role.id,
          name: role.role,
          checked: takenRoles.includes(role.role) ? true : false
        })
    })
    return checkboxesArr;
  }
  console.log(checkboxes);
  
  
  const handleParentCheckboxChange = () => {
    const isAllChecked = checkboxes.every((checkbox)=> checkbox.checked);
    setParentChecked(!isAllChecked);
    setCheckboxes((prevCheckboxes) => {
      prevCheckboxes.map((checkbox) => ({
        ...checkbox,
        checked: !isAllChecked,
      }))
    });
  }
  const handleCheckboxChange = (checkboxId) => {
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      console.log({...checkbox});
      return checkbox.id === checkboxId ?  { ...checkbox, checked: !checkbox.checked} : checkbox;
    });
    setCheckboxes(updatedCheckboxes);
  }

  return (
    <form  className="form-checkbox">
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
				{
					checkboxes.map((checkbox, index) => (
        			<label key={checkbox.id}>
					{checkbox.name}
          <input
            type="checkbox"
            checked={checkbox.checked}
            onChange={() => handleCheckboxChange(checkbox.id)}
          />

        </label>

					))
				}
				
      </div>
      <button className="btn" type="submit">Submit</button>
    </form>
  );
}

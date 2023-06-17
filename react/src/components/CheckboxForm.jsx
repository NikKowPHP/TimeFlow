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
  
  

  return (
    <form  className="form-checkbox">
      <div className="checkbox-item">

        <label>
          All
          <input
          name="parent-checkbox"
            type="checkbox"
            checked={parentChecked}
            onChange={(event) => setParentChecked(event.targetChecked)}
          />
        </label>
      </div>
      

      <div className="checkbox-item">
				{
					checkboxes.map((checkbox) => (
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

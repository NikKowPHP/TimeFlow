import React from "react";
import { useState } from "react";

export default function CheckboxForm({ checkboxObjectsArray = [] }) {
  const [parentChecked, setParentChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState(checkboxObjectsArray);
  const handleParentCheckboxChange = (event) => {
    setParentChecked(event.target.checked);
  };
	console.log(checkboxes);

  return (
    <form >
      <div>
        <label>
          <input
            type="checkbox"
            checked={parentChecked}
            onChange={(event) => setParentChecked(event.targetChecked)}
          />
          Parent Checkbox
        </label>
      </div>
      <div>
				{
					checkboxes.map((checkbox, index) => (
        			<label>
					{checkbox.role}
          <input
            type="checkbox"
            checked={parentChecked}
            onChange={(event) => setParentChecked(event.targetChecked)}
          />

        </label>

					))
				}
				
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

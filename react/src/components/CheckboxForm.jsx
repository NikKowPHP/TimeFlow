import React, { useEffect } from "react";
import { useState } from "react";

export default function CheckboxForm({ checkboxObjectsArray }) {
  const [parentChecked, setParentChecked] = useState(false);
  const [checkboxes, setCheckboxes] = useState(checkboxObjectsArray);
  useEffect(() => {
    setCheckboxes(checkboxObjectsArray);

  }, [checkboxObjectsArray])

  return (
    <form  className="form-checkbox">
      <div className="checkbox-item">

        <label>
          Parent Checkbox
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
					checkboxes.map((checkbox, index) => (
        			<label key={index}>
					{checkbox.role}
          <input
            type="checkbox"
            checked={checkbox.checked}
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

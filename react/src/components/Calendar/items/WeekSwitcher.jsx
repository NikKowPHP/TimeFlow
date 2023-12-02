import React from "react";

function WeekSwitcher({handlePreviousWeek, handleNextWeek}) {
  return (
    <div className="calendar-weekly__dates-switcher-container">
      <span
        onClick={handlePreviousWeek}
        className="material-symbols-rounded calendar-weekly__dates-switcher_block"
      >
        chevron_left
      </span>
      <span
        onClick={handleNextWeek}
        className="material-symbols-rounded calendar-weekly__dates-switcher_block"
      >
        chevron_right
      </span>
    </div>
  );
}

export default WeekSwitcher;

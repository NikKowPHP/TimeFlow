import React from "react";

function MonthSwitcher({
  handlePrevMonthClick,
  handleNextMonthClick,
  monthName,
}) {
  return (
    <div className="dates-switcher-container">
      <span
        onClick={handlePrevMonthClick}
        className="material-symbols-rounded dates-switcher__block"
      >
        chevron_left
      </span>
      <span className="dates-switcher__month-name">{monthName}</span>
      <span
        onClick={handleNextMonthClick}
        className="material-symbols-rounded  dates-switcher__block"
      >
        chevron_right
      </span>
    </div>
  );
}

export default MonthSwitcher;

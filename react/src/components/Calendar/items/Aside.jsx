import React, { useState } from "react";
import { Link } from "react-router-dom";

function Aside({setAsideShown, asideShown}) {
  return (
    <>
      <aside
        className={`default-aside-overlay ${asideShown ? "aside-active" : ""}`}
      >
        <button className="btn-hamburger" onClick={() => handleToggleAside()}>
          <i className="fa fa-bars"></i>
        </button>

        <h3 to={"/calendar"}>Calendar</h3>
        <div
          className="aside__calendar-links"
          onClick={() => setAsideShown(false)}
        >
          <Link to={"/calendar/month"}>Month</Link>
          <Link to={"/calendar/week"}>Week</Link>
          <Link to={"/calendar/agenda"}>Schedule</Link>
        </div>
        <hr className="aside-seperator" />
        <Link to={"/tasks"}>Tasks</Link>

      </aside>
      {asideShown && (
        <div className="dim-overlay" onClick={() => setAsideShown(false)} />
      )}
    </>
  );
}

export default Aside;

import "../../../styles/modules/aside.css";
import React from "react";
import svgPaths from "../../svgPaths";

function Aside({ setAsideShown, asideShown, handleToggleAside, asideLinks }) {
  return (
    <>
      <aside
        className={`aside aside-guest ${asideShown ? "aside-active" : ""}`}
      >
        <div className="aside__header">
          <button className="aside__close" onClick={handleToggleAside}>
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              focusable="false"
              className="profile__avatar"
            >
              {svgPaths.close}
            </svg>
          </button>
        </div>
        <div className="aside__body">
          <ul
            className="aside__nav"
            onClick={() => setAsideShown(false)}
          >
            {asideLinks}

          </ul>
        </div>
      </aside>
      {asideShown && (
        <div className="dim-overlay" onClick={() => setAsideShown(false)} />
      )}
    </>
  );
}

export default Aside;

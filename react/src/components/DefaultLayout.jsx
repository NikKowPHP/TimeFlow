import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import CalendarAside from "./Calendar/CalendarAside.jsx";
import { useCalendarState } from "./customHooks/useCalendarState";
import NotificationListener from "./NotificationListener";
import { useNotificationState } from "./customHooks/useNotificationState";

function DefaultLayout() {
  const { user, token, notification, errors, setUser, setToken } =
    useStateContext();
  const { currentDate, selectedDate, layout, setLayout } = useCalendarState();

  const { requestNotificationPermission, isNotificationGranted } =
    useNotificationState();
  const navigate = useNavigate();

  // show calendar in aside section
  const location = useLocation().pathname;
  const isCalendar = location.includes("calendar");
  // show/hide aside
  const [asideShown, setAsideShown] = useState(true);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // get user data
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
    if (!isNotificationGranted) requestNotificationPermission();
  }, []);

  // hide/show aside
  const handleToggleAside = () => {
    setAsideShown(!asideShown);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 970) {
        setAsideShown(false);
      } else {
        setAsideShown(true);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      navigate("/login");
    });
  };

  // select type of calendar to show
  const handleOptionSelect = (option) => {
    setLayout(option);
    navigate(`/calendar/${option}`);
  };

  const renderAddNewTaskBtn = () => (
    <div className="btn__add-task-wrapper">
      <svg className="btn__add-task" width="36" height="36" viewBox="0 0 36 36">
        <path fill="#d442bc" d="M16 16v14h4V20z"></path>
        <path fill="#7d42d4" d="M30 16H20l-4 4h14z"></path>
        <path fill="#42d3d4" d="M6 16v4h10l4-4z"></path>
        <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
        <path fill="none" d="M0 0h36v36H0z"></path>
      </svg>
    </div>
  );

  return (
    <div id="defaultLayout">
      {/* Notification listener to show notifications from the backend */}
      <NotificationListener />

      <ToastContainer />
      {asideShown && (
        <aside className="default-aside">
          <Link to={"/calendar"}>Calendar</Link>
          <Link to={"/tasks"}>Tasks</Link>

          {user &&
            user.hasOwnProperty("roles") &&
            user.roles.includes("admin") && (
              <>
                <Link to={"/roles"}>Roles</Link>
                <Link to={"/roles/all"}>Role names</Link>
                <Link to={"/users"}>Users</Link>
              </>
            )}

          {isCalendar && (
            <CalendarAside
              currentDate={currentDate}
              selectedDate={selectedDate}
            />
          )}
        </aside>
      )}

      <div className="content">
        <header>
          <button className="btn-hamburger" onClick={() => handleToggleAside()}>
            <i className="fa fa-bars"></i>
          </button>
          <div>{user && user.name}</div>

          {/* show selection of calendar types */}
          {isCalendar && (
            <>
              <select
                value={layout}
                onChange={(e) => handleOptionSelect(e.target.value)}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="agenda">Agenda</option>
              </select>
              {renderAddNewTaskBtn()}
            </>
          )}

          <a href="#" onClick={onLogout} className="btn btn-logout">
            Logout
          </a>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
        {errors.message && (
          <div className="notification notification-error">
            {errors.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default DefaultLayout;

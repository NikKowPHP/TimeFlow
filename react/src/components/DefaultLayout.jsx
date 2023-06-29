import React, { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DefaultLayout() {
  const { user, token, notification, errors, setUser, setToken } =
    useStateContext();
  if (!token) {
    return <Navigate to="/login" />;
  }
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };
  return (
    <div id="defaultLayout">
      <ToastContainer />
      <aside>
        <Link to={"/dashboard"}>Dashboard</Link>
        <Link to={"/users"}>Users</Link>
        <Link to={"/calendar"}>Calendar</Link>
        <Link to={"/tasks"}>Tasks</Link>

        {user &&
          user.hasOwnProperty("roles") &&
          user.roles.includes("admin") && (
            <>
              <Link to={"/roles"}>Roles</Link>
              <Link to={"/roles/all"}>Role names</Link>
            </>
          )}
      </aside>
      <div className="content">
        <header>
          <div>Header</div>
          <div>{user && user.name}</div>
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

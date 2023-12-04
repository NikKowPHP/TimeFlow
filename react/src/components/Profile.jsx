import React from "react";
import "../styles/profile.css";
import { useStateContext } from "../contexts/ContextProvider";
import { useLocationState } from "./customHooks/useLocationState";
import svgPaths from "./svgPaths";

function Profile() {
  const { user } = useStateContext();
  const { goBack } = useLocationState();

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      navigate("/login");
    });
  };
  const avatarDefault = (
    <svg
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      onClick={goBack}
      focusable="false"
      className="profile__avatar"
    >
      {svgPaths.profileLogo}
    </svg>
  );
  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          onClick={goBack}
          className="profile-header__btn-close svg-control"
          focusable="false"
        >
          {svgPaths.close}
        </svg>
        <h2 className="profile-header__welcome">Hi, {user.name}!</h2>
      </div>
      <div className="profile-body">
        <div className="profile__info-wrapper">
          <div className="profile__info-avatar">
            {user.avatar ? user.avatar : avatarDefault}
          </div>
          <div className="profile__user-info--wrapper">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="modal-profile__btns">
          <button onClick={onLogout} className="btn-signOut">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {svgPaths.signOut}
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
export default Profile;

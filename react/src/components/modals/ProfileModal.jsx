import React, { useEffect, useRef } from "react";
import svgPaths from "../svgPaths";
import "../../styles/modals/modalProfile.css";
import { Link } from "react-router-dom";

export default function ProfileModal({ onModalClose, user, onLogout }) {
  /**
   * Renders the header content for the modal.
   * @returns {JSX.Element} - JSX element containing icons for editing, deleting, and closing the modal.
   */
  const renderModalContentHeader = () => (
    <div className="modal-profile__modal-tools">
      <span className="modal-tools__email">{user.email}</span>
      <svg
        onClick={() => onModalClose()}
        className="svg-control"
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        {svgPaths.close}
      </svg>
    </div>
  );

  /**
   * Renders the modal content for creating a new task with specified parameters.
   * @param {JSX.Element} modalContentHeader - The JSX element representing the header of the modal with icons and layout.
   * @returns {JSX.Element} - The JSX element representing the modal content for creating a new task.
   */
  const renderModalProfile = (modalContentHeader) => (
    <>
      {/* render header of modal */}
      {modalContentHeader}
      <div className="modal-profile__body">
        <div className="modal-profile__body-main">
          <h2 className="modal-profile__body-header">Hi, {user.name}!</h2>
          <Link to="/profile" className="modal-profile__profile-link">
            Manage your account
          </Link>
        </div>
        <div className="modal-profile__btns">
          <button onClick={onLogout}className="btn-signOut">
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
    </>
  );

  return renderModalProfile(renderModalContentHeader());
}

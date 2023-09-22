import "../../styles/modal.css";
import React, { useEffect,useRef } from "react";
import { useModalState } from "../customHooks/useModalState";

/**
 * Modal component is used to display additional information or details when the user interacts with an element.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content that will trigger the modal on interaction.
 * @param {React.ReactNode} props.content - The content to be displayed in the modal.
 * @param {string} [props.classes=""] - Additional CSS classes to be applied to the modal container.
 * @param {boolean} props.isModalVisible - Determines whether the modal is visible or not.
 * @param {string} props.modalPositionClass - The position class for modal placement (e.g., "modal-right").
 * @param {string} props.modalId - An identifier for the modal.
 *
 * @returns {JSX.Element} The JSX representation of the Modal component.
 */

export default function Modal({
  children,
  content,
  classes = "",
  style,
  isModalVisible,
  modalId,
  modalRef
}) {

  /**
   * Handle click events on the modal content to prevent event bubbling.
   *
   * @param {React.MouseEvent} event - The click event object.
   */

  const handleContentClick = (event) => {
    event.stopPropagation();
  };
  // TODO: create a movable modal

  return (
    <div className="modal-container">
      {children}

      {isModalVisible && (
        <div
          ref={modalRef}
          data-modal-id={modalId}
          className={`modal ${classes}`}
          onClick={handleContentClick}
          style={style}
        >
          {content}
        </div>
      )}
    </div>
  );
}

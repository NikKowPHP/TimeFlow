import "../../styles/modal.css";
import React, { useEffect, useRef, useState } from "react";
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
  modalRef,
  position,
}) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState(position);

  /**
   * Handle click events on the modal content to prevent event bubbling.
   *
   * @param {React.MouseEvent} event - The click event object.
   */

  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  const handleMouseDown = (event) => {
    console.log('mouseDown');

    if (!dragging) {
      const modal = modalRef.current;
      const modalRect = modal.getBoundingClientRect();

      const offsetX = event.clientX - modalRect.left;
      const offsetY = event.clientY - modalRect.top;
      setDragging(true);
      setOffset({
        x: offsetX,
        y: offsetY,
      });
    }
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const left = event.clientX - offset.x;
      const top = event.clientY - offset.y;

      setModalPosition({ left: `${left}px`, top: `${top}px` });
    }
  };

  const handleMouseUp = () => {
    console.log('mouseUp');
    if (dragging) {
      setDragging(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      modalRef.current.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      if (modalRef) {
        modalRef.current?.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    }
  }, [isModalVisible]);

  return (
    <div className="modal-container">
      {children}

      {isModalVisible && (
        <div
          ref={modalRef}
          data-modal-id={modalId}
          className={`modal ${classes}`}
          onClick={handleContentClick}
          style={modalPosition}
        >
          {content}
        </div>
      )}
    </div>
  );
}

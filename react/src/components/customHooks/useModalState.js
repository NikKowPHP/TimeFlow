import { useState, useEffect } from "react";

/**
 * useModalState Hook
 *
 * This hook manages the state and behavior of a modal.
 *
 * @returns {object} - An object containing modal state and functions.
 * @property {boolean} isModalVisible - Whether the modal is visible or not.
 * @property {string|null} openedModalId - The ID of the currently opened modal.
 * @property {string} modalPositionClass - The class name for modal positioning (e.g., "modal-left" or "modal-right").
 * @property {function} setModalVisibility - Function to explicitly set the visibility of the modal.
 * @property {function} showModal - Function to show the modal with the specified modalId.
 * @property {function} hideModal - Function to hide the modal.
 */

export function useModalState() {
  // TODO: CALCULATE HEIGHT TO ADJUST THE MODAL
  // State of the modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openedModalId, setOpenedModalId] = useState(null);

  const [nestedOpenedModalId, setNestedOpenedModalId] = useState(null);
  const [isNestedModalVisible, setIsNestedModalVisible] = useState(false);

  // State for modal position
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });
  const [modalPositionClass, setModalPositionClass] = useState("modal-right");
  const [modalPositionHeightClass, setModalPositionHeightClass] =
    useState("modal-bottom");

  // Function to explicitly set the visibility of the modal
  const setModalVisibility = (isVisible) => {
    setIsModalVisible(isVisible);
  };

  // Calculate the center of the screen and update on window resize
  useEffect(() => {
    const calculateScreenCenter = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setScreenCenter({ x: centerX, y: centerY });
    };
    calculateScreenCenter();

    const handleResize = () => {
      calculateScreenCenter();
    };
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Event listener to handle click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the modal is visible and the click is not the opened modal
      if (isModalVisible && event.target.dataset.modalId !== openedModalId) {
        hideModal();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.addEventListener("click", handleClickOutside);
    };
  }, [isModalVisible, openedModalId]);

  // Adjust the modal position based on the mouse click coordinates
  const adjustModalPosition = () => {
    const mouseCoordinates = getMouseClickCoordinates(event);
    if (mouseCoordinates.x > screenCenter.x) {
      setModalPositionClass("modal-left");
    } else {
      setModalPositionClass("modal-right");
    }
    if (mouseCoordinates.y > screenCenter.y) {
      setModalPositionHeightClass("modal-top");
    } else {
      setModalPositionHeightClass("modal-bottom");
    }
  };

  // Get the mouse click coordinates
  const getMouseClickCoordinates = (event) => ({
    x: event.clientX,
    y: event.clientY,
  });

  // Show the modal with the specified modalId
  const showModal = (modalId) => {
    setIsModalVisible(true);
    setOpenedModalId(modalId);
    // Adjust the modal position based on the click event
    adjustModalPosition();
  };
  // Hide the modal
  const hideModal = () => {
    setIsModalVisible(false);
    setOpenedModalId(null);
  };
  // Show the nested modal with the specified modalId
  const showNestedModal = (modalId) => {
    setIsNestedModalVisible(true);
    setNestedOpenedModalId(modalId);
    // Adjust the nested modal position based on the click event
    adjustModalPosition();
  };
  // Hide the nested modal
  const hideNestedModal = () => {
    setIsNestedModalVisible(false);
    setNestedOpenedModalId(null);
  };

  // Return the state and functions to be used by the component
  return {
    openedModalId,
    setOpenedModalId,
    nestedOpenedModalId,
    setNestedOpenedModalId,
    isModalVisible,
    setIsModalVisible,
    isNestedModalVisible,
    setIsNestedModalVisible,
    modalPositionClass,
    modalPositionHeightClass,
    setModalVisibility,
    showModal,
    hideModal,
    showNestedModal,
    hideNestedModal,
  };
}

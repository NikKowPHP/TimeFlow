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

export function useModalState({ modalRef }) {
  // TODO: CALCULATE HEIGHT TO ADJUST THE MODAL
  // State of the modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openedModalId, setOpenedModalId] = useState(null);

  const [nestedOpenedModalId, setNestedOpenedModalId] = useState(null);
  const [isNestedModalVisible, setIsNestedModalVisible] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState(// top: "0px",
    // left: "0px",
    null
  );

  // State for modal position
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });

  // Function to explicitly set the visibility of the modal
  const setModalVisibility = (isVisible) => {
    setIsModalVisible(isVisible);
  };

  const handleMouseDown = (event) => {
    console.log("mouseDown");
    if (!dragging) {
      const modal = modalRef.current;
      const modalRect = modal.getBoundingClientRect();

      // const offsetX = event.clientX - modalRect.left;
      // const offsetY = event.clientY- modalRect.top;
      const offsetX = event.clientX;
      const offsetY = event.clientY;
      console.log('offsetX', offsetX)
      console.log('offsetY', offsetY)
      console.log('modalRectLeft', modalRect.left)
      console.log('modalRect', modalRect.top)
      // const offsetX = event.clientX - modalPosition.left;
      // const offsetY = event.clientY - modalPosition.top;
      setDragging(true);
      console.log('mouse down dragging ', dragging )
      setOffset({
        x: offsetX,
        y: offsetY,
      });
    }
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const modal = modalRef.current;
      console.log(dragging);
      if(!modalRef.current) return;
      const left = event.clientX - offset.x;
      const top = event.clientY - offset.y;
      console.log('left', left);
      console.log('top', top);
      console.log('continue');


      setModalPosition({
        left: `${left}px`,
        top: `${top}px`,
      });
    }
  };

  const removeEventListeners = () => {
    modalRef.current?.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    console.log("mouseUp");
    if (dragging) {
      setDragging(false);
      removeEventListeners();
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      modalRef.current.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      adjustModalPosition();
      document.addEventListener("click", handleClickOutside);
    } else {
      removeEventListeners();
      document.removeEventListener("click", handleClickOutside);
    }

    // Clean up the event listeners on unmount
    return () => {
      removeEventListeners();
    };
  }, [isModalVisible, openedModalId, offset, dragging]);

  // useEffect(() => {
  //   if(dragging) {


  //   }

  // }, [dragging, offset])

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

  const handleClickOutside = (event) => {
    // Check if the modal is visible and the click is not the opened modal
    if (isModalVisible && event.target.dataset.modalId !== openedModalId) {
      hideModal();
    }
  };

  // Adjust the modal position based on the mouse click coordinates
  const adjustModalPosition = () => {
    const mouseCoordinates = event && getMouseClickCoordinates(event);
    const modalElement = modalRef.current;
    console.log(modalRef);
    let modalWidth = 400;
    let modalHeight = 400;
    if (modalElement) {
      const modalRect = modalElement.getBoundingClientRect();
      modalWidth = modalRect.width;
      modalHeight = modalRect.height;
    }
    if (modalHeight < 200) {
      modalHeight = 250;
    }

    // TODO: adjust modal position in the wrong place, make it seperate with dragging to trigger
    console.log("modal height", modalHeight);
    console.log("modal width", modalHeight);
    console.log("window width", window.innerWidth); // 749
    console.log("window height", window.innerHeight); // 749
    console.log("mouse coordinates", mouseCoordinates);

    let positionLeft =
      window.innerWidth - modalWidth - mouseCoordinates.x - modalWidth / 3;
    let positionTop = window.innerHeight - modalHeight - mouseCoordinates.y;
    if (positionLeft > 0) {
      positionLeft = 120;
    }

    console.log("position top", positionTop);
    console.log("position left", positionLeft);

    const modalPositionStyles = {
      top: `${positionTop}px`,
      left: `${positionLeft}px`,
    };
    // const modalPositionStyles = {
      // top: positionLeft,
      // left: "100px",
    // };

    setModalPosition(modalPositionStyles);
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
    // adjustModalPosition();
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
    modalPosition,
    setModalVisibility,
    showModal,
    hideModal,
    showNestedModal,
    hideNestedModal,
  };
}

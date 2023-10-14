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
  const [absoluteLeft, setAbsoluteLeft] = useState(0);
  const [absoluteRight, setAbsoluteRight] = useState(0);
  const [absolutePosition, setAbsolutePosition] = useState({});
  const [modalPosition, setModalPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState({});

  // State for modal position
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });

  // Function to explicitly set the visibility of the modal
  const setModalVisibility = (isVisible) => {
    setIsModalVisible(isVisible);
  };

  const getAbsoluteLeftPosition = () => {
    const modal = modalRef.current;
    if (!modalRef.current) return;
    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;

    const stylesLeft = parseFloat(modal.style.left);
    const styleTop = parseFloat(modal.style.top);

    const absoluteLeftCalc = Math.floor(modalRect.left - stylesLeft);
    const absoluteRightCalc = Math.round(
      window.innerWidth - absoluteLeftCalc - (modalWidth +18)
    );
    const absoluteTopCalc = Math.round(modalRect.top - styleTop);
    const absoluteBottomCalc = Math.round(window.innerHeight - absoluteTopCalc - modalHeight);

    const absolutePosition = {
      top: absoluteTopCalc,
      right: absoluteRightCalc,
      bottom: absoluteBottomCalc,
      left: absoluteLeftCalc
    }
    console.log(absolutePosition);
    debugger
    setAbsolutePosition(absolutePosition);
      // TODO: set modal top absolute value and make from this func create general position like the obj top right left 

    setAbsoluteRight(absoluteRightCalc);
    setAbsoluteLeft(absoluteLeftCalc);
    
  };

  const handleMouseDown = (event) => {
    console.log("mouseDown");
    if (!dragging) {
      const modal = modalRef.current;
      const modalComputedStyle = window.getComputedStyle(modal);

      const currentLeft = parseFloat(modalComputedStyle.left);
      const currentTop = parseFloat(modalComputedStyle.top);

      const offsetX = event.clientX - currentLeft;
      const offsetY = event.clientY - currentTop;
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
      
      // Set minimum coordinates
      const minX = -absoluteLeft;
      const minY = -absolutePosition.top
      console.log("minx", minX);

      // Set maximum coordinates
      const maxX = absoluteRight;
      const maxY = absolutePosition.bottom;

      const boundedLeft = Math.min(maxX, Math.max(minX, left));
      const boundedTop = Math.min(maxY, Math.max(minY, top));

      console.log("maxX", maxX);
      console.log("bounded left", boundedLeft);
      console.log("absolute top", boundedTop);

      setModalPosition({
        left: `${boundedLeft}px`,
        top: `${boundedTop}px`,
        userSelect: 'none',
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
      // removeEventListeners();
    }
  };

  useEffect(() => {
    if (openedModalId) {
      adjustModalPosition();
    }
  }, [openedModalId]);

  useEffect(() => {
    getAbsoluteLeftPosition();
  }, [initialPosition]);

  useEffect(() => {
    if (isModalVisible) {
      modalRef.current.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("click", handleClickOutside);
    } else {
      removeEventListeners();
      document.removeEventListener("click", handleClickOutside);
    }

    // Clean up the event listeners on unmount
    return () => {
      removeEventListeners();
    };
  }, [openedModalId, offset, dragging, absoluteLeft]);

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

    let positionLeft = Math.round(
      window.innerWidth - modalWidth - mouseCoordinates.x - modalWidth / 3
    );
    let positionTop = Math.round(
      window.innerHeight - modalHeight - mouseCoordinates.y
    );
    if (positionLeft > 0) {
      positionLeft = 120;
    }

    const modalPositionStyles = {
      top: `${positionTop}px`,
      left: `${positionLeft}px`,
    };
    setModalPosition(modalPositionStyles);
    setInitialPosition({
      left: positionLeft,
      top: positionTop,
    });
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

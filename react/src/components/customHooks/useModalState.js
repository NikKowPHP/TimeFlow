import { useState, useEffect } from "react";
import { modalUtils } from "../../utils/modalUtils";
import { useCalendarState } from "./useCalendarState";
import { toast } from "react-toastify";

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
  const { selectedDate, setSelectedDate, resetDateState, setClickedCellIndex, clickedCellIndex } = useCalendarState();
  // State of the modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openedModalId, setOpenedModalId] = useState(null);

  const [nestedOpenedModalId, setNestedOpenedModalId] = useState(null);
  const [isNestedModalVisible, setIsNestedModalVisible] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [absolutePosition, setAbsolutePosition] = useState({});
  const [modalPosition, setModalPosition] = useState(null);
  const [initialPosition, setInitialPosition] = useState({});

  // Function to explicitly set the visibility of the modal
  const setModalVisibility = (isVisible) => {
    setIsModalVisible(isVisible);
  };

  const disableSelection = (isDisabled) => {
    const rootElement = document.getElementById("root");
    isDisabled
      ? rootElement.classList.add("disable-selection")
      : rootElement.classList.remove("disable-selection");
  };

  function displaySuccessTaskCreation(data) {
    if (data) {
      hideModal();
      setSelectedDate(null);
      setClickedCellIndex(null);
      toast.success(`The task '${data.title}' was successfully created`);
    }
  }

  const getAbsoluteLeftPosition = () => {
    const modal = modalRef.current;
    if (!modalRef.current) return;
    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;

    const modalstyleLeft = parseFloat(modal.style.left);
    const modalStyleTop = parseFloat(modal.style.top);

    const absoluteLeftCalc = Math.floor(modalRect.left - modalstyleLeft);
    const absoluteRightCalc = Math.round(
      window.innerWidth - absoluteLeftCalc - (modalWidth + 18)
    );
    const absoluteTopCalc = Math.round(modalRect.top - modalStyleTop);
    const absoluteBottomCalc = Math.round(
      window.innerHeight - absoluteTopCalc - modalHeight
    );

    const absolutePosition = {
      top: absoluteTopCalc,
      right: absoluteRightCalc,
      bottom: absoluteBottomCalc,
      left: absoluteLeftCalc,
    };
    setAbsolutePosition(absolutePosition);
  };

  const handleMouseDown = (event) => {
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
      const minX = -absolutePosition.left;
      const minY = -absolutePosition.top;

      // Set maximum coordinates
      const maxX = absolutePosition.right;
      const maxY = absolutePosition.bottom;

      const boundedLeft = Math.min(maxX, Math.max(minX, left));
      const boundedTop = Math.min(maxY, Math.max(minY, top));

      disableSelection(true);

      setModalPosition({
        left: `${boundedLeft}px`,
        top: `${boundedTop}px`,
        userSelect: "none", // Disable selection within the modal
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
      disableSelection(false);
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
  }, [openedModalId, offset, dragging, absolutePosition]);

  const handleClickOutside = (event) => {
    // Check if the modal is visible and the click is not the opened modal
    if (isModalVisible && event.target.dataset.modalId !== openedModalId) {
      hideModal();
    }
  };

  // Function handles closing the current modal
  const onModalClose = () => {
    resetDateState();
    hideModal();
  };

  // Adjust the modal position based on the mouse click coordinates
  const adjustModalPosition = () => {
    const mouseCoordinates = event && getMouseClickCoordinates(event);
    const modalElement = modalRef.current;
    console.log(modalRef);
    const modalRect = modalElement.getBoundingClientRect();
    const dimensions = {
      modalWidth: modalRect.width,
      modalHeight: modalRect.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      mouseClickX: mouseCoordinates.x,
      mouseClickY: mouseCoordinates.y,
    };

    const modalHeightOffset = dimensions.modalHeight < 300 ? 1.5 : 1;

    let positionLeft = Math.round(
      dimensions.windowWidth -
        dimensions.modalWidth -
        dimensions.mouseClickX -
        dimensions.modalWidth / 3
    );
    let positionTop = Math.round(
      dimensions.windowHeight -
        dimensions.mouseClickY -
        dimensions.modalHeight * modalHeightOffset
    );
    if (positionLeft > 0) {
      positionLeft = dimensions.modalHeight > 300 ? 120 : 100;
    }
    positionTop = positionTop > 0 ? 0 : positionTop;

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
    onModalClose,
    displaySuccessTaskCreation,
  };
}

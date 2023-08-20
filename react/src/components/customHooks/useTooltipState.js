import { useState, useEffect} from "react";

/**
 * useTooltipState Hook
 *
 * This hook manages the state and behavior of a tooltip.
 *
 * @returns {object} - An object containing tooltip state and functions.
 * @property {boolean} isTooltipVisible - Whether the tooltip is visible or not.
 * @property {string|null} openedTooltipId - The ID of the currently opened tooltip.
 * @property {string} tooltipPositionClass - The class name for tooltip positioning (e.g., "tooltip-left" or "tooltip-right").
 * @property {function} setTooltipVisibility - Function to explicitly set the visibility of the tooltip.
 * @property {function} showTooltip - Function to show the tooltip with the specified tooltipId.
 * @property {function} hideTooltip - Function to hide the tooltip.
 */

export function useTooltipState() {
  // State of the tooltip
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [openedTooltipId, setOpenedTooltipId] = useState(null);

	// State for tooltip position
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });
  const [tooltipPositionClass, setTooltipPositionClass] =
    useState("tooltip-right");

	// Function to explicitly set the visibility of the tooltip
  const setTooltipVisibility = (isVisible) => {
    setIsTooltipVisible(isVisible);
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


  // Event listener to handle clicks outside the tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the tooltip is visible and the click is not the opened tooltip
      if (isTooltipVisible && event.target.dataset.tooltipId !== openedTooltipId) {
        hideTooltip();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.addEventListener("click", handleClickOutside);
    };
  }, [isTooltipVisible, openedTooltipId]);

  // Adjust the tooltip position based on the mouse click coordinates
  const adjustTooltipPosition = () => {
    const mouseCoordinates = getMouseClickCoordinates(event);
    if (mouseCoordinates.x > screenCenter.x) {
      setTooltipPositionClass("tooltip-left");
    } else {
      setTooltipPositionClass("tooltip-right");
    }
  };

  // Get the mouse click coordinates
  const getMouseClickCoordinates = (event) => ({
    x: event.clientX,
    y: event.clientY,
  });

  // Show the tooltip with the specified tooltipId
  const showTooltip = (tooltipId) => {
    setIsTooltipVisible(true);
    setOpenedTooltipId(tooltipId);
    // Adjust the tooltip position based on the click event
    adjustTooltipPosition();
  };
  // Hide the tooltip
  const hideTooltip = () => {
    setIsTooltipVisible(false);
    setOpenedTooltipId(null);
  };

  // Return the state and functions to be used by the component
  return {
    openedTooltipId,
    setOpenedTooltipId,
    isTooltipVisible,
    setIsTooltipVisible,
    tooltipPositionClass,
    setTooltipVisibility,
    showTooltip,
    hideTooltip,
  };
}
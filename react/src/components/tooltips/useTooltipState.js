import { useState, useEffect} from "react";

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
  const adjustTooltipPosition = (event) => {
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

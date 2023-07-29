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
    isTooltipVisible(isVisible);
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
			debugger
      if (isTooltipVisible && event.target.dataset.tooltipId !== openedTooltipId) {
        hideTooltip();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.addEventListener("click", handleClickOutside);
    };
  }, [isTooltipVisible]);

  const adjustTooltipPosition = () => {
    const mouseCoordinates = getMouseClickCoordinates(event);
    if (mouseCoordinates.x > screenCenter.x) {
      setTooltipPositionClass("tooltip-left");
    } else {
      setTooltipPositionClass("tooltip-right");
    }
  };

  const getMouseClickCoordinates = (event) => ({
    x: event.clientX,
    y: event.clientY,
  });

  const showTooltip = (tooltipId) => {
    setIsTooltipVisible(true);
    setOpenedTooltipId(tooltipId);
    adjustTooltipPosition();
  };
  const hideTooltip = () => {
    setIsTooltipVisible(false);
    setOpenedTooltipId(null);
  };

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

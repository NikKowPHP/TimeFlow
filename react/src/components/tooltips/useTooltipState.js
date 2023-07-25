import { useState, useRef, useEffect } from "react";

const useTooltipState = ({tooltipVisible = false,onVisibilityChange = () => {}}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(tooltipVisible);
  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });
  const [tooltipPositionClass, setTooltipPositionClass] =
    useState("tooltip-right");
  const tooltipRef = useRef(null);

  useEffect(() => {
    const calculateScreenCenter = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setScreenCenter({ x: centerX, y: centerY });
    };

    const handleResize = () => {
      calculateScreenCenter();
    };
    calculateScreenCenter();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsTooltipVisible(tooltipVisible);
  }, [tooltipVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsTooltipVisible(false);
        onVisibilityChange(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.addEventListener("click", handleClickOutside);
    };
  }, [onVisibilityChange]);


  const handleMouseClick = (event) => {
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

  const handleTooltipToggle = (event) => {
    handleMouseClick(event);
    setIsTooltipVisible(!isTooltipVisible);
    onVisibilityChange(!isTooltipVisible);
  };
  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  return {
    isTooltipVisible,
    tooltipRef,
    handleMouseClick,
    handleTooltipToggle,
    handleContentClick,
  }

}
export default useTooltipState;
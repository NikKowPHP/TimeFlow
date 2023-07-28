import { useState, createContext, useRef, useEffect, useContext } from "react";

const TooltipContext = createContext();

export const useTooltipContext = () => {
  return useContext(TooltipContext);
};

export const TooltipProvider = ({ children }) => {
  const [tooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');

  const [screenCenter, setScreenCenter] = useState({ x: 0, y: 0 });
  const [tooltipPositionClass, setTooltipPositionClass] = useState("tooltip-right");
  const tooltipRef = useRef(null);

  const showTooltip = (content) => {
    setIsTooltipVisible(true);
    setTooltipContent(content);
  };

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

  const adjustTooltipPosition = (event) => {
    const mouseCoordinates = getMouseClickCoordinates(event);
    if (mouseCoordinates.x > screenCenter.x) {
      setTooltipPositionClass("tooltip-left");
    } else {
      setTooltipPositionClass("tooltip-right");
    }
  }

  const getMouseClickCoordinates = (event) => ({
    x: event.clientX,
    y: event.clientY,
  });

  const handleTooltipToggle = (event) => {
    event.stopPropagation();
    setIsTooltipVisible(!isTooltipVisible);
    onVisibilityChange(!isTooltipVisible);
    adjustTooltipPosition(event);
  };
  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  return {
    isTooltipVisible,
    setIsTooltipVisible,
    tooltipRef,
    handleTooltipToggle,
    handleContentClick,
    tooltipPositionClass,

  }

}
export default useTooltipState;
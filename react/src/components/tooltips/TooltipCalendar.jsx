import React, { useEffect, useState } from "react";
import "../../styles/tooltip.css";
import { useRef } from "react";

export default function Tooltip({
  children,
  content,
  tooltipVisible,
  onVisibilityChange,
  classes = "",
}) {
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
  const handleOnClick = (event) => {
    event.stopPropagation();
    setIsTooltipVisible(!isTooltipVisible);
    onVisibilityChange(!isTooltipVisible);
    adjustTooltipPosition();
  };
  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="tooltip-container" onClick={handleOnClick} ref={tooltipRef}>
      {children}
      {isTooltipVisible && (
        <div
          className={`tooltip ${classes} ${tooltipPositionClass}`}
          onClick={handleContentClick}
        >
          {content}
        </div>
      )}
    </div>
  );
}

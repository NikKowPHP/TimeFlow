import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../../styles/tooltip.css";
import { useRef } from "react";
import useTooltipState from "./useTooltipState";

export default function Tooltip({children = "",content = "",classes = "",
}) {

  const {
    isTooltipVisible,
    tooltipRef,
    handleMouseClick,
    handleTooltipToggle,
    handleContentClick,
  } = useTooltipState();

  return (
    <div className="tooltip-container" onClick={handleMouseClick} ref={tooltipRef}>
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

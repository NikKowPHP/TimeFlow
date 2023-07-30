import "../../styles/tooltip.css";

/**
 * Tooltip component is used to display additional information or details when the user interacts with an element.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content that will trigger the tooltip on interaction.
 * @param {React.ReactNode} props.content - The content to be displayed in the tooltip.
 * @param {string} [props.classes=""] - Additional CSS classes to be applied to the tooltip container.
 * @param {boolean} props.isTooltipVisible - Determines whether the tooltip is visible or not.
 * @param {string} props.tooltipPositionClass - The position class for tooltip placement (e.g., "tooltip-right").
 * @param {string} props.tooltipId - An identifier for the tooltip.
 *
 * @returns {JSX.Element} The JSX representation of the Tooltip component.
 */

export default function Tooltip({
  children,
  content,
  classes = "",
  isTooltipVisible,
  tooltipPositionClass,
  tooltipId,
}) {

   /**
   * Handle click events on the tooltip content to prevent event bubbling.
   * 
   * @param {React.MouseEvent} event - The click event object.
   */
  
  const handleContentClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="tooltip-container">
      {children}

      {isTooltipVisible && (
        <div
          data-tooltip-id={tooltipId}
          className={`tooltip ${classes} ${tooltipPositionClass}`}
          onClick={handleContentClick}
        >
          {content}
        </div>
      )}
    </div>
  );
}

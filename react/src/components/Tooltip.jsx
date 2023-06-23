import React, { useState } from 'react';
import "../styles/tooltip.css";

export default function Tooltip({ children, content}) {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

	const handleOnClick = () => {
		setIsTooltipVisible(!isTooltipVisible);
	}
	const handleContentClick = (event) => {
		event.stopPropagation();
	}

	return (
		<div className='tooltip-container' onClick={handleOnClick}>
			{children}
			{isTooltipVisible && (
				<div className="tooltip" onClick={handleContentClick}>{content}</div>
			)}
		</div>
	)
}

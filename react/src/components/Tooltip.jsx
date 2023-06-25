import React, { useEffect, useState } from 'react';
import "../styles/tooltip.css";

export default function Tooltip({ children, content, tooltipVisible }) {
	const [isTooltipVisible, setIsTooltipVisible] = useState(tooltipVisible);

	useEffect(() => {
		setIsTooltipVisible(tooltipVisible)
	}, [tooltipVisible]);

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

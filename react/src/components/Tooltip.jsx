import React, { useEffect, useState } from 'react';
import "../styles/tooltip.css";

export default function Tooltip({ children, content, tooltipVisible, onVisibilityChange, classes = '' }) {
	const [isTooltipVisible, setIsTooltipVisible] = useState(tooltipVisible);
	const [screenCenter, setScreenCenter] = useState({x: 0, y: 0});
	const [tooltipPositionClass, setTooltipPositionClass] = useState('tooltip-right') ;
	// TODO: SHOW TOOLTIP LEFT OR RIGHTb

	useEffect(() => {
		const calculateScreenCenter = () => {
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			setScreenCenter({x: centerX, y:centerY});
		}
		calculateScreenCenter();

		const handleResize = () => {
			calculateScreenCenter();
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		}

	},[]);

	useEffect(() => {
		setIsTooltipVisible(tooltipVisible)
	}, [tooltipVisible]);

	const adjustTooltipPosition = () => {
		const	mouseCoordinates = getMouseClickCoordinates(event);
		if(mouseCoordinates.x >  screenCenter.x ) {
			setTooltipPositionClass('tooltip-left');
		} else {
			setTooltipPositionClass('tooltip-right');
		}
	}

	const getMouseClickCoordinates = (event) => ({x: event.clientX, y: event.clientY
	});
	const handleOnClick = () => {
		setIsTooltipVisible(!isTooltipVisible);
		onVisibilityChange(!isTooltipVisible);
		adjustTooltipPosition();
	}
	const handleContentClick = (event) => {
		event.stopPropagation();
	}

	return (
		<div className='tooltip-container' onClick={handleOnClick}>
			{children}
			{isTooltipVisible && (
				<div className={`tooltip ${classes} ${tooltipPositionClass}`} onClick={handleContentClick}>{content}</div>
			)}
		</div>
	)
}

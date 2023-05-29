import React from 'react'
import { useState } from 'react';
import '../styles/tooltip.css'

export default function Tooltip({onClick, text, position}) {
	const [showTooltip, setShowTooltip] = useState(false);
	const tooltipStyle = {
		top: position.top ,
		left: position.left ,
	}

	return (
		<div className='tooltip-container' style={tooltipStyle} onClick={onClick}>{text}</div>
	)
}

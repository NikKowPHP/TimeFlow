import React from 'react'

export default function Calendar() {
	return (
		<div className='wrapper'>
			<header>
				<p className="current-date"></p>
				<div className="icons">
					<span id="prev" class="material-symbols-rounded">chevron_left</span>
				</div>
			</header>
		</div>
	)
}

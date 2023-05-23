import React from 'react'
import styles from '../styles/calendar.css';

export default function Calendar() {
	return (
		<div className='calendar-wrapper'>
			<header>
				<p className={styles.current-date}></p>
				<div className={styles.icons}>
					<span id="prev" class="material-symbols-rounded">chevron_left</span>
					<span id="next" class="material-symbols-rounded">chevron_right</span>
				</div>
			</header>
			<div className={styles.calendar}>
				<ul className={styles.weeks}>
					<li>Mon</li>
					<li>Tue</li>
					<li>Wed</li>
					<li>Thu</li>
					<li>Fri</li>
					<li>Sat</li>
					<li>Sun</li>
				</ul>
				<div className={days}></div>
			</div>
		</div>
	)
}

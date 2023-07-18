import React from 'react';
import Tooltip from '../tooltips/Tooltip';

export default function CalendarMonthly({dates, handleActiveTaskState, openTooltipId}) {

    return (
      <div className="calendar-by-month-wrapper">
        <ol className="calendar-by-month-days">
          <li className="day-name">Mon</li>
          <li className="day-name">Tue</li>
          <li className="day-name">Wed</li>
          <li className="day-name">Thu</li>
          <li className="day-name">Fri</li>
          <li className="day-name">Sat</li>
          <li className="day-name">Sun</li>
        </ol>

        <ol className="calendar-by-month-dates">
          {dates.map((date, index) => (
            <Tooltip
              classes="tooltip-task-description"
              key={date}
              tooltipVisible={openTooltipId === date.toLocaleDateString()}
              onVisibilityChange={handleActiveTaskState}
              content={
                <div>
                  <div className="tooltip-tools">
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L3 16.82V21h4.18L20.41 7.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
                      <path d="M9 8h2v9H9zm4 0h2v9h-2z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.8 2L12 10.8 4.8 6h14.4zM4 18V7.87l8 5.33 8-5.33V18H4z"></path>
                    </svg>
                    <svg
                      focusable="false"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                    </svg>
                  </div>
                  <div className="tooltip-task-title">
                    <h2>Create a new event </h2>
                    <p>a new event</p>
                  </div>
                  <div className="tooltip-task-additional">
                    {/* TODO: create notifications */}
                    <div className="tooltip-task-notification">
                      <svg
                        focusable="false"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
                      </svg>
                      <p>in 5 minutes before</p>
                    </div>

                    <div className="tooltip-task-owner">
                      <i className="fa fa-calendar"></i>
                    </div>
                  </div>
                </div>
              }
            >
              <li
                className={`${getActiveDateClass(date)} date`}
                onClick={() => handleTaskClick(date.toLocaleDateString())}
                key={index}
              >
                {date.getDate()}
                {renderDateTasks(date)}
              </li>
            </Tooltip>
          ))}
        </ol>
      </div>
    );
}

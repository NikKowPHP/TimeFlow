import React from "react";
import TruncatedText from "../TruncatedText";

export default function TaskItem({task, classes, handleOnTaskClick, styles, isMobileLayout}) {
  const renderMobileLayout = () => (
    <div className={classes} onClick={handleOnTaskClick} style={styles}>
      <span className="calendar-weekly__task-option__title">
        {<TruncatedText text={task.title} maxCharacters={5} />}
      </span>
    </div>
  )

  const renderDesktopLayout = () => (

    <div className={classes} onClick={handleOnTaskClick} style={styles}>
      <span className="calendar-weekly__task-option__title">
        {<TruncatedText text={task.title} maxCharacters={8} />}
      </span>
      <span className="calendar-weekly__task-option__time">
        {task.time_start}-{task.time_end}
      </span>
    </div>

  )
  return isMobileLayout ? renderMobileLayout() : renderDesktopLayout();
}

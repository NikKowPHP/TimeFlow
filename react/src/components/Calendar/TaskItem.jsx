import React from "react";
import TruncatedText from "../TruncatedText";

export default function TaskItem({task, classes, handleOnTaskClick, styles}) {
  return (
    <div className={classes} onClick={handleOnTaskClick} style={styles}>
      <span className="calendar-weekly__task-option__title">
        {<TruncatedText text={task.title} maxCharacters={8} />}
      </span>
      <span className="calendar-weekly__task-option__time">
        {task.time_start}-{task.time_end}
      </span>
    </div>
  );
}

import React from "react";
import { useState } from "react";
import "../styles/task.css";

export default function Task({ onClick, data }) {
  const [showTask, setShowTask] = useState(false);

  return (
    <div className="task" onClick={onClick}>
      <div className="task-header">
        <div className="task-date">{data.date}</div>
        <div>
          <ul>
            {/* {data.tasks.map((task, index) => (
              <li key={index}>
                <span className="task-time">{task.time}</span>
                <span className="task-title">{task.title}</span>
              </li>
            ))} */}
            <li>
              <span className="task-time">7-14AM</span>
              <span className="task-title">Kitchen</span>
            </li>
            <li>
              <span className="task-time">14-15AM</span>
              <span className="task-title">front</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

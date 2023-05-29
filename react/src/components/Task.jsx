import React from "react";
import { useState } from "react";
import "../styles/tooltip.css";

export default function Task({ onClick, data }) {
  const [showTask, setShowTask] = useState(false);

  return (
    <div className="task-container"  onClick={onClick}>
      <div className="task-content">{data}</div>
    </div>
  );
}

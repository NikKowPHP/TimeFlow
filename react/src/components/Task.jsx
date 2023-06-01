import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/task.css";
import axiosClient from "../axios-client";

export default function Task({ onClick, data }) {
  const [showTask, setShowTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  const getTasks = () => {
    axiosClient.get('/calendar')
    .then(({data})=> {
      setTasks(data.data);

    })
    .catch(error => {
      console.error(error);
      console.log(error);
    });
  }

  useEffect(() => {
    getTasks();
  }, []);


  return (
    <div className="task" onClick={onClick}>
      <div className="task-header">
        <div className="task-date">{data.date}</div>
        <div>
          <ul>
            {
              console.log(tasks)
            }
            {tasks.map((task, index) => (
              <li key={index}>
                <span className="task-time">{task.time_start} - {task.time_end}</span>
                <span className="task-title">{task.title}</span>
              </li>
            ))}



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

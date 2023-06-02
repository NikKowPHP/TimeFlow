import React from 'react'
import axiosClient from '../axios-client'
import Task from './Task'

export default function TaskList() {
	return (
    <div className="task" >
      <div className="task-header">
        <div className="task-date">{selectedDate}</div>
        <div>
          <ul>
              <Task />

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
	)
}

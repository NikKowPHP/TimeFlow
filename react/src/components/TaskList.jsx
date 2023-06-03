import React from 'react'
import axiosClient from '../axios-client'
import Task from './Task'
import "../styles/task.css";

const TaskList = ({selectedDate, tasksArray = [], user = {}}) => {
	return (
    <div className="task" >
      <div className="task-header">
        <div className="task-date">{selectedDate}</div>
        <div>
          <ul>
						{
							tasksArray && 
							tasksArray.map((task, index) => (
								<Task data={{title: task.title, timeStart: task.time_start, timeEnd: task.time_end}} />
							))

						}
          </ul>
        </div>
      </div>
    </div>
	)
}
export default TaskList;

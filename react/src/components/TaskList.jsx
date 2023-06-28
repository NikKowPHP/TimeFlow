import React from 'react'
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
							tasksArray.length > 0 ? 
							tasksArray.map((task, index) => (
								<Task key={index} data={{title: task.title, timeStart: task.time_start, timeEnd: task.time_end}} />
							))
              :
              (
                <h3 style={{textAlign: 'center'}}>There is no tasks for the day</h3>
              )

						}
          </ul>
        </div>
      </div>
    </div>
	)
}
export default TaskList;

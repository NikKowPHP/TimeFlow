import React, { useEffect, useState } from "react";
import { useCalendarState } from "../customHooks/useCalendarState";
import Loading from "../Loading";

export default function CalendarAgenda() {
  const { loading, allTasks } = useCalendarState();

  const [groupedTasks, setGroupedTasks] = useState({});

  useEffect(() => {
		setGroupedTasks(groupTasksByDate());
  }, [allTasks]);


  const sortDaysByOrder = () =>
    allTasks.sort((a, b) => a.date - b.date).reverse();

  const groupTasksByDate = () =>
    sortDaysByOrder().reduce((grouped, task) => {
			const date = task.date;
			if(!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(task);
			return grouped;
		}, {});

  const renderTaskList = () => {
		if(!groupedTasks) return ;

		return Object.entries(groupedTasks).map(([date, tasks]) => (
				<div key={date} className="group-header">{date}
				{tasks.map(task => (
					<div key={task.id}>
						 {task.title}
					</div>
				))}
				</div>
		));

	}
  const renderMainView = () =>
    loading ? (
      <Loading />
    ) : (
      <div className="calendar-agenda-wrapper">
        <div>{renderTaskList()}</div>
      </div>
    );
  return renderMainView();
}

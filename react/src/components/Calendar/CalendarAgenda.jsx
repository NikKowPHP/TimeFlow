import React, { useEffect, useState } from "react";
import { useCalendarState } from "../customHooks/useCalendarState";
import Loading from "../Loading";
import "../../styles/calendar/calendar-agenda.css";

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
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
      return grouped;
    }, {});

  const renderTaskList = () => {
    if (!groupedTasks) return;

    return Object.entries(groupedTasks).map(([date, tasks]) => (
      <div className="calendar-agenda__group-wrapper">
        <div key={date} className="calendar-agenda__group-date">
          {date}
        </div>
        <div className="calendar-agenda__group-info">
          {tasks.map((task) => (
            <div className="calendar-agenda__group-time-title">
              <div className="calendar-agenda__group-time">{task.time_start}-{task.time_end}</div>
              <div className="calendar-agenda__group-title"> {task.title}</div>
            </div>
          ))}
        </div>
      </div>
    ));
  };
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

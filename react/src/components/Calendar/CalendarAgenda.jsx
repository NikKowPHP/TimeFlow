import React, { useEffect, useState } from "react";
import { useCalendarState } from "../customHooks/useCalendarState";
import Loading from "../Loading";
import "../../styles/calendar/calendar-agenda.css";
import { calendarUtils } from "../../utils/calendarUtils";

export default function CalendarAgenda() {
  const { loading, allTasks } = useCalendarState();
  const { formatDateToDDMonDay } = calendarUtils();

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
  const renderGroupTaskDate = (date) => (
    <div key={date} className="calendar-agenda__group-date">
      {formatDateToDDMonDay(date)}
    </div>
  );

  const renderGroupTaskInfo = (task) => (
    <>
      <div className="calendar-agenda__group-time">
        {task.time_start}-{task.time_end}
      </div>
      <div className="calendar-agenda__group-title"> {task.title}</div>
    </>
  );

  const renderTaskList = () => {
    if (!groupedTasks) return;
    return Object.entries(groupedTasks).map(([date, tasks]) => (
      <div className="calendar-agenda__group-wrapper">
        {renderGroupTaskDate(date)}
        <div className="calendar-agenda__group-info">
          {tasks.map((task) => (
            <div className="calendar-agenda__group-time-title">
              {renderGroupTaskInfo(task)}
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

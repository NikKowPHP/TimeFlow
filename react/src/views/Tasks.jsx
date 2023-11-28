import "../styles/tasks/tasks.css";
import React, { useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { connect, useDispatch } from "react-redux";
import { fetchDateTasks } from "../redux/actions/taskActions";
import { dateUtils } from "../utils/dateUtils";
import { calendarUtils } from "../utils/calendarUtils";
import AddNewTaskBtn from "../components/Calendar/items/AddNewTaskBtn";
import { useLocationState } from "../components/customHooks/useLocationState";

function Tasks({ selectedDate, dateTasks, isMobileLayout }) {
  const { loading, setNotification } = useStateContext();
  const { goBack } = useLocationState();
  const dispatch = useDispatch();
  const { convertDateSql } = dateUtils();
  const { weekDays } = calendarUtils();

  useEffect(() => {
    if (!selectedDate) {
      goBack();
    } else {
      const convertedSelectedDate = convertDateSql(
        new Date(selectedDate).toLocaleDateString()
      );
      dispatch(fetchDateTasks(convertedSelectedDate));
    }
  }, [selectedDate]);

  const onDelete = (task) => {
    if (!window.confirm("Do you really want to delete this task?")) {
      return;
    }
    axiosClient.delete(`/tasks/${task.id}`).then(({ data }) => {
      setNotification("The task was successfully deleted");
      getAllTasks();
    });
  };

  const handleOnTaskClick = () => {};
  const renderDesktopContent = () => {};

  const renderMobileContent = () => {
    const selectedDateObject = new Date(selectedDate);
    const selectedDateNumber = selectedDateObject.getDate();
    const selectedDateDay = weekDays()[selectedDateObject.getDay() - 1];

    return (
      <div className=" tasks-date-container">
        <div className="tasks-date-section">
          <h5 className="tasks-date__day">{selectedDateDay}</h5>
          <h2 className="tasks-date__date">{selectedDateNumber}</h2>
        </div>
        <div className="tasks-date__tasks-container">
          {dateTasks.map((task) => (
            <div className="tasks-item-container" onClick={handleOnTaskClick}>
              <h4 className="tasks-item__title">{task.title}</h4>
              <span className="tasks-item__time">
                {task.time_start} - {task.time_end}
              </span>
            </div>
          ))}
        </div>
        <AddNewTaskBtn date={new Date(selectedDate)} />
      </div>
    );
  };
  return (
    <div className="tasks-wrapper">
      {isMobileLayout ? renderMobileContent() : renderDesktopContent()}
    </div>
  );

  // return (
  //   <div>
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "space-between",
  //         alignItems: "center",
  //       }}
  //     >
  //       <h1>Tasks</h1>
  //       <Link className="btn-add" to={"/users/new"}>
  //         Add new
  //       </Link>
  //     </div>
  //     <div className="card animated fadeInDown">
  //       <table>
  //         <thead>
  //           <tr>
  //             <th>ID</th>
  //             <th>Title</th>
  //             <th>Time start</th>
  //             <th>Time end</th>
  //             <th>Actions</th>
  //           </tr>
  //         </thead>

  //         {loading && (
  //           <tbody>
  //             <tr>
  //               <td colSpan={5} className="text-center">
  //                 Loading...
  //               </td>
  //             </tr>
  //           </tbody>
  //         )}

  //         {!loading && (
  //           <tbody>
  //             {allTasks?.length > 0 ? (
  //               allTasks.map((task) => (
  //                 <tr key={task.id}>
  //                   <td>{task.id}</td>
  //                   <td>{task.title}</td>
  //                   <td>{task.time_start}</td>
  //                   <td>{task.time_end}</td>
  //                   <td>
  //                     <Link
  //                       className="btn-edit"
  //                       style={{ marginRight: "5px" }}
  //                       to={"/tasks/" + task.id}
  //                     >
  //                       Edit
  //                     </Link>
  //                     <button
  //                       onClick={(ev) => onDelete(task)}
  //                       className="btn-delete"
  //                     >
  //                       Delete
  //                     </button>
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td>
  //                   <h3>There is no tasks</h3>
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         )}
  //       </table>
  //     </div>
  //   </div>
  // );
}

const mapStateToProps = (state) => ({
  selectedDate: state.calendar.selectedDate,
  dateTasks: state.tasks.dateTasks,
  isMobileLayout: state.app.isMobileLayout,
});
const mapDispatchToProps = {
  fetchDateTasks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);

import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

export default function Tasks() {
  const { loading, setNotification } = useStateContext();
  const [allTasks, setAllTasks] = useState([]);

  const getAllTasks = () => {
    axiosClient.get("/calendar/calendar/").then(({ data: { data } }) => {
      setAllTasks(data);
    });
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const onDelete = (task) => {
    if(!window.confirm('Do you really want to delete this task?')) {
      return;
    }
    axiosClient.delete(`/tasks/${task.id}`)
    .then(({data}) => {
      setNotification('The task was successfully deleted')
      getAllTasks();
    })
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Tasks</h1>
        <Link className="btn-add" to={"/users/new"}>
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Time start</th>
              <th>Time end</th>
              <th>Actions</th>
            </tr>
          </thead>

          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}

          {!loading && (
            <tbody>
              {allTasks.length > 0 ? (
                allTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.time_start}</td>
                    <td>{task.time_end}</td>
                    <td>
                      <Link
                        className="btn-edit"
                        style={{ marginRight: "5px" }}
                        to={"/tasks/" + task.id}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={(ev) => onDelete(task)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td>
                      <h3>There is no tasks</h3>
                    </td>
                  </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

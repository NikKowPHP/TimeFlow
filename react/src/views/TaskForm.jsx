import "../styles/taskForms/newTaskForm.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { toast } from "react-toastify";
import { useLocationState } from "../components/customHooks/useLocationState";
import { connect, useDispatch } from "react-redux";
import { updateTask, updateTasks } from "../redux/actions/taskActions";
import { taskUtils } from "../utils/taskUtils";
import svgPaths from "../components/svgPaths";

function TaskForm({ newTask, updateTasks }) {
  const dispatch = useDispatch();
  const { goBack } = useLocationState();
  const { id } = useParams();

  const [task, setTask] = useState({
    user_id: null,
    title: "",
    date: "",
    time_start: null,
    time_end: null,
    notification_preference: null,
  });

  const { initiateNewTask } = taskUtils({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTask({
      ...initiateNewTask(
        newTask.time_start,
        newTask.time_end,
        newTask.date,
        null
      ),
      user_id: newTask.user_id,
    });

    setLoading(false);
  }, []);
  useEffect(() => {
    console.log(task);
  }, [task]);

  if (id) {
    useEffect(() => {
      const getTask = () => {
        setLoading(true);
        axiosClient
          .get(`/tasks/${id}`)
          .then(({ data }) => {
            setTask(data.data);
            setLoading(false);
          })
          .catch((error) => {
            toast.error("There is no such task");
            setErrors(error.response);
            toast.error(errors);
            console.error(error);
          });
      };
      getTask();
    }, [id]);
  }

  const onSubmitForm = (event) => {
    event.preventDefault();
    if (task.id) {
      axiosClient.put(`/tasks/${task.id}`, task).then(() => {
        dispatch(updateTask(task));
        toast.success("The task was updated");
        setTimeout(() => {
          goBack();
        }, 2000);
      });
    } else {
      axiosClient.post("/tasks", task).then((data) => {
        dispatch(updateTasks(data.data));
        toast.success(`${task.title} has been successfully created`);
        setTimeout(() => {
          goBack();
        }, 2000);
      });
    }
  };

  return (
    <>
      {task.id ? (
        <div>
          <h1>Edit '{task.title}'</h1>
          <div className="card animated fadeInDown">
            {loading && <div className="text-center">Loading ...</div>}
            {!loading && (
              <>
                <form action="" onSubmit={onSubmitForm}>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(ev) =>
                      setTask({ ...task, title: ev.target.value })
                    }
                    placeholder="Task title"
                  />
                  <input
                    type="date"
                    value={task.date}
                    onChange={(ev) =>
                      setTask({ ...task, date: ev.target.value })
                    }
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="time"
                      value={task.time_start}
                      onChange={(ev) =>
                        setTask({ ...task, time_start: ev.target.value })
                      }
                    />
                    <span style={{ padding: "5px", fontWeight: "700" }}>-</span>
                    <input
                      type="time"
                      value={task.time_end}
                      onChange={(ev) =>
                        setTask({ ...task, time_end: ev.target.value })
                      }
                    />
                  </div>
                  <select
                    style={{ marginBottom: "10px" }}
                    defaultValue={task.notification_preference}
                    onChange={(event) =>
                      setTask({
                        ...task,
                        notification_preference: event.target.value,
                      })
                    }
                  >
                    <option value={null}>Do not notify me</option>
                    <option value="1_day_before">1 day before</option>
                    <option value="1_hour_before">1 hour before</option>
                    <option value="15_minutes_before">15 minutes before</option>
                  </select>

                  <div className="task-form__btn-group">
                    <button type="submit" className="btn btn-add">
                      Save
                    </button>
                    <button onClick={goBack} className="btn btn-delete">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="taskForm-wrapper animated fadeInDown">
            <form action="" onSubmit={onSubmitForm}>
              <div className="taskForm__btn-group">
                <button className="btn-close" onClick={goBack}>
                  <svg
                    className="svg-control"
                    focusable="false"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    {svgPaths.close}
                  </svg>
                </button>
                <button type="submit" className="btn btn-add">
                  Save
                </button>
              </div>
              <input
                type="text"
                onChange={(ev) => setTask({ ...task, title: ev.target.value })}
                placeholder="Task title"
              />
              <input
                type="date"
                value={task.date}
                onChange={(ev) => setTask({ ...task, date: ev.target.value })}
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="time"
                  value={task.time_start}
                  onChange={(ev) =>
                    setTask({ ...task, time_start: ev.target.value })
                  }
                />
                <span style={{ padding: "5px", fontWeight: "700" }}>-</span>
                <input
                  type="time"
                  value={task.time_end}
                  onChange={(ev) =>
                    setTask({ ...task, time_end: ev.target.value })
                  }
                />
              </div>
              <select
                style={{ marginBottom: "10px" }}
                className="select select-round"
                defaultValue={task.notification_preference}
                onChange={(event) =>
                  setTask({
                    ...task,
                    notification_preference: event.target.value,
                  })
                }
              >
                <option value={null}>Do not notify me</option>
                <option value="1_day_before">1 day before</option>
                <option value="1_hour_before">1 hour before</option>
                <option value="15_minutes_before">15 minutes before</option>
              </select>
            </form>
          </div>
        )
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  selectedDate: state.calendar.selectedDate,
  newTask: state.tasks.newTask,
});
const mapDispatchToProps = {
  updateTask,
  updateTasks,
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);

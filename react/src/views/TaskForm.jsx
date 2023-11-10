import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { toast } from "react-toastify";
import { useLocationState } from "../components/customHooks/useLocationState";
import { useDispatch } from "react-redux";
import { updateTask } from "../redux/actions/taskActions";

export default function TaskForm() {
  const dispatch = useDispatch();
  const { goBack } = useLocationState();
  const { id } = useParams();
  const [task, setTask] = useState({
    title: "",
    date: null,
    time_start: null,
    time_end: null,
    notification_preference: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
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
    }
  };

  return (
    <>
      {task.id && (
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
                  <select style={{ marginBottom: "10px"}}
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
      )}
    </>
  );
}

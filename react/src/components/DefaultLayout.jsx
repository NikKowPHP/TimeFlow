import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import CalendarAside from "./Calendar/CalendarAside.jsx";
import NotificationListener from "./NotificationListener";
import { useNotificationState } from "./customHooks/useNotificationState";
import Modal from "./modals/Modal";
import { useModalState } from "./customHooks/useModalState";
import NewTask from "./Task/NewTask";
import newTaskHandler from "./Calendar/newTaskHandler";
import { calendarUtils } from "../utils/calendarUtils";
import { connect, useDispatch } from "react-redux";
import {
  clickCell,
  selectDate,
  setLayout,
  setMonth,
} from "../redux/actions/calendarActions";
import { setNewTask, updateTasks } from "../redux/actions/taskActions";
import svgPaths from "./svgPaths";


function DefaultLayout({
  layout,
  setLayout,
  year,
  month,
  currentDate,
  selectedDate,
  allTasks,
  dates,
  newTask,
  setNewTask,
  updateTasks,
  clickedCellIndex,
  clickCell,
}) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const { user, token, notification, errors, setUser, setToken } =
    useStateContext();

  const {
    modalPosition,
    openedModalId,
    hideModal,
    isModalVisible,
    displaySuccessTaskCreation,
    handleOnTriggerClick,
    modalOpacity,
  } = useModalState({
    modalRef: modalRef,
  });
  const { toggleTaskActiveClass } = calendarUtils();

  const { requestNotificationPermission, isNotificationGranted } =
    useNotificationState();

  const { handleTaskCreation, handleDateSelection, handleTimeSelection, handleNotificationSelection } =
    newTaskHandler({
      onDataReceived: displaySuccessTaskCreation,
      dispatch: dispatch,
      updateTasks: updateTasks,
      newTask: newTask,
      setNewTask: setNewTask,
      clickedCellIndex,
      clickCell,
    });
  const navigate = useNavigate();

  // show calendar in aside section
  const location = useLocation().pathname;
  const isCalendar = location.includes("calendar");
  // show/hide aside
  const [asideShown, setAsideShown] = useState(true);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // get user data
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
    if (!isNotificationGranted) requestNotificationPermission();
  }, []);

  // hide/show aside
  const handleToggleAside = () => {
    setAsideShown(!asideShown);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 970) {
        setAsideShown(false);
      } else {
        setAsideShown(true);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      navigate("/login");
    });
  };

  // select type of calendar to show
  const handleOptionSelect = (option) => {
    setLayout(option);
    navigate(`/calendar/${option}`);
  };

  const renderAddNewTaskBtn = () => {
    const id = "addNewTaskBtn";
    const activeClass = toggleTaskActiveClass(
      id,
      openedModalId,
      isModalVisible
    );
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const timePeriodStartObj = currentDate;
    const timePeriodEndObj = new Date();
    timePeriodEndObj.setHours(currentHours + 1);

    return (
      <Modal
      modalOpacity={modalOpacity}
        modalPosition={modalPosition}
        modalRef={modalRef}
        isModalVisible={openedModalId === id}
        classes={`modal-task-description `}
        key={id}
        content={
          <NewTask
            formId={id}
            openedModalId={openedModalId}
            selectedDate={currentDate}
            onDateSelection={handleDateSelection}
            onTimeSelection={handleTimeSelection}
            handleTaskCreation={handleTaskCreation}
            onNotificationSelection={handleNotificationSelection}
            newTaskObj={newTask}
            onModalClose={hideModal}
            onTitleSet={(event) => setNewTask({ title: event.target.value })}
            user={user}
          />
        }
      >
        <div
          onClick={(event) =>
            handleOnTriggerClick({
              event: event,
              modalId: id,
              startTime: timePeriodStartObj,
              endTime: timePeriodEndObj,
              selectedDate: currentDate,
              isNewTask: true,
              allTasks: allTasks,
              setNewTask,
              dispatch,
            })
          }
          className={`btn__add-task-wrapper ${activeClass}`}
        >
          <svg
            className="btn__add-task"
            width="36"
            height="36"
            viewBox="0 0 36 36"
          >
            {svgPaths.addTask}
          </svg>
        </div>
      </Modal>
    );
  };

  return (
    <div id="defaultLayout">
      {/* Notification listener to show notifications from the backend */}
      <NotificationListener />

      <ToastContainer />
      {asideShown && (
        <aside className="default-aside">
          <Link to={"/calendar"}>Calendar</Link>
          <Link to={"/tasks"}>Tasks</Link>

          {user &&
            user.hasOwnProperty("roles") &&
            user.roles.includes("admin") && (
              <>
                <Link to={"/roles"}>Roles</Link>
                <Link to={"/roles/all"}>Role names</Link>
                <Link to={"/users"}>Users</Link>
              </>
            )}

          {isCalendar && (
            <CalendarAside
              dispatch={dispatch}
              selectDate={selectDate}
              year={year}
              currentDate={currentDate}
              selectedDate={selectedDate}
              month={month}
              dates={dates}
              setMonth={setMonth}
            />
          )}
        </aside>
      )}

      <div className="content">
        <header>
          <button className="btn-hamburger" onClick={() => handleToggleAside()}>
            <i className="fa fa-bars"></i>
          </button>
          <div>{user && user.name}</div>

          {/* show selection of calendar types */}
          {isCalendar && (
            <>
              <select
                value={layout}
                onChange={(e) => handleOptionSelect(e.target.value)}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="agenda">Agenda</option>
              </select>
              {renderAddNewTaskBtn()}
            </>
          )}

          <a href="#" onClick={onLogout} className="btn btn-logout">
            Logout
          </a>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
        {errors.message && (
          <div className="notification notification-error">
            {errors.message}
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  layout: state.calendar.layout,
  dates: state.calendar.dates,
  year: state.calendar.year,
  month: state.calendar.month,
  currentDate: state.calendar.currentDate,
  selectedDate: state.calendar.selectedDate,
  clickedCellIndex: state.calendar.clickedCellIndex,
  allTasks: state.tasks.allTasks,
  loading: state.tasks.loading,
  error: state.tasks.error,
  newTask: state.tasks.newTask,
});

const mapDispatchToProps = {
  setLayout,
  selectDate,
  setMonth,
  setNewTask,
  updateTasks,
  clickCell,
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);

import "../styles/default-layout.css";
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
  setYear,
} from "../redux/actions/calendarActions";
import { setNewTask, updateTasks } from "../redux/actions/taskActions";
import svgPaths from "./svgPaths";
import { windowResize } from "../redux/actions/appActions.js";
import ProfileModal from "./modals/ProfileModal.jsx";
import MonthSwitcher from "./Calendar/items/MonthSwitcher.jsx";
import AddNewTaskBtn from "./Calendar/items/AddNewTaskBtn.jsx";

function DefaultLayout({
  layout,
  setLayout,
  year,
  setYear,
  month,
  setMonth,
  currentDate,
  selectedDate,
  allTasks,
  dates,
  newTask,
  setNewTask,
  updateTasks,
  clickedCellIndex,
  clickCell,
  isMobileLayout,
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
  const { toggleTaskActiveClass, getMonthName, goToNextMonth, goToPrevMonth } =
    calendarUtils();

  const { requestNotificationPermission, isNotificationGranted } =
    useNotificationState();

  const {
    handleTaskCreation,
    handleDateSelection,
    handleTimeSelection,
    handleNotificationSelection,
  } = newTaskHandler({
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
  const isCalendarMonthly = location.includes("month");
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
      const isWindowMobile = window.innerWidth < 768;
      if (isWindowMobile !== isMobileLayout) {
        setAsideShown(false);
        dispatch(windowResize(isWindowMobile));
      } else {
        setAsideShown(true);
      }
      isWindowMobile ? setAsideShown(false) : setAsideShown(true);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileLayout, windowResize]);

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
  const renderProfileLink = () => (
    <Link to={"/profile"} className="btn-profile">
      <svg
        width="83px"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        {svgPaths.profileLogo}
      </svg>
    </Link>
  );

  const renderProfileModal = () => {
    const id = "profile";

    return (
      <Modal
        modalOpacity={modalOpacity}
        modalPosition={modalPosition}
        modalRef={modalRef}
        isModalVisible={openedModalId === id}
        classes={`modal-task-description `}
        key={id}
        content={
          <ProfileModal
            onModalClose={hideModal}
            user={user}
            onLogout={onLogout}
          />
        }
      >
        <button
          className="btn-profile"
          onClick={(event) =>
            handleOnTriggerClick({ event: event, modalId: id })
          }
        >
          <svg
            width="83px"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            {svgPaths.profileLogo}
          </svg>
        </button>
      </Modal>
    );
  };

  return (
    <div id="defaultLayout" className="default-layout-container">
      {/* Notification listener to show notifications from the backend */}
      <NotificationListener />

      <ToastContainer />
      <div className="wrapper">
        {/* Dim overlay */}
        <aside
          className={`default-aside-overlay ${
            asideShown ? "aside-active" : ""
          }`}
        >
          <button className="btn-hamburger" onClick={() => handleToggleAside()}>
            <i className="fa fa-bars"></i>
          </button>

          <h3 to={"/calendar"}>Calendar</h3>
          <div
            className="aside__calendar-links"
            onClick={() => setAsideShown(false)}
          >
            <Link to={"/calendar/month"}>Month</Link>
            <Link to={"/calendar/week"}>Week</Link>
            <Link to={"/calendar/agenda"}>Schedule</Link>
          </div>
          <hr className="aside-seperator" />
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

          {isCalendar && !isMobileLayout && (
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
        {asideShown && (
          <div className="dim-overlay" onClick={() => setAsideShown(false)} />
        )}

        <div className="content">
          <header>
            <button
              className="btn-hamburger"
              onClick={() => handleToggleAside()}
            >
              <i className="fa fa-bars"></i>
            </button>
            {!isMobileLayout && (
              <>
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
              </>
            )}
            {isMobileLayout && isCalendarMonthly && (
              <MonthSwitcher
                monthName={getMonthName(month)}
                handleNextMonthClick={() =>
                  goToNextMonth(year, month, setYear, setMonth, dispatch)
                }
                handlePrevMonthClick={() =>
                  goToPrevMonth(year, month, setYear, setMonth, dispatch)
                }
              />
            )}
            {isMobileLayout ? renderProfileLink() : renderProfileModal()}

            {/* <a href="#" onClick={onLogout} className="btn btn-logout">
              Logout
            </a> */}
          </header>
          <main className={isMobileLayout ? "main-mobile" : ""}>
            <Outlet />
            {isMobileLayout && isCalendar && (
              <AddNewTaskBtn date={new Date(currentDate)} />
            )}
          </main>

          {notification && <div className="notification">{notification}</div>}
          {errors.message && (
            <div className="notification notification-error">
              {errors.message}
            </div>
          )}
        </div>
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
  isMobileLayout: state.app.isMobileLayout,
});

const mapDispatchToProps = {
  setLayout,
  selectDate,
  setMonth,
  setYear,
  setNewTask,
  updateTasks,
  clickCell,
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);

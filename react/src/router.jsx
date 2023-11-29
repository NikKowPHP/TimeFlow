import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Users from "./views/Users";
import Signup from "./views/Signup";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import UserForm from "./views/UserForm";
import Calendar from "./components/Calendar/Calendar.jsx";
import Roles from "./views/Roles";
import RoleNames from "./views/RoleNames";
import Tasks from "./views/Tasks";
import TaskForm from "./views/TaskForm";
import GoogleCallback from "./components/GoogleCallback.jsx";
import Task from "./views/tasks/Task.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/calendar" />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/new",
        element: <UserForm key="userCreate" />,
      },
      {
        path: "/users/:id",
        element: <UserForm key="userUpdate" />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/roles/all",
        element: <RoleNames />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/tasks/:date",
        element: <Tasks />,

      },
      {
        path: "/task/:id",
        element: <Task />,
      },
      {
        path: "/tasks/new",
        element: <TaskForm />,
      },
      {
        path: "/calendar",
        element: <Calendar />,
        children: [
          {
            path: "/calendar/month",
            element: <Calendar />,
          },
          {
            path: "/calendar/week",
            element: <Calendar />,
          },
          {
            path: "/calendar/agenda",
            element: <Calendar />,
          },
          {
            path: "/calendar/:date",
            element: <Calendar layout={"month"} />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/login/google",
        element: <GoogleCallback />
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

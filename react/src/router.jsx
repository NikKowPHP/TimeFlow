import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Users from "./views/Users";
import Signup from "./views/Signup";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import UserForm from "./views/UserForm";
import Calendar from "./components/Calendar";
import Roles from "./views/Roles";
import RoleNames from "./views/RoleNames";
import Tasks from "./views/Tasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/users" />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/dashboard",
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
        element: <Roles />
      }, 
      {
        path: "/roles/all",
        element: <RoleNames />
      }, 
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/calendar",
        element: <Calendar/>,
        children: [
          {
            path: "/calendar/month",
            element: <Calendar layout={'month'} />,
          },
          {
            path: "/calendar/week",
            element: <Calendar layout={'week'}/>,
          },
          {
            path: "/calendar/agenda",
            element: <Calendar layout={'agenda'} />,
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

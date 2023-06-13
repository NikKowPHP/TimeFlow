import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Users from "./views/Users";
import Signup from "./views/Signup";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import UserForm from "./views/UserForm";
import RoleForm from "./views/RoleForm";
import Calendar from "./components/Calendar";
import Roles from "./views/Roles";

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
        path: "/roles/new",
        element: <Roles />
      }, 
      {
        path: "/roles/:id",
        element: <RoleForm key="updateRoles"/>
      }, 
      {
        path: "/calendar",
        element: <Calendar />,
        children: [
          {
            path: "/calendar/:id",
            element: <Calendar />,
          },
          {
            path: "/calendar/:date",
            element: <Calendar />,
          },

          {
            path: "/calendar/user/:id",
            element: <Calendar />,
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

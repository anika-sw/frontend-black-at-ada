import { Outlet, Navigate } from "react-router-dom";

import Layout from "./components/Layout"
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import AddEvent from "./pages/AddEvent";
import Directory from "./pages/Directory";
import AddUser from "./pages/AddUser";
import SalaryList from "./pages/SalaryList";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import FourOhFour from "./pages/FourOhFour";
import { AuthProvider } from "./hooks/useAuth";

const MainLayout = () => (
  <AuthProvider>
    <Layout>
      <Outlet />
    </Layout>
  </AuthProvider>
)

export const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        element: <Login />,
        path: "/login"
      },
      {
        element: <Home />,
        path: "/home"
      },
      {
        element: <UserProfile />,
        path: "/profile"
      },
      {
        element: <EventsList />,
        path: "/events",
      },
      {
        element: <EventDetails />,
        path: "/events/:eventId"
      },
      {
        element: <AddEvent />,
        path: "/events/new-event"
      },
      {
        element: <EditEvent />,
        path: "/events/edit-event"
      },
      {
        element: <SalaryList />,
        path: "/salaries"
      },
      {
        element: <Directory />,
        path: "/directory"
      },
      {
        element: <About />,
        path: "/about"
      },
      {
        path: '/404',
        element: <FourOhFour />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />
      },
      {
        path: "/",
        element: <Navigate to="/home" replace />
      },
      {
        path: "",
        element: <Navigate to="/home" replace />
      }
    ]
  },
  {
    element: <AddUser />,
    path: "/signup"
  }
]

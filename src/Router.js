import { Outlet, Navigate } from "react-router-dom";

import Layout from "./components/Layout"
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import AddEvent from "./pages/AddEvent";
import Directory from "./pages/Directory";
import UserDetails from "./pages/UserDetails";
import SalaryList from "./pages/SalaryList";
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
        path: "/login",
      },
      {
        element: <Home />,
        path: "/home"
      },
      {
        element: <EventsList />,
        path: "/events",
        children: [
          {
            element: <EventDetails />,
            path: ":eventId",
          },
          {
            element: <AddEvent />,
            path: ":new-event",
          }
        ]
      },
      {
        element: <SalaryList />,
        path: "/salary-data",
      },
      {
        element: <Directory />,
        path: "/directory",
      },
      {
        path: '/404',
        element: <FourOhFour />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
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
    element: <UserDetails />,
    path: "/user-info",
  }
]

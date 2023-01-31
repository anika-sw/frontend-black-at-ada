import { Outlet, Navigate } from "react-router-dom";

import Layout from "./components/Layout"
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList";
import Directory from "./pages/Directory";
import UserInfo from "./pages/UserInfo";
import EventInfo from "./pages/EventInfo";
import SalaryData from "./pages/SalaryData";
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
        element: <Home />,
        path: "/home",
        children: [
          {
          // element: <Cat />,
          // path: ":catName"
          },
        ]
      },
      {
        element: <EventsList />,
        path: "/events",
      },
      {
        element: <EventInfo />,
        path: "/event-info",
      },
      {
        element: <SalaryData />,
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
    element: <Login />,
    path: "/login",
  },
  {
    element: <UserInfo />,
    path: "/user-info",
  }
]

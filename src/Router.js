import { Outlet, Navigate } from "react-router-dom";

import LayoutWithNav from "./components/LayoutWithNav";
import LayoutNoNav from "./components/LayoutNoNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import UpdateEventForm from "./components/UpdateEventForm";
import AddEvent from "./pages/AddEvent";
import Directory from "./pages/Directory";
import AddUser from "./pages/AddUser";
import SalaryList from "./pages/SalaryList";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";
import FourOhFour from "./pages/FourOhFour";
import { AuthProvider } from "./hooks/useAuth";
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#0995b5' // blue
    },
    secondary: {
      main: '#f7b402' // yellow
    },
    warning: {
      main: '#e7165f' // pink
    },
    typography: {
      fontFamily: 'Poppins'
    },
  },
  mixedCaseButton: {
    textTransform: 'none'
  },
})


const LoginLayout = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <LayoutNoNav>
        <Outlet />
      </LayoutNoNav>
    </AuthProvider>
  </ThemeProvider>
)

const MainLayout = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <LayoutWithNav>
        <Outlet />
      </LayoutWithNav>
    </AuthProvider>
  </ThemeProvider>
)

export const routes = [
  {
    element: <LoginLayout />,
    children: [
      {
        element: <Login />,
        path: "/login"
      },
    ]
  },
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
        element: <UpdateEventForm />,
        path: "/events/:eventId/edit-event"
      },
      {
        element: <AddEvent />,
        path: "/events/new-event"
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

import { useMemo, useState, useEffect, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getItemFromLocalStorage, setItemInLocalStorage } from "../utils";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const mockUser = {
    id: "l;dkfajsd;lfkj",
    name: "Mark",
    email: "mark@cats.com"
  };

  useEffect(() => {
    const localStorageUser = getItemFromLocalStorage('user');

    if (localStorageUser) {
      // set user in state
      setUser(localStorageUser);
      // navigate them wherever we want/they intended to go
      navigate(location.pathname);
    } else {
      navigate('/login');
    }
  }, []);

  const login = () => {
    setUser(mockUser);
    setItemInLocalStorage('user', mockUser);
    navigate("/home");
  };

  const logout = () => {
    setUser(null);
    setItemInLocalStorage('user', null);
    navigate('/login');
  };

  // memoize the value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
    user,
    login,
    logout
  }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
  return useContext(AuthContext);
};
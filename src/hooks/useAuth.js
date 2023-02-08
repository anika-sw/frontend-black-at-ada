import { useMemo, useState, useEffect, createContext, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getItemFromLocalStorage, setItemInLocalStorage } from "../utils";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [location.pathname, navigate]);

  const login = useCallback((authUser) => {
    setUser(authUser);
    setItemInLocalStorage('user', authUser);
    navigate("/home");
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setItemInLocalStorage('user', null);
    navigate('/login');
  }, [navigate]);

  // memoize the value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
    user,
    login,
    logout
  }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
  return useContext(AuthContext);
};
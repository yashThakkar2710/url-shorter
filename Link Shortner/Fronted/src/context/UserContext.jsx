import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/current-user");
      if (response.data.success) {
        setUserAuth(true);
        setUser(response.data.user);
      } else {
        setUserAuth(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUserAuth(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    userAuth,
    setUserAuth,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


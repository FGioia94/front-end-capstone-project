import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  /*
   * This component provides user authentication context.
   * It manages user state, login status, and role-based access.
   * initially i wanted to use contexts for user management instead of redux
   * but i ended up using redux for most of it as i noticed the professor wanted redux to be used
   * however, this context is still useful for managing some user-related state.
   *
   * @param {JSX.Element} children - The child components that will use the context.
   * @returns {JSX.Element} The UserProvider component.
   */

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username, role = "user") => {
    const userData = { username, role, loginTime: new Date().toISOString() };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, isAdmin, isUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

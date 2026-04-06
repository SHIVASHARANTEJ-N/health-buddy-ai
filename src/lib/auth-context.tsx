import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB, User } from './db';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null, login: () => {}, logout: () => {}, isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = DB.getSession();
    if (session?.mobile) {
      const users = DB.getUsers();
      if (users[session.mobile]) setUser(users[session.mobile]);
    }
  }, []);

  const login = (u: User) => {
    setUser(u);
    DB.saveSession(u);
  };

  const logout = () => {
    setUser(null);
    DB.clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

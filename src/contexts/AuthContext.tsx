import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (userData: { username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!Cookies.get('token'));
  const [user, setUser] = useState<{ username: string } | null>(null);

  const login = (userData: { username: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    console.log("Auth Context: User logged in", userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
    console.log("Auth Context: User logged out");
  };

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
  }), [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
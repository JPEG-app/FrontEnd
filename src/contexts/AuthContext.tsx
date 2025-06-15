import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { StreamChat } from 'stream-chat';
import { User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  streamChat?: StreamChat;
  login: (token: string, streamToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [streamChat, setStreamChat] = useState<StreamChat>();
  const [streamToken, setStreamToken] = useLocalStorage<string>("streamToken");

  const isAuthenticated = user != null;

  useEffect(() => {
    const connectUser = async (currentUser: User, token: string) => {
        const chat = new StreamChat("d683phfa73sf");
        await chat.connectUser(
          { id: currentUser.id, name: currentUser.name, image: currentUser.avatarUrl },
          token
        );
        setStreamChat(chat);
    };

    if (user && streamToken) {
      connectUser(user, streamToken);
    }

    return () => {
        setStreamChat(undefined);
        streamChat?.disconnectUser();
    };
  }, [user, streamToken]);


  useEffect(() => {
    const fetchUserOnLoad = async () => {
      const token = Cookies.get('token');
      if (token && !user) {
        try {
          const authHeader = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get('https://api.jpegapp.lol/users/me', authHeader);
          const currentUser: User = {
            id: data.id,
            name: data.username,
            handle: `@${data.username.toLowerCase()}`,
            createdAt: new Date(),
          };
          setUser(currentUser);
        } catch {
          logout();
        }
      }
    };
    fetchUserOnLoad();
  }, []);

  const login = async (token: string, streamToken: string) => {
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'lax' });
    setStreamToken(streamToken);
    
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get('https://api.jpegapp.lol/users/me', authHeader);
    const currentUser: User = {
      id: data.id,
      name: data.username,
      handle: `@${data.username.toLowerCase()}`,
      createdAt: new Date(),
    };
    setUser(currentUser);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setStreamToken(undefined);
    streamChat?.disconnectUser();
  };

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    streamChat,
  }), [isAuthenticated, user, streamChat]);

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

export function useLoggedInAuth() {
  const context = useContext(AuthContext);
  if (context?.user == null || context?.streamChat == null) {
      throw new Error("useLoggedInAuth must be used within an authenticated context");
  }
  return { ...context, user: context.user, streamChat: context.streamChat };
}
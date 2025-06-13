// src/contexts/LikesContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthContext } from './AuthContext'; // We need this to know if the user is logged in

interface LikesContextType {
  likedPostIds: Set<string>;
  addLike: (postId: string) => void;
  removeLike: (postId: string) => void;
  isLoading: boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const LikesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch likes if the user is authenticated
    if (!isAuthenticated) {
      setLikedPostIds(new Set()); // Clear likes on logout
      setIsLoading(false);
      return;
    }

    const fetchUserLikes = async () => {
      setIsLoading(true);
      const token = Cookies.get('token');
      try {
        const response = await axios.get('https://api.jpegapp.lol/users/me/likes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming the response is { likedPostIds: ["id1", "id2"] }
        setLikedPostIds(new Set(response.data.likedPostIds));
      } catch (error) {
        console.error("Failed to fetch user likes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLikes();
  }, [isAuthenticated]); // Re-fetch when authentication state changes

  const addLike = (postId: string) => {
    setLikedPostIds(prev => new Set(prev).add(postId));
  };

  const removeLike = (postId: string) => {
    setLikedPostIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const value = useMemo(() => ({
    likedPostIds,
    addLike,
    removeLike,
    isLoading
  }), [likedPostIds, isLoading]);

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = (): LikesContextType => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
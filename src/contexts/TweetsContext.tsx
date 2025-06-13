import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Tweet, ApiFeedItem } from '../types';
import { useLikes } from './LikesContext';

interface TweetsContextType {
  tweets: Map<string, Tweet>;
  fetchFeed: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  handleLikeToggle: (tweetId: string, isCurrentlyLiked: boolean) => Promise<void>;
  addOptimisticTweet: (tweet: Tweet) => void;
  removeOptimisticTweet: (tweetId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const TweetsContext = createContext<TweetsContextType | undefined>(undefined);

const mapApiItemToTweet = (apiItem: any): Tweet => {
  return {
    id: apiItem.postId || apiItem.id,
    author: { id: apiItem.userId, name: apiItem.authorUsername, handle: `@${apiItem.authorUsername.toLowerCase()}` },
    title: apiItem.postTitle || apiItem.title,
    content: apiItem.postContent || apiItem.content,
    createdAt: new Date(apiItem.createdAt),
    imageUrl: apiItem.imageUrl,
    stats: { replies: apiItem.commentCount ?? 0, likes: apiItem.likeCount ?? 0, views: 0, retweets: 0 },
  };
};

export const TweetsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tweets, setTweets] = useState<Map<string, Tweet>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addLike: addLikeToContext, removeLike: removeLikeFromContext } = useLikes();

  const updateTweets = (newTweets: Tweet[]) => {
    setTweets(prevTweets => {
      const updatedMap = new Map(prevTweets);
      newTweets.forEach(tweet => updatedMap.set(tweet.id, tweet));
      return updatedMap;
    });
  };

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiFeedItem[]>('https://api.jpegapp.lol/feed');
      const mappedTweets = response.data.map(item => mapApiItemToTweet(item));
      updateTweets(mappedTweets);
    } catch (err) {
      setError("Failed to fetch feed.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchUserPosts = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const postsResponse = await axios.get(`https://api.jpegapp.lol/users/${userId}/posts`, authHeader);
    //   const authorDetails = { id: userId, name: postsResponse.data[0]?.authorUsername, handle: `@${postsResponse.data[0]?.authorUsername?.toLowerCase()}`};
      const mappedTweets = postsResponse.data.map((p: any) => mapApiItemToTweet(p));
      updateTweets(mappedTweets);
    } catch (err) {
      setError("Failed to fetch user posts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLikeToggle = useCallback(async (tweetId: string, isCurrentlyLiked: boolean) => {
    const token = Cookies.get('token');
    if (!token || tweetId.startsWith('temp-')) return;

    if (isCurrentlyLiked) removeLikeFromContext(tweetId); else addLikeToContext(tweetId);
    
    setTweets(prev => {
      const newTweets = new Map(prev);
      const tweet = newTweets.get(tweetId);
      if (tweet) {
        const newLikes = (tweet.stats?.likes ?? 0) + (isCurrentlyLiked ? -1 : 1);
        newTweets.set(tweetId, { ...tweet, stats: { ...tweet.stats, likes: newLikes } });
      }
      return newTweets;
    });

    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      if (isCurrentlyLiked) await axios.delete(`https://api.jpegapp.lol/posts/${tweetId}/like`, authHeader);
      else await axios.post(`https://api.jpegapp.lol/posts/${tweetId}/like`, {}, authHeader);
    } catch (err) {
      if (isCurrentlyLiked) addLikeToContext(tweetId); else removeLikeFromContext(tweetId);
      setTweets(prev => {
        const newTweets = new Map(prev);
        const tweet = newTweets.get(tweetId);
        if (tweet) {
          const revertedLikes = (tweet.stats?.likes ?? 0) + (isCurrentlyLiked ? 1 : -1);
          newTweets.set(tweetId, { ...tweet, stats: { ...tweet.stats, likes: revertedLikes } });
        }
        return newTweets;
      });
    }
  }, [addLikeToContext, removeLikeFromContext]);
  
  const addOptimisticTweet = (tweet: Tweet) => {
    setTweets(prev => new Map(prev).set(tweet.id, tweet));
  };

  const removeOptimisticTweet = (tweetId: string) => {
    setTweets(prev => {
      const newMap = new Map(prev);
      newMap.delete(tweetId);
      return newMap;
    });
  };

  const value = { tweets, fetchFeed, fetchUserPosts, handleLikeToggle, addOptimisticTweet, removeOptimisticTweet, isLoading, error };

  return <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>;
};

export const useTweets = (): TweetsContextType => {
  const context = useContext(TweetsContext);
  if (!context) throw new Error('useTweets must be used within a TweetsProvider');
  return context;
};
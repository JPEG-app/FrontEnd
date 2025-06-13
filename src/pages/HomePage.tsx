// src/pages/HomePage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useVirtualizer } from '@tanstack/react-virtual';
import TweetCard from '../components/tweet/TweetCard';
import ComposeTweet from '../components/tweet/ComposeTweet';
import { Tweet, ApiFeedItem } from '../types';
import { useLikes } from '../contexts/LikesContext';

const mapApiItemToTweet = (apiItem: ApiFeedItem): Tweet => {
  const authorInfo = { id: apiItem.userId, name: apiItem.authorUsername, handle: `@${apiItem.authorUsername.toLowerCase().replace(/\s+/g, '')}` };
  return { id: apiItem.postId, author: authorInfo, title: apiItem.postTitle, content: apiItem.postContent, createdAt: new Date(apiItem.createdAt), imageUrl: apiItem.imageUrl, stats: { replies: apiItem.commentCount ?? 0, retweets: 0, likes: apiItem.likeCount ?? 0, views: 0 } };
};

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addLike: addLikeToContext, removeLike: removeLikeFromContext } = useLikes();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    measureElement: useCallback((element: Element) => element.getBoundingClientRect().height, []),
    overscan: 5,
  });

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiFeedItem[]>('https://api.jpegapp.lol/feed');
      const mappedTweets = response.data.map(mapApiItemToTweet).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTweets(mappedTweets);
    } catch (err) {
      setError("Failed to fetch feed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    window.addEventListener('focus', fetchFeed);
    return () => {
      window.removeEventListener('focus', fetchFeed);
    };
  }, [fetchFeed]);

  const handleTweetPosted = async (newlyComposedTweet: Partial<Tweet>) => {
    const tempId = `temp-${Date.now()}`;
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error("Not logged in");
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const userResponse = await axios.get<{ id: string, username: string }>('https://api.jpegapp.lol/users/me', authHeader);
      const { id: userId, username } = userResponse.data;
      const optimisticTweet: Tweet = { id: tempId, author: { id: userId, name: username, handle: `@${username.toLowerCase()}` }, createdAt: new Date(), content: newlyComposedTweet.content || '', title: newlyComposedTweet.title || '', stats: { replies: 0, retweets: 0, likes: 0, views: 0 } };
      setTweets(prev => [optimisticTweet, ...prev]);
      await axios.post('https://api.jpegapp.lol/posts', { userId, title: newlyComposedTweet.title || "", content: newlyComposedTweet.content || "" }, authHeader);
    } catch (error) {
      console.error('Failed to post tweet:', error);
      setTweets(prev => prev.filter(t => t.id !== tempId));
    }
  };

  const handleLikeToggle = async (tweetId: string, isCurrentlyLiked: boolean) => {
    const token = Cookies.get('token');
    if (!token || tweetId.startsWith('temp-')) return;
    
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };
    
    if (isCurrentlyLiked) {
      removeLikeFromContext(tweetId); 
      await axios.delete(`https://api.jpegapp.lol/posts/${tweetId}/like`, authHeader);
      isCurrentlyLiked = !isCurrentlyLiked; }
    else {
      addLikeToContext(tweetId);
      await axios.post(`https://api.jpegapp.lol/posts/${tweetId}/like`, {}, authHeader);
      isCurrentlyLiked = !isCurrentlyLiked;
    }
    
    setTweets(await axios.get('https://api.jpegapp.lol/posts/${tweetId}/likes/count'));
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75 flex-shrink-0"><h1 className="font-bold text-xl p-4">Home</h1></div>
      <div className='flex-shrink-0 border-b border-gray-700/75'><ComposeTweet onTweetPosted={handleTweetPosted} /></div>
      <div ref={parentRef} className="flex-grow overflow-auto hide-scrollbar">
        {isLoading && (<div className="p-4 text-center">Loading feed...</div>)}
        {error && !isLoading && (<div className="p-4 text-center text-red-500">{error}</div>)}
        {!isLoading && !error && tweets.length === 0 && (<div className="p-4 text-center">No tweets yet.</div>)}
        {!isLoading && !error && tweets.length > 0 && (
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map(v => {
              const tweet = tweets[v.index];
              return tweet ? <div key={tweet.id} ref={rowVirtualizer.measureElement} data-index={v.index} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${v.start}px)` }}><TweetCard tweet={tweet} onLikeToggle={handleLikeToggle} /></div> : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
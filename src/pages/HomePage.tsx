// src/pages/HomePage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useVirtualizer } from '@tanstack/react-virtual';
import TweetCard from '../components/tweet/TweetCard';
import ComposeTweet from '../components/tweet/ComposeTweet';
import { Tweet } from '../types';
import { useTweets } from '../contexts/TweetsContext';

const HomePage: React.FC = () => {
  const { tweets, isLoading, error, fetchFeed, handleLikeToggle, addOptimisticTweet, removeOptimisticTweet } = useTweets();
  const [postError, setPostError] = useState<string | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const tweetsArray = Array.from(tweets.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  const rowVirtualizer = useVirtualizer({
    count: tweetsArray.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
  });

  const handleTweetPosted = async (newlyComposedTweet: Partial<Tweet>) => {
    const tempId = `temp-${Date.now()}`;
    const token = Cookies.get('token');
    if (!token) { setPostError("You must be logged in to post."); return; }

    try {
      const userResponse = await axios.get<{ id: string, username: string }>('https://api.jpegapp.lol/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const { id: userId, username } = userResponse.data;
      
      const fullOptimisticTweet: Tweet = {
        id: tempId,
        author: { id: userId, name: username, handle: `@${username.toLowerCase()}` },
        createdAt: new Date(),
        content: newlyComposedTweet.content || '',
        title: newlyComposedTweet.title || '',
        stats: { replies: 0, retweets: 0, likes: 0, views: 0 },
      };
      addOptimisticTweet(fullOptimisticTweet);
      
      await axios.post('https://api.jpegapp.lol/posts', { userId, title: newlyComposedTweet.title || "", content: newlyComposedTweet.content || "" }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      setPostError("Failed to post tweet.");
      removeOptimisticTweet(tempId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75 flex-shrink-0"><h1 className="font-bold text-xl p-4">Home</h1></div>
      <div className='flex-shrink-0 border-b border-gray-700/75'><ComposeTweet onTweetPosted={handleTweetPosted} /></div>
      <div ref={parentRef} className="flex-grow overflow-auto hide-scrollbar">
        {isLoading && tweets.size === 0 && <div className="p-4 text-center">Loading feed...</div>}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}
        {postError && <div className="p-4 text-center text-red-500">{postError}</div>}
        {!isLoading && tweets.size === 0 && !error && <div className="p-4 text-center">No tweets yet.</div>}
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(v => {
            const tweet = tweetsArray[v.index];
            return tweet ? <div key={tweet.id} data-index={v.index} style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${v.start}px)` }}><TweetCard tweet={tweet} onLikeToggle={handleLikeToggle} /></div> : null;
          })}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
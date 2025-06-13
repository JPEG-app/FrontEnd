// src/pages/HomePage.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useVirtualizer } from '@tanstack/react-virtual';
import TweetCard from '../components/tweet/TweetCard';
import ComposeTweet from '../components/tweet/ComposeTweet';
import { Tweet, ApiFeedItem, Author } from '../types';
import { useLikes } from '../contexts/LikesContext'; // Import the global LikesContext hook

const mapApiItemToTweet = (apiItem: ApiFeedItem): Tweet => {
  const authorInfo: Author = {
    id: apiItem.userId,
    name: apiItem.authorUsername,
    handle: `@${apiItem.authorUsername.toLowerCase().replace(/\s+/g, '')}`,
    avatarUrl: undefined, 
  };

  return {
    id: apiItem.postId,
    author: authorInfo,
    title: apiItem.postTitle,
    content: apiItem.postContent,
    createdAt: new Date(apiItem.createdAt),
    imageUrl: apiItem.imageUrl,
    stats: {
      replies: apiItem.commentCount ?? 0,
      retweets: 0,
      likes: apiItem.likeCount ?? 0,
      views: 0,
    },
  };
};

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Consume the global context to update the user's liked status (for the heart color)
  const { addLike: addLikeToContext, removeLike: removeLikeFromContext } = useLikes();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    measureElement: useCallback((element: Element) => element.getBoundingClientRect().height, []),
    overscan: 5,
  });

  useEffect(() => {
    const fetchFeed = async () => {
      // ... (This function remains unchanged)
    };
    fetchFeed();
  }, []);

  const handleTweetPosted = async (newlyComposedTweet: Partial<Tweet>) => { 
    // ... (This function remains unchanged)
  };

  // --- Like/Unlike Logic now lives in the parent component ---
  const handleLikeToggle = async (tweetId: string, isCurrentlyLiked: boolean) => {
    const token = Cookies.get('token');
    if (!token || tweetId.startsWith('temp-')) return;

    // 1. Optimistic Global State Update (for heart color)
    if (isCurrentlyLiked) {
      removeLikeFromContext(tweetId);
    } else {
      addLikeToContext(tweetId);
    }

    // 2. Optimistic Local Data Update (for the like count number)
    // This updates the main 'tweets' array directly.
    setTweets(currentTweets =>
      currentTweets.map(t => {
        if (t.id === tweetId) {
          const currentLikes = t.stats?.likes ?? 0;
          return {
            ...t,
            stats: {
              ...t.stats,
              likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1,
            },
          };
        }
        return t;
      })
    );

    // 3. API Call in the background
    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      if (isCurrentlyLiked) {
        await axios.delete(`https://api.jpegapp.lol/posts/${tweetId}/like`, authHeader);
      } else {
        await axios.post(`https://api.jpegapp.lol/posts/${tweetId}/like`, {}, authHeader);
      }
    } catch (err) {
      console.error("Failed to update like status:", err);
      // 4. Rollback on API failure
      if (isCurrentlyLiked) {
        addLikeToContext(tweetId); // Add it back to context
      } else {
        removeLikeFromContext(tweetId); // Remove it from context
      }
      // Revert the count in the main tweets array
      setTweets(currentTweets =>
        currentTweets.map(t => {
          if (t.id === tweetId) {
            const currentLikes = t.stats?.likes ?? 0;
            // Note: the logic is reversed here for the rollback
            return {
              ...t,
              stats: {
                ...t.stats,
                likes: isCurrentlyLiked ? currentLikes + 1 : currentLikes - 1,
              },
            };
          }
          return t;
        })
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75 flex-shrink-0">
        <h1 className="font-bold text-xl p-4">Home</h1>
      </div>
      <div className='flex-shrink-0 border-b border-gray-700/75'>
        <ComposeTweet onTweetPosted={handleTweetPosted} />
      </div>

      <div ref={parentRef} className="flex-grow overflow-auto hide-scrollbar">
        {isLoading && ( <div className="text-gray-400 p-4 text-center">Loading feed...</div> )}
        {error && !isLoading && ( <div className="text-red-400 p-4 text-center">Error: {error}</div> )}
        {!isLoading && !error && tweets.length === 0 && ( <div className="text-gray-400 p-4 text-center">No tweets yet. Create one!</div> )}
        {!isLoading && !error && tweets.length > 0 && (
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const tweet = tweets[virtualItem.index];
              if (!tweet) return null;
              return (
                <div
                  key={tweet.id}
                  ref={node => { if (node) { rowVirtualizer.measureElement(node); }}}
                  data-index={virtualItem.index}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
                >
                  {/* Pass the handler function down to each TweetCard */}
                  <TweetCard tweet={tweet} onLikeToggle={handleLikeToggle} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
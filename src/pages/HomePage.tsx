import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useVirtualizer } from '@tanstack/react-virtual';
import TweetCard from '../components/tweet/TweetCard';
import ComposeTweet from '../components/tweet/ComposeTweet';
import { Tweet, ApiFeedItem, Author } from '../types';
import { Filter } from 'bad-words';

const mapApiItemToTweet = (apiItem: ApiFeedItem): Tweet => {
  const authorInfo: Author = {
    id: apiItem.userId,
    name: apiItem.authorUsername || `User ${apiItem.userId}`,
    handle: `@${(apiItem.authorUsername || `user${apiItem.userId}`).toLowerCase().replace(/\s+/g, '')}`,
    avatarUrl: undefined,
  };

  return {
    id: apiItem.postId,
    userId: apiItem.userId,
    author: authorInfo,
    title: apiItem.title,
    content: apiItem.content,
    createdAt: new Date(apiItem.createdAt),
    imageUrl: apiItem.imageUrl,
    hasUserLiked: apiItem.hasUserLiked || false,
    likeCount: apiItem.likeCount || 0
  };
};

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [isAuthorLoading, setIsAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    overscan: 5,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsAuthorLoading(true);
      setAuthorError(null);
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error("Authentication token not found.");
        
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        const userResponse = await axios.get<{ id: string, username: string }>('https://api.jpegapp.lol/users/me', authHeader);
        const { id: userId, username } = userResponse.data;

        if (!userId || !username) throw new Error("Could not retrieve user details.");
        
        const currentUserAuthor: Author = {
          id: userId,
          name: username,
          handle: `@${username.toLowerCase().replace(/\s+/g, '')}`,
          avatarUrl: undefined, 
        };
        setAuthor(currentUserAuthor);
      } catch (err: any) {
        setAuthorError(err.message || "Failed to fetch user.");
      } finally {
        setIsAuthorLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchData = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error("Authentication token not found.");
      
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      let response;

      if (query.trim()) {
        const searchUrl = `https://api.jpegapp.lol/search?q=${encodeURIComponent(query)}`;
        response = await axios.get<ApiFeedItem[]>(searchUrl, authHeader);
      } else {
        response = await axios.get<ApiFeedItem[]>('https://api.jpegapp.lol/feed', authHeader);
      }

      if (response.data && Array.isArray(response.data)) {
        const mappedTweets = response.data.map(mapApiItemToTweet);
        mappedTweets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setTweets(mappedTweets);
      } else {
        throw new Error("Data is not in the expected array format");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!isAuthorLoading) {
        fetchData(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery, isAuthorLoading, fetchData]);

  const handleTweetPosted = async (newlyComposedTweet: Tweet) => {
    const filter = new Filter();
    const title = newlyComposedTweet.title || "";
    const content = newlyComposedTweet.content;

    const isTitleProfane = filter.isProfane(title);
    const isContentProfane = filter.isProfane(content);

    if (isTitleProfane || isContentProfane) {
      setError("Your tweet contains inappropriate language. Please edit and try again.");
      return;
    }

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error("Authentication token not found.");
      
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      const optimisticallyAddedTweet: Tweet = {
        ...newlyComposedTweet,
        id: `temp-${Date.now()}`,
        author: author as Author, 
        createdAt: new Date(),
        likeCount: 0,
        hasUserLiked: false
      };

      setTweets(prevTweets => [optimisticallyAddedTweet, ...prevTweets]);

      const payload = {
        userId: author?.id,
        title,
        content,
      };

      const postResponse = await axios.post('https://api.jpegapp.lol/posts', payload, authHeader);
      console.log('Tweet posted to backend, will update via Kafka feed', postResponse.data);
    } catch (error) {
      setTweets(prevTweets => prevTweets.filter(t => !t.id.startsWith('temp-')));
      setError("Failed to post your tweet. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75 flex-shrink-0">
        <h1 className="font-bold text-xl p-4">Home</h1>
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/80 rounded-full px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-twitter-blue focus:bg-gray-900"
          />
        </div>
      </div>
      
      {!searchQuery && (
        <div className='flex-shrink-0 border-b border-gray-700/75'>
          {isAuthorLoading && <div className="p-4 text-center text-gray-400">Loading user...</div>}
          {authorError && <div className="p-4 text-center text-red-400">{authorError}</div>}
          {author && <ComposeTweet onTweetPosted={handleTweetPosted} author={author}/>}
        </div>
      )}

      <div ref={parentRef} className="flex-grow overflow-auto hide-scrollbar">
        {isLoading && <div className="text-gray-400 p-4 text-center">Loading...</div>}
        {error && !isLoading && <div className="text-red-400 p-4 text-center">Error: {error}</div>}
        
        {!isLoading && !error && tweets.length === 0 && (
          <div className="text-gray-400 p-4 text-center">
            {searchQuery ? `No results found for "${searchQuery}"` : "Your feed is empty. Follow some users!"}
          </div>
        )}

        {!isLoading && !error && tweets.length > 0 && (
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const tweet = tweets[virtualItem.index];
              if (!tweet) return null;
              return (
                  <div
                    key={tweet.id}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualItem.index}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
                  >
                    <TweetCard key={tweet.id} tweet={tweet} />
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
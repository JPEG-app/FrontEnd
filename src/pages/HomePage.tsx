import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useVirtualizer } from '@tanstack/react-virtual';
import TweetCard from '../components/tweet/TweetCard';
import ComposeTweet from '../components/tweet/ComposeTweet';
import { Tweet, ApiFeedItem, Author } from '../types';

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
    title: apiItem.title,
    content: apiItem.content,
    createdAt: new Date(apiItem.createdAt),
    imageUrl: apiItem.imageUrl,
    hasUserLiked: apiItem.hasUserLiked,
    likeCount: apiItem.likeCount || 0
  };
};

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState<Author>();
  const [isAuthorLoading, setIsAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState<string | null>(null);
  
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    measureElement: useCallback((element: Element) => {
      return element.getBoundingClientRect().height;
    }, []),
    overscan: 5,
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsAuthorLoading(true);
      setAuthorError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error("Authentication token not found.");
        }
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        
        const userResponse = await axios.get<{ id: string, username: string }>('https://api.jpegapp.lol/users/me', authHeader);
        const { id: userId, username } = userResponse.data;

        if (!userId || !username) {
          throw new Error("Could not retrieve user details.");
        }

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

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiFeedItem[]>('https://api.jpegapp.lol/feed');
        console.log("Raw feed data from API:", response.data);

        if (response.data && Array.isArray(response.data)) {
          const mappedTweets = response.data.map(mapApiItemToTweet);
          mappedTweets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          setTweets(mappedTweets);
        } else {
          console.error("Unexpected feed data format. Expected an array, got:", response.data);
          throw new Error("Feed data is not in the expected array format");
        }
      } catch (err: any) {
        let errorMessage = "An unknown error occurred while fetching the feed.";
        if (err.message) { errorMessage = err.message; }
        setError(errorMessage);
        console.error("Feed fetch error object:", err);
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleTweetPosted = async (newlyComposedTweet: Tweet) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error("Authentication token not found.");
      }
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
        title: newlyComposedTweet.title || "",
        content: newlyComposedTweet.content,
      };

      const postResponse = await axios.post('https://api.jpegapp.lol/posts', payload, authHeader);
      console.log('Tweet posted to backend, will update via Kafka feed', postResponse.data);

    } catch (error) {
      console.error('Failed to post tweet to backend:', error);
      setTweets(prevTweets => prevTweets.filter(t => !t.id.startsWith('temp-')));
      setError("Failed to post your tweet. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75 flex-shrink-0">
        <h1 className="font-bold text-xl p-4">Home</h1>
      </div>
      <div className='flex-shrink-0 border-b border-gray-700/75'>
        {isAuthorLoading && <div className="p-4 text-center text-gray-400">Loading...</div>}
        {authorError && <div className="p-4 text-center text-red-400">{authorError}</div>}
        {author && <ComposeTweet onTweetPosted={handleTweetPosted} author={author}/>}
      </div>
      
      <div className='flex-shrink-0 border-b border-gray-700/75'>
        <ComposeTweet onTweetPosted={handleTweetPosted} author={author as Author}/>
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
                  <TweetCard
                    tweet={tweet}
                  />
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

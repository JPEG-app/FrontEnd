import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useCallback
import axios from 'axios';
import { useVirtualizer } from '@tanstack/react-virtual';
import TweetCard from '../components/tweet/TweetCard';
import ComposeTweet from '../components/tweet/ComposeTweet';
import { Tweet, ApiFeedItem, ApiFeedResponse } from '../types';

// Helper function (keep from previous step)
const mapApiItemToTweet = (apiItem: ApiFeedItem): Tweet => {
    // ... (mapping logic as before) ...
     const authorInfo = { id: apiItem.userId, name: apiItem.authorUsername, handle: apiItem.authorUsername, avatarUrl: undefined, };
     return { id: apiItem.postId, author: authorInfo, title: apiItem.postTitle, content: apiItem.postContent, createdAt: apiItem.createdAt, imageUrl: apiItem.imageUrl, stats: { replies: apiItem.commentCount ?? 0, retweets: 0, likes: apiItem.likeCount ?? 0, views: 0 }, };
};

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  // --- Virtualization Setup for Variable Heights ---
  const rowVirtualizer = useVirtualizer({
    count: tweets.length,
    getScrollElement: () => parentRef.current,
    // Provide a *default* estimate, but measurement will override it
    estimateSize: () => 200, // Still useful for initial render / scrollbar guess
    // Define the measurement function
    measureElement: useCallback((element: Element) => {
        // Measure the height of the element passed in
        // Using getBoundingClientRect is generally robust
        return element.getBoundingClientRect().height;
    }, []), // useCallback helps if dependencies are needed later
    overscan: 5,
  });
  // --- End Virtualization Setup ---


  useEffect(() => {
    // ... (keep existing fetch logic) ...
    const fetchFeed = async () => {
        setIsLoading(true); setError(null);
        try {
            const response = await axios.get<ApiFeedResponse>('http://localhost:3003/feed');
            if (response.data && Array.isArray(response.data.items)) {
                const fetchedTweets = response.data.items.map(mapApiItemToTweet);
                fetchedTweets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setTweets(fetchedTweets);
            } else { throw new Error("Bad data format"); }
        } catch (err: any) { setError(err.message); console.error("Feed fetch error:", err);}
        finally { setIsLoading(false); }
    };
    fetchFeed();
  }, []);

  const handleTweetPosted = (newTweetData: Omit<Tweet, 'id' | 'author' | 'createdAt' | 'stats'> & { content: string }) => {
    // ... (keep existing handleTweetPosted logic) ...
     const currentUser = { id: 'tempUser', name: 'You', handle: 'you', avatarUrl: undefined }; const tempTweet: Tweet = { id:`temp-${Date.now()}`, author: currentUser, title: newTweetData.title, content: newTweetData.content, createdAt: new Date().toISOString(), stats:{replies:0, retweets:0, likes:0, views:0} }; setTweets(prevTweets => [tempTweet, ...prevTweets]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75 flex-shrink-0">
           <h1 className="font-bold text-xl p-4">Home</h1>
      </div>
      <div className='flex-shrink-0 border-b border-gray-700/75'>
         <ComposeTweet onTweetPosted={(data) => handleTweetPosted({ content: data.content })} />
      </div>

      {/* Parent Scrolling Element */}
      <div ref={parentRef} className="flex-grow overflow-auto hide-scrollbar">
         {isLoading ? ( /* ... loading ... */ <div className="text-gray-500 p-4 text-center">Loading feed...</div>
         ) : error ? ( /* ... error ... */ <div className="text-red-500 p-4 text-center">Error: {error}</div>
         ) : (
           // Container for the total scrollable height (still needed)
           <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
             {/* Render virtual items */}
             {rowVirtualizer.getVirtualItems().map((virtualItem) => {
               const tweet = tweets[virtualItem.index];
               return (
                 <div
                   key={tweet.id}
                   // ** Attach the measurement ref **
                   // This tells the virtualizer to measure this specific div's height
                   // The `measureElement` function we provided above will be called with this node
                   ref={rowVirtualizer.measureElement}
                   // Pass the index via data attribute, required by measureElement
                   data-index={virtualItem.index}
                   style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     // ** REMOVE fixed height here ** - Let content determine height
                     // height: `${virtualItem.size}px`, // NO LONGER NEEDED
                     transform: `translateY(${virtualItem.start}px)`,
                   }}
                 >
                   {/* Render your actual TweetCard */}
                   {/* Ensure TweetCard itself doesn't have a fixed height */}
                   <TweetCard tweet={tweet} />
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
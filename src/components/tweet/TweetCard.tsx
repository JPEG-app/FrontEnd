// src/components/tweet/TweetCard.tsx
import React from 'react';
import { useLikes } from '../../contexts/LikesContext';
import { Tweet } from '../../types';
import Avatar from '../common/Avatar';
import { FaRegComment, FaRegHeart, FaHeart, FaShareSquare } from 'react-icons/fa';

// CRITICAL FIX #1: The component props MUST declare that it accepts onLikeToggle.
export interface TweetCardProps {
  tweet: Tweet;
  onLikeToggle: (tweetId: string, isCurrentlyLiked: boolean) => void;
}

const HARDCODED_AVATAR_URL = '/pfp.jpg';

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onLikeToggle }) => {
  const { likedPostIds } = useLikes();
  const isLikedByCurrentUser = likedPostIds.has(tweet.id);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // CRITICAL FIX #2: This handler function connects the user's click to the prop.
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents other click events on the card from firing.
    // This calls the function that lives in HomePage.tsx
    onLikeToggle(tweet.id, isLikedByCurrentUser);
  };

  return (
    <article className="flex p-4 border-b border-gray-700/75 hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer">
      <div className="mr-3 flex-shrink-0">
        <Avatar src={HARDCODED_AVATAR_URL} alt={tweet.author.name} />
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <span className="font-bold hover:underline">{tweet.author.name}</span>
          <span className="text-gray-500 ml-2">{tweet.author.handle}</span>
          <span className="text-gray-500 ml-2">·</span>
          <span className="text-gray-500 ml-2 hover:underline" title={tweet.createdAt.toISOString()}>
            {formatDate(tweet.createdAt)}
          </span>
        </div>
        <p className="my-1 whitespace-pre-wrap text-gray-50">{tweet.content}</p>
        
        <div className="flex justify-between text-gray-500 mt-3 max-w-xs">
          <button className="flex items-center hover:text-twitter-blue group">
            <FaRegComment className="group-hover:bg-twitter-blue/10 rounded-full p-1.5" size={28} />
            <span className="ml-1 text-xs">{tweet.stats?.replies ?? 0}</span>
          </button>
          
          {/* CRITICAL FIX #3: The button's onClick now calls our handler. */}
          <button onClick={handleLikeClick} className={`flex items-center group ${isLikedByCurrentUser ? 'text-red-500' : 'hover:text-red-500'}`}>
            {isLikedByCurrentUser 
              ? <FaHeart className="group-hover:bg-red-500/10 rounded-full p-1.5" size={28} /> 
              : <FaRegHeart className="group-hover:bg-red-500/10 rounded-full p-1.5" size={28} />
            }
            <span className="ml-1 text-xs">{tweet.stats?.likes ?? 0}</span>
          </button>
          
          <button className="hover:text-twitter-blue group">
             <FaShareSquare className="group-hover:bg-twitter-blue/10 rounded-full p-1.5" size={28}/>
          </button>
        </div>
      </div>
    </article>
  );
};

export default TweetCard;
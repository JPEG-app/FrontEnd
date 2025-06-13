import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Tweet } from '../../types';
import Avatar from '../common/Avatar';
import { FaRegComment, FaRegHeart, FaHeart, FaShareSquare } from 'react-icons/fa'; 

export interface TweetCardProps {
  tweet: Tweet;
}

const HARDCODED_AVATAR_URL = '/user.jpg';

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(tweet.stats?.likes ?? 0);

  useEffect(() => {
    const checkLikeStatus = async () => {
      const token = Cookies.get('token');
      if (!token || tweet.id.startsWith('temp-')) {
        return;
      }

      try {
        const response = await axios.get(
          `https://api.jpegapp.lol/posts/${tweet.id}/like/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && typeof response.data.liked === 'boolean') {
          setIsLiked(response.data.liked);
        }
      } catch (err) {
        console.error("Failed to check like status for tweet:", tweet.id, err);
      }
    };

    checkLikeStatus();
  }, [tweet.id]); 

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const token = Cookies.get('token');
    if (!token) {
      alert("Please log in to like posts.");
      return;
    }

    const originalLikedState = isLiked;
    setIsLiked(!originalLikedState);
    setCurrentLikeCount(prevCount => originalLikedState ? prevCount - 1 : prevCount + 1);

    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      if (originalLikedState) {
        await axios.delete(`https://api.jpegapp.lol/posts/${tweet.id}/like`, authHeader);
      } else {
        await axios.post(`https://api.jpegapp.lol/posts/${tweet.id}/like`, {}, authHeader);
      }
    } catch (err) {
      console.error("Failed to update like status:", err);
      setIsLiked(originalLikedState);
      setCurrentLikeCount(prevCount => originalLikedState ? prevCount + 1 : prevCount - 1);
    }
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
        {tweet.title && <h3 className="text-lg font-semibold mt-1">{tweet.title}</h3>}
        <p className="my-1 whitespace-pre-wrap text-gray-50">{tweet.content}</p>
        {tweet.imageUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-gray-700">
            <img src={tweet.imageUrl} alt="Tweet image" className="w-full h-auto object-cover" />
          </div>
        )}
        <div className="flex justify-between text-gray-500 mt-3 max-w-xs">
          <button className="flex items-center hover:text-twitter-blue group">
            <FaRegComment className="group-hover:bg-twitter-blue/10 rounded-full p-1.5" size={28} />
            <span className="ml-1 text-xs">{tweet.stats?.replies ?? 0}</span>
          </button>
          
          <button onClick={handleLikeClick} className={`flex items-center group ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
            {isLiked 
              ? <FaHeart className="group-hover:bg-red-500/10 rounded-full p-1.5" size={28} /> 
              : <FaRegHeart className="group-hover:bg-red-500/10 rounded-full p-1.5" size={28} />
            }
            <span className="ml-1 text-xs">{currentLikeCount}</span>
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
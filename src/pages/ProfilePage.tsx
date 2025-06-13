import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User, Tweet, Author } from '../types';
import Avatar from '../components/common/Avatar';
import TweetCard from '../components/tweet/TweetCard';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useLikes } from '../contexts/LikesContext';

const mapApiItemToTweet = (apiItem: any, authorDetails: Author): Tweet => {
  return { id: apiItem.id, author: authorDetails, title: apiItem.title, content: apiItem.content, createdAt: new Date(apiItem.createdAt), imageUrl: apiItem.imageUrl, stats: { replies: apiItem.commentCount ?? 0, retweets: 0, likes: apiItem.likeCount ?? 0, views: 0 } };
};

const ProfilePage: React.FC = () => {
  const { userHandle: userId } = useParams<{ userHandle: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addLike: addLikeToContext, removeLike: removeLikeFromContext } = useLikes();

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    
    const token = Cookies.get('token');
    if (!token) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }
    
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const [userResponse, postsResponse] = await Promise.all([
        axios.get(`https://api.jpegapp.lol/users/${userId}`, authHeader),
        axios.get(`https://api.jpegapp.lol/users/${userId}/posts`, authHeader)
      ]);

      const apiUser = userResponse.data;
      const fetchedUser = { 
          id: apiUser.id, 
          name: apiUser.username, 
          handle: `@${apiUser.username.toLowerCase()}`, 
          createdAt: new Date(apiUser.createdAt), 
          bio: apiUser.bio || 'No bio yet.', 
          followersCount: apiUser.followersCount ?? 0, 
          followingCount: apiUser.followingCount ?? 0 
      };
      setUser(fetchedUser);

      const authorDetails = { 
          id: fetchedUser.id, 
          name: fetchedUser.name, 
          handle: fetchedUser.handle, 
          avatarUrl: '/pfp.jpg' 
      };

      const tweets = postsResponse.data
        .map((post: any) => mapApiItemToTweet(post, authorDetails))
        .sort((a: Tweet, b: Tweet) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setUserTweets(tweets);
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
      setError("Could not load profile.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
    window.addEventListener('focus', fetchProfileData);
    return () => {
      window.removeEventListener('focus', fetchProfileData);
    };
  }, [fetchProfileData]);

  const handleLikeToggle = async (tweetId: string, isCurrentlyLiked: boolean) => {
    const token = Cookies.get('token');
    if (!token || tweetId.startsWith('temp-')) return;

    if (isCurrentlyLiked) {
      removeLikeFromContext(tweetId);
    } else {
      addLikeToContext(tweetId);
    }

    setUserTweets(currentTweets => 
      currentTweets.map(t => 
        t.id === tweetId ? { ...t, stats: { ...t.stats, likes: (t.stats?.likes ?? 0) + (isCurrentlyLiked ? -1 : 1) } } : t
      )
    );

    try {
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      if (isCurrentlyLiked) {
        await axios.delete(`https://api.jpegapp.lol/posts/${tweetId}/like`, authHeader);
      } else {
        await axios.post(`https://api.jpegapp.lol/posts/${tweetId}/like`, {}, authHeader);
      }
    } catch (err) {
      if (isCurrentlyLiked) {
        addLikeToContext(tweetId);
      } else {
        removeLikeFromContext(tweetId);
      }
      setUserTweets(currentTweets => 
        currentTweets.map(t => 
          t.id === tweetId ? { ...t, stats: { ...t.stats, likes: (t.stats?.likes ?? 0) + (isCurrentlyLiked ? 1 : -1) } } : t
        )
      );
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="text-red-500">{error || `User not found.`}</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-twitter-blue text-white rounded-full px-4 py-2">Go Back</button>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 backdrop-blur-md z-10 p-2 border-b border-gray-700/75 flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-800/80 rounded-full p-2"><FaArrowLeft size={18}/></button>
        <div>
          <h1 className="font-bold text-xl">{user.name}</h1>
          <p className="text-xs text-gray-500">{userTweets.length} posts</p>
        </div>
      </div>

      <div className="h-48 bg-gray-700"></div>

      <div className="p-4 border-b border-gray-700/75">
        <div className="flex justify-between items-start">
          <div className="relative">
            <div className="absolute -top-16 border-4 border-black rounded-full">
              <Avatar src={'/pfp.jpg'} alt={user.name} size="lg" />
            </div>
          </div>
          <button className="border border-gray-500 rounded-full px-4 py-1.5 font-bold text-sm hover:bg-gray-800/40">Edit profile</button>
        </div>

        <div className="mt-4 pt-8">
          <h2 className="font-bold text-xl">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.handle}</p>
          {user.bio && <p className="mt-2 text-[15px]">{user.bio}</p>}
          <div className="flex items-center text-gray-500 text-sm mt-2 space-x-1">
            <FaCalendarAlt/>
            <span>Joined {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex space-x-4 mt-2 text-sm">
            <p><span className="font-bold text-white">{user.followingCount}</span> <span className="text-gray-500">Following</span></p>
            <p><span className="font-bold text-white">{user.followersCount}</span> <span className="text-gray-500">Followers</span></p>
          </div>
        </div>
      </div>

      <div>
        {userTweets.length > 0 ? (
          userTweets.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} onLikeToggle={handleLikeToggle} />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">{user.handle} hasn't posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '../types';
import Avatar from '../components/common/Avatar';
import TweetCard from '../components/tweet/TweetCard';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useTweets } from '../contexts/TweetsContext';

const ProfilePage: React.FC = () => {
  const { userHandle: userId } = useParams<{ userHandle: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { tweets, isLoading, error, fetchUserPosts, handleLikeToggle } = useTweets();

  useEffect(() => {
    if (userId) {
      fetchUserPosts(userId);
      
      const token = Cookies.get('token');
      axios.get(`https://api.jpegapp.lol/users/${userId}`, { headers: { Authorization: `Bearer ${token}` }})
        .then(res => setUser({ id: res.data.id, name: res.data.username, handle: `@${res.data.username.toLowerCase()}`, createdAt: new Date(res.data.createdAt), bio: res.data.bio || 'No bio yet.', followersCount: res.data.followersCount ?? 0, followingCount: res.data.followingCount ?? 0 }));
    }
  }, [userId, fetchUserPosts]);

  const userTweets = Array.from(tweets.values()).filter(t => t.author.id === userId).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (isLoading && !user) return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
  if (error && !user) return <div className="p-4 text-center"><h2 className="text-xl font-bold mb-2">Profile not found</h2><p className="text-red-500">{error}</p><button onClick={() => navigate(-1)} className="mt-4 bg-twitter-blue text-white rounded-full px-4 py-2">Go Back</button></div>;
  if (!user) return <div className="p-4 text-center">User not found.</div>

  return (
    <div>
      <div className="sticky top-0 backdrop-blur-md z-10 p-2 border-b border-gray-700/75 flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-800/80 rounded-full p-2"><FaArrowLeft size={18}/></button>
        <div><h1 className="font-bold text-xl">{user.name}</h1><p className="text-xs text-gray-500">{userTweets.length} posts</p></div>
      </div>
      <div className="h-48 bg-gray-700"></div>
      <div className="p-4 border-b border-gray-700/75">
        <div className="flex justify-between items-start">
          <div className="relative"><div className="absolute -top-16 border-4 border-black rounded-full"><Avatar src={'/pfp.jpg'} alt={user.name} size="lg" /></div></div>
          <button className="border border-gray-500 rounded-full px-4 py-1.5 font-bold text-sm hover:bg-gray-800/40">Edit profile</button>
        </div>
        <div className="mt-4 pt-8">
          <h2 className="font-bold text-xl">{user.name}</h2><p className="text-gray-500 text-sm">{user.handle}</p>
          {user.bio && <p className="mt-2 text-[15px]">{user.bio}</p>}
          <div className="flex items-center text-gray-500 text-sm mt-2 space-x-1"><FaCalendarAlt/><span>Joined {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>
          <div className="flex space-x-4 mt-2 text-sm"><p><span className="font-bold text-white">{user.followingCount}</span> <span className="text-gray-500">Following</span></p><p><span className="font-bold text-white">{user.followersCount}</span> <span className="text-gray-500">Followers</span></p></div>
        </div>
      </div>
      <div>
        {userTweets.length > 0 ? (
          userTweets.map(tweet => (<TweetCard key={tweet.id} tweet={tweet} onLikeToggle={handleLikeToggle} />))
        ) : (<p className="p-4 text-center text-gray-500">{user.handle} hasn't posted yet.</p>)}
      </div>
    </div>
  );
};
export default ProfilePage;
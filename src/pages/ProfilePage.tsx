import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Tweet } from '../types';
import { mockUser } from '../services/mockData';
import Avatar from '../components/common/Avatar';
import TweetCard from '../components/tweet/TweetCard';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import placeholderAvatar from '../assets/avatar.png';

const ProfilePage: React.FC = () => {
  const { userHandle } = useParams<{ userHandle: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching user data based on handle
    setTimeout(() => {
      // Find user and their tweets from mock data
      const foundUser = userHandle === mockUser.handle ? mockUser : null; // Simplified: only supports mockUser
      if (foundUser) {
        setUser(foundUser);
        // const tweets = mockTweets
        //     .filter(tweet => tweet.author.handle === userHandle)
        //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // setUserTweets(tweets);
      } else {
        // Handle user not found - maybe redirect or show error
        setUser(null);
        setUserTweets([]);
      }
      setIsLoading(false);
    }, 300);
  }, [userHandle]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-red-500">User @{userHandle} not found.</div>;
  }

  return (
    <div>
       {/* Profile Header */}
       <div className="sticky top-0 backdrop-blur-md z-10 p-2 border-b border-gray-700/75 flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="hover:bg-gray-800/80 rounded-full p-2">
                 <FaArrowLeft size={18}/>
            </button>
            <div>
                <h1 className="font-bold text-xl">{user.name}</h1>
                <p className="text-xs text-gray-500">{userTweets.length} posts</p>
            </div>
       </div>

       {/* Banner Image Placeholder */}
       <div className="h-48 bg-gray-700"></div>

       {/* Profile Info */}
       <div className="p-4 border-b border-gray-700/75">
         <div className="flex justify-between items-start">
           <div className="relative">
             <div className="absolute -top-16 border-4 border-black rounded-full">
                <Avatar src={placeholderAvatar} alt={user.name} size="lg" />
             </div>
           </div>
           {/* Edit Profile / Follow Button Placeholder */}
           <button className="border border-gray-500 rounded-full px-4 py-1.5 font-bold text-sm hover:bg-gray-800/40 transition-colors duration-150">
             Edit profile
           </button>
         </div>

         <div className="mt-4 pt-8">
           <h2 className="font-bold text-xl">{user.name}</h2>
           <p className="text-gray-500 text-sm">@{user.handle}</p>
           {user.bio && <p className="mt-2 text-[15px]">{user.bio}</p>}
            <div className="flex items-center text-gray-500 text-sm mt-2 space-x-1">
                <FaCalendarAlt/>
                <span>Joined {/* Add join date here if available */}</span>
            </div>
           <div className="flex space-x-4 mt-2 text-sm">
             <p><span className="font-bold text-white">{user.followingCount ?? 0}</span> <span className="text-gray-500">Following</span></p>
             <p><span className="font-bold text-white">{user.followersCount ?? 0}</span> <span className="text-gray-500">Followers</span></p>
           </div>
         </div>
       </div>

       {/* Profile Tabs Placeholder */}
       <div className="flex justify-around border-b border-gray-700/75">
          <button className="flex-1 py-3 text-center font-bold text-sm hover:bg-gray-800/40 transition-colors duration-150 border-b-2 border-twitter-blue">Posts</button>
          <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Replies</button>
          <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Media</button>
          <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Likes</button>
       </div>

       {/* User Tweets */}
       <div>
         {userTweets.length > 0 ? (
           userTweets.map(tweet => <TweetCard key={tweet.id} tweet={tweet} />)
         ) : (
           <p className="p-4 text-center text-gray-500">@{user.handle} hasn't posted yet.</p>
         )}
       </div>
    </div>
  );
};

export default ProfilePage;
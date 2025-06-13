import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { User, Tweet, Author } from '../types'; // Make sure all types are imported
import Avatar from '../components/common/Avatar';
import TweetCard from '../components/tweet/TweetCard';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

// Let's use the same hardcoded avatar for consistency across the app
const HARDCODED_AVATAR_URL = 'https://i.pravatar.cc/150';

// We need a function to map the post data to our Tweet type.
// This is similar to the one in HomePage.
const mapApiItemToTweet = (apiItem: any, authorDetails: Author): Tweet => {
  return {
    id: apiItem.id, // Assuming post API returns 'id' for post id
    author: authorDetails,
    title: apiItem.title,
    content: apiItem.content,
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

const ProfilePage: React.FC = () => {
  const { userHandle } = useParams<{ userHandle: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userHandle) return;

    const fetchProfileData = async () => {
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
        // Step 1: Fetch user data by their handle (username)
        // NOTE: This assumes an endpoint exists to get a user by their username.
        const userResponse = await axios.get(`https://api.jpegapp.lol/users/by-username/${userHandle}`, authHeader);
        const apiUser = userResponse.data;

        // Map the API user data to our frontend User type
        const fetchedUser: User = {
          id: apiUser.id,
          name: apiUser.username,
          handle: `@${apiUser.username.toLowerCase()}`,
          createdAt: new Date(apiUser.createdAt),
          // Add other fields as they become available from the API
          bio: apiUser.bio || 'No bio yet.',
          followersCount: apiUser.followersCount ?? 0,
          followingCount: apiUser.followingCount ?? 0,
        };
        setUser(fetchedUser);

        // Step 2: Fetch the user's posts using the ID from the user data
        const postsResponse = await axios.get(`https://api.jpegapp.lol/posts/${apiUser.id}`, authHeader);
        
        // The author details will be the same for all tweets on this page
        const authorDetails: Author = {
          id: fetchedUser.id,
          name: fetchedUser.name,
          handle: fetchedUser.handle,
          avatarUrl: HARDCODED_AVATAR_URL,
        };

        const tweets = postsResponse.data.map((post: any) => mapApiItemToTweet(post, authorDetails));
        tweets.sort((a:Tweet, b:Tweet) => b.createdAt.getTime() - a.createdAt.getTime());
        setUserTweets(tweets);

      } catch (err: any) {
        console.error("Failed to fetch profile data:", err);
        setError(err.response?.data?.message || "Could not load profile.");
        setUser(null); // Clear user on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userHandle]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
  }

  if (error || !user) {
    return (
        <div className="p-4 text-center">
            <h2 className="text-xl font-bold mb-2">Profile not found</h2>
            <p className="text-red-500">{error || `User @${userHandle} does not exist.`}</p>
            <button onClick={() => navigate(-1)} className="mt-4 bg-twitter-blue text-white rounded-full px-4 py-2">Go Back</button>
        </div>
    );
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
                <Avatar src={HARDCODED_AVATAR_URL} alt={user.name} size="lg" />
             </div>
           </div>
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
                <span>Joined {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
           <div className="flex space-x-4 mt-2 text-sm">
             <p><span className="font-bold text-white">{user.followingCount}</span> <span className="text-gray-500">Following</span></p>
             <p><span className="font-bold text-white">{user.followersCount}</span> <span className="text-gray-500">Followers</span></p>
           </div>
         </div>
       </div>

       {/* Profile Tabs */}
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
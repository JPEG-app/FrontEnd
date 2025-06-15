import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { Tweet, Author } from '../types';
import TweetCard from '../components/tweet/TweetCard';
import { FaArrowLeft } from 'react-icons/fa';

const STATIC_AVATAR_URL = '/user.jpg';

const mapApiItemToTweet = (apiItem: any, authorDetails: Author): Tweet => {
  return {
    id: apiItem.id,
    author: authorDetails,
    title: apiItem.title,
    content: apiItem.content,
    createdAt: new Date(apiItem.createdAt),
    imageUrl: apiItem.imageUrl,
    hasUserLiked: apiItem.hasUserLiked,
    likeCount: apiItem.likeCount || 0
  };
};

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
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
        // Step 1: Fetch the single post by its ID
        const postResponse = await axios.get(`https://api.jpegapp.lol/posts/${postId}`, authHeader);
        const apiPost = postResponse.data;

        // Step 2: Get the authorId from the post data
        const authorId = apiPost.userId;
        if (!authorId) {
            throw new Error("Post data is missing an author ID.");
        }

        // Step 3: Fetch the author's user details using the authorId
        const userResponse = await axios.get(`https://api.jpegapp.lol/users/${authorId}`, authHeader);
        const apiUser = userResponse.data;
        
        // Step 4: Construct the Author object from the fetched user details
        const authorDetails: Author = {
          id: apiUser.id,
          name: apiUser.username,
          handle: `@${apiUser.username.toLowerCase()}`,
          avatarUrl: STATIC_AVATAR_URL,
        };

        // Step 5: Combine the post data and the new author details
        const fetchedTweet = mapApiItemToTweet(apiPost, authorDetails);
        setTweet(fetchedTweet);

      } catch (err: any) {
        console.error("Failed to fetch post data:", err);
        setError(err.response?.data?.message || "Could not load the post.");
        setTweet(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading post...</div>;
  }

  if (error || !tweet) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Post not found</h2>
        <p className="text-red-500">{error || `This post does not exist or could not be loaded.`}</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-twitter-blue text-white rounded-full px-4 py-2">Go Back</button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-md z-10 p-2 border-b border-gray-700/75 flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="hover:bg-gray-800/80 rounded-full p-2">
          <FaArrowLeft size={18}/>
        </button>
        <div>
          <h1 className="font-bold text-xl">Post</h1>
        </div>
      </div>

      {/* Single Tweet Display */}
      <div>
        <TweetCard
          key={tweet.id}
          tweet={tweet}
        />
        {/* Placeholder for replies can be added here in the future */}
      </div>
    </div>
  );
};

export default PostDetailPage;
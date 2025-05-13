// src/components/tweet/ComposeTweet.tsx
import React, { useState } from 'react';
import Avatar from '../common/Avatar'; // Adjust path if needed
import { mockUser } from '../../services/mockData'; // Adjust path if needed
// Ensure imports are from your single types file
import { Tweet, Author } from '../../types';
import { FaImage, FaPollH, FaSmile, FaCalendarAlt } from 'react-icons/fa';

interface ComposeTweetProps {
    onTweetPosted: (newTweet: Tweet) => void;
}

const ComposeTweet: React.FC<ComposeTweetProps> = ({ onTweetPosted }) => {
  const [tweetContent, setTweetContent] = useState('');
  // const [tweetTitle, setTweetTitle] = useState(''); // If you decide to add title input

  const maxLength = 280;

  const handlePostTweet = () => {
    if (!tweetContent.trim()) return;

    // Construct mockAuthor if mockUser doesn't directly fit Author type
    const mockAuthor: Author = {
        id: mockUser.id, // Assuming mockUser has these fields
        name: mockUser.name,
        handle: mockUser.handle,
        avatarUrl: mockUser.avatarUrl
    };

    const newTweet: Tweet = {
        id: `t${Date.now()}`,
        author: mockAuthor, // Use the mapped/verified Author type
        // title: tweetTitle, // Include if you add title input
        content: tweetContent,
        createdAt: new Date(), // <<<< NOW Date object
        stats: { replies: 0, retweets: 0, likes: 0, views: 0 },
    };
    onTweetPosted(newTweet);
    setTweetContent('');
    // setTweetTitle(''); // If you add title input
  };

  return (
    <div className="flex p-3 border-b border-gray-700/75">
      <div className="mr-3 flex-shrink-0">
        {/* Ensure mockUser has avatarUrl or Avatar handles undefined */}
        <Avatar src={mockUser.avatarUrl} alt={mockUser.name} />
      </div>
      <div className="flex-grow">
        {/* Optional: Input for title if you add it
        <input
          type="text"
          value={tweetTitle}
          onChange={(e) => setTweetTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent text-md resize-none outline-none placeholder-gray-500 text-gray-100 py-1 mb-1"
        />
        */}
        <textarea
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          maxLength={maxLength}
          placeholder="What is happening?!"
          className="w-full bg-transparent text-lg resize-none outline-none placeholder-gray-500 text-gray-100 py-2"
          rows={2}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-1 text-twitter-blue">
            <button className="hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150"><FaImage size={18}/></button>
            <button className="hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150"><FaPollH size={18}/></button>
            <button className="hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150"><FaSmile size={18}/></button>
            <button className="hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150"><FaCalendarAlt size={18}/></button>
          </div>
          <div className="flex items-center space-x-3">
            {tweetContent.length > 0 && (
                 <span className={`text-sm ${tweetContent.length > maxLength - 20 ? 'text-red-500' : 'text-gray-500'}`}>
                     {maxLength - tweetContent.length}
                 </span>
            )}
            <button
              onClick={handlePostTweet}
              disabled={!tweetContent.trim()}
              className="bg-twitter-blue text-white rounded-full px-4 py-1.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors duration-150"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeTweet;
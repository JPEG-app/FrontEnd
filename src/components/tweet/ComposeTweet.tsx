import React, { useState, FormEvent } from 'react';
import { Tweet } from '../../types'; 
import Avatar from '../common/Avatar';

interface ComposeTweetProps {
  onTweetPosted: (newlyComposedTweet: Tweet) => void;
  disabled?: boolean; 
}

const ComposeTweet: React.FC<ComposeTweetProps> = ({ onTweetPosted, disabled = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) {
      return;
    }

    const newTweet: Partial<Tweet> = {
      content: content,
      author: { id: '', name: 'reactdev', handle: '@reactdev' } 
    };

    onTweetPosted(newTweet as Tweet);
    
    setContent('');
  };

  return (
    <div className="p-4 flex">
      <div className="mr-3 flex-shrink-0">
        <Avatar src="/user.jpg" alt="Your Avatar" /> 
      </div>
      <form onSubmit={handleSubmit} className="flex-grow">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={disabled}
          placeholder="What is happening?!"
          className="w-full bg-transparent text-lg text-gray-100 placeholder-gray-500 focus:outline-none resize-none"
          rows={2}
        />
        <div className="flex justify-end items-center mt-2">
          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="bg-twitter-blue text-white rounded-full px-4 py-1.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComposeTweet;
// src/components/tweet/ComposeTweet.tsx
import React, { useState, FormEvent } from 'react';
import { Tweet } from '../../types';
import Avatar from '../common/Avatar';

// Define the props that this component will receive from its parent
interface ComposeTweetProps {
  onTweetPosted: (newlyComposedTweet: Partial<Tweet>) => void; // It sends a partial tweet up
  disabled?: boolean;
}

const ComposeTweet: React.FC<ComposeTweetProps> = ({ onTweetPosted, disabled = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) {
      return;
    }

    // Create a very basic tweet object with only the content.
    // The parent (HomePage) is responsible for adding the real author, date, etc.
    const partialTweet: Partial<Tweet> = {
      content: content,
    };

    // Call the function passed down from HomePage
    onTweetPosted(partialTweet);
    
    // Clear the input field after posting
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
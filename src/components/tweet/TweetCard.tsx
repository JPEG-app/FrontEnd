import React from 'react';
import { Tweet } from '../../types';
import { formatDistanceToNowStrict } from 'date-fns';
import { FaRegComment, FaRetweet, FaRegHeart, FaChartBar, FaShareSquare } from 'react-icons/fa';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';
import placeholderAvatar from '../../assets/avatar.png';

interface TweetCardProps {
  tweet: Tweet;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {

  let timeAgo = 'Date unknown';
  let dateTitle = 'Date unknown';

  if (tweet.createdAt && typeof tweet.createdAt === 'string') {
    const date = new Date(tweet.createdAt);

    if (!isNaN(date.getTime())) {
      try {
         timeAgo = formatDistanceToNowStrict(date, { addSuffix: false });
         dateTitle = date.toLocaleString();
      } catch (formatError) {
         console.error("Error formatting date:", tweet.createdAt, formatError);
         timeAgo = "Error";
         dateTitle = "Error";
      }
    } else {
      console.warn("Invalid date value received for tweet:", tweet.id, "createdAt:", tweet.createdAt);
      timeAgo = "Invalid date";
      dateTitle = "Invalid date";
    }
  } else {
     console.warn("Missing or invalid createdAt type for tweet:", tweet.id, "createdAt:", tweet.createdAt);
  }

  const stats = { replies: tweet.stats?.replies??0, retweets: tweet.stats?.retweets??0, likes: tweet.stats?.likes??0, views: tweet.stats?.views??0 };

  return (
    <article className="flex p-3 border-b border-gray-700/75 hover:bg-gray-900/50 transition-colors duration-150 cursor-pointer">
      {/* Avatar Section */}
      <Link to={`/${tweet.author.handle}`} className="mr-3 flex-shrink-0">
        <Avatar src={placeholderAvatar} alt={tweet.author.name} />
      </Link>

      {/* Content Section */}
      <div className="flex-grow min-w-0">
        {/* Author Info Line */}
        <div className="flex items-center space-x-1 text-sm flex-wrap">
          <Link to={`/${tweet.author.handle}`} className="font-bold hover:underline break-words">
            {tweet.author.name}
          </Link>
          <Link to={`/${tweet.author.handle}`} className="text-gray-500 hidden sm:inline break-words">
            @{tweet.author.handle}
          </Link>
          <span className="text-gray-500">·</span>
          {/* Use the safe values calculated above */}
          <span className="text-gray-500 hover:underline" title={dateTitle}>
            {timeAgo} ago
          </span>
        </div>

        {/* ... rest of the component (title, content, image, actions) ... */}
         {tweet.title && (<h2 className="text-lg font-semibold text-white mt-1 break-words">{tweet.title}</h2>)}
         <p className="mt-1 whitespace-pre-wrap text-[15px] break-words">{tweet.content}</p>
         {tweet.imageUrl && ( <div className="mt-3 border border-gray-700 rounded-lg overflow-hidden"><img src={tweet.imageUrl} alt="" className="max-h-96 w-full object-cover" loading="lazy"/></div>)}
         <div className="flex justify-between mt-3 text-gray-500 max-w-xs text-xs"> {/* ... actions ... */} <button className="flex items-center space-x-1 hover:text-twitter-blue group"><div className="group-hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150 -ml-2"><FaRegComment className=" text-base" /></div><span>{stats.replies > 0 ? stats.replies : ''}</span></button><button className="flex items-center space-x-1 hover:text-green-500 group"><div className="group-hover:bg-green-500/10 rounded-full p-2 transition-colors duration-150 -ml-2"><FaRetweet className=" text-base" /></div><span>{stats.retweets > 0 ? stats.retweets : ''}</span></button><button className="flex items-center space-x-1 hover:text-pink-500 group"><div className="group-hover:bg-pink-500/10 rounded-full p-2 transition-colors duration-150 -ml-2"><FaRegHeart className=" text-base" /></div><span>{stats.likes > 0 ? stats.likes : ''}</span></button><button className="flex items-center space-x-1 hover:text-twitter-blue group"><div className="group-hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150 -ml-2"><FaChartBar className=" text-base"/></div><span>{stats.views > 0 ? Intl.NumberFormat('en', { notation: 'compact' }).format(stats.views) : ''}</span></button><button className="hover:text-twitter-blue group -m-2"><div className="group-hover:bg-twitter-blue/10 rounded-full p-2 transition-colors duration-150"><FaShareSquare className="text-base"/></div></button></div>

      </div>
    </article>
  );
};

export default TweetCard;
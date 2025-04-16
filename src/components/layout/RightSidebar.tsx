import React from 'react';

import placeholderAvatar from '../../assets/avatar.png';

const RightSidebar: React.FC = () => {
  // Placeholder content
  const trends = [
    { category: 'Technology', topic: '#ReactJS', tweets: '15.2K' },
    { category: 'Gaming', topic: 'Elden Ring DLC', tweets: '45K' },
    { category: 'News', topic: 'Netherlands Politics', tweets: '8K' },
    { category: 'Web Development', topic: '#TailwindCSS', tweets: '10.1K' },
  ];

  const whoToFollow = [
    { name: 'Vite', handle: 'vite_js', avatar: {placeholderAvatar} },
    { name: 'Tailwind Labs', handle: 'tailwindcss', avatar: {placeholderAvatar} },
  ];

  return (
    <aside className="sticky top-0 h-screen w-80 hidden lg:block px-6 py-2 ml-4 flex-shrink-0">
      {/* Search Bar Placeholder */}
      <div className="sticky top-0 py-2 bg-black z-10">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-800/80 rounded-full px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-twitter-blue focus:bg-black"
        />
      </div>

      {/* Trends Section */}
      <div className="bg-gray-800/60 rounded-xl mt-4">
        <h2 className="font-bold text-xl px-4 py-3">Trends for you</h2>
        <ul>
          {trends.map((trend, index) => (
            <li key={index} className="hover:bg-gray-700/40 transition-colors duration-150 cursor-pointer px-4 py-3 border-t border-gray-700/75">
              <div className="text-xs text-gray-500">{trend.category} · Trending</div>
              <div className="font-bold">{trend.topic}</div>
              <div className="text-xs text-gray-500">{trend.tweets} Posts</div>
            </li>
          ))}
          <li className="hover:bg-gray-700/40 transition-colors duration-150 cursor-pointer px-4 py-3 border-t border-gray-700/75 rounded-b-xl">
            <span className="text-twitter-blue text-sm">Show more</span>
          </li>
        </ul>
      </div>

      {/* Who to Follow Section */}
      <div className="bg-gray-800/60 rounded-xl mt-4">
         <h2 className="font-bold text-xl px-4 py-3">Who to follow</h2>
         <ul>
            {whoToFollow.map((user, index) => (
                 <li key={index} className="flex items-center justify-between hover:bg-gray-700/40 transition-colors duration-150 cursor-pointer px-4 py-3 border-t border-gray-700/75">
                    <div className="flex items-center">
                        <img src={placeholderAvatar} alt={user.name} className="w-10 h-10 rounded-full mr-3"/>
                        <div>
                            <div className="font-bold hover:underline">{user.name}</div>
                            <div className="text-gray-500 text-sm">@{user.handle}</div>
                        </div>
                    </div>
                    <button className="bg-white text-black rounded-full px-3 py-1 font-bold text-sm hover:opacity-90">Follow</button>
                 </li>
            ))}
            <li className="hover:bg-gray-700/40 transition-colors duration-150 cursor-pointer px-4 py-3 border-t border-gray-700/75 rounded-b-xl">
               <span className="text-twitter-blue text-sm">Show more</span>
            </li>
         </ul>
      </div>

      {/* Footer Links */}
      <footer className="text-xs text-gray-500 mt-4 space-x-2">
         <a href="#" className="hover:underline">Terms of Service</a>
         <a href="#" className="hover:underline">Privacy Policy</a>
         <a href="#" className="hover:underline">Cookie Policy</a>
         <a href="#" className="hover:underline">Accessibility</a>
         <a href="#" className="hover:underline">Ads info</a>
         <span>© {new Date().getFullYear()} X Corp.</span>
      </footer>
    </aside>
  );
};

export default RightSidebar;
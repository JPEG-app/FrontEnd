import React from 'react';

const ExplorePage: React.FC = () => {
  return (
     <div>
         <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75">
             {/* Search Bar within Explore */}
             <div className="p-2">
                 <input
                   type="text"
                   placeholder="Search"
                   className="w-full bg-gray-800/80 rounded-full px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-twitter-blue focus:bg-black"
                 />
             </div>
             {/* Explore Tabs Placeholder */}
             <div className="flex justify-around border-b border-gray-700/75">
                 <button className="flex-1 py-3 text-center font-bold text-sm hover:bg-gray-800/40 transition-colors duration-150 border-b-2 border-twitter-blue">For you</button>
                 <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Trending</button>
                 <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">News</button>
                 <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Sports</button>
             </div>
         </div>
         <div className="p-4 text-center text-gray-500">
             Explore Content Placeholder
         </div>
     </div>
  );
};

export default ExplorePage;
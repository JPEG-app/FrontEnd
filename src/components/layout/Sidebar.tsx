import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTwitter, FaHome, FaHashtag, FaBell, FaEnvelope, FaBookmark, FaListAlt, FaUser, FaEllipsisH } from 'react-icons/fa';
import { mockUser } from '../../services/mockData'; 

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: FaHome, text: 'Home', path: '/' },
    { icon: FaHashtag, text: 'Explore', path: '/explore' },
    { icon: FaBell, text: 'Notifications', path: '/notifications' },
    { icon: FaEnvelope, text: 'Messages', path: '/messages' },
    { icon: FaBookmark, text: 'Bookmarks', path: '/bookmarks' },
    { icon: FaListAlt, text: 'Lists', path: '/lists' },
    { icon: FaUser, text: 'Profile', path: '/reactdev' }, // Link to mock user profile
    { icon: FaEllipsisH, text: 'More', path: '/more' },
  ];

  return (
    <header className="sticky top-0 h-screen flex flex-col items-end xl:items-start px-4 py-1 xl:w-64 border-r border-gray-700/75">
        <div className="py-3">
            <FaTwitter className="text-3xl text-white" />
        </div>
        <nav className="mt-1 flex-grow">
            <ul>
            {navItems.map((item, index) => (
                <li key={index} className="my-1">
                <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                    `flex items-center p-3 text-xl hover:bg-gray-800/80 rounded-full transition-colors duration-150 group ${isActive ? 'font-bold' : ''}`
                    }
                >
                    <item.icon className="mr-4" />
                    <span className="hidden xl:inline">{item.text}</span>
                </NavLink>
                </li>
            ))}
            </ul>
        </nav>
        <button className="mt-4 mb-4 w-full bg-twitter-blue text-white rounded-full py-3 font-bold text-lg hidden xl:block hover:bg-blue-500 transition-colors duration-150">
            Post
        </button>
         <button className="mt-4 mb-4 w-12 h-12 bg-twitter-blue text-white rounded-full flex items-center justify-center font-bold text-lg xl:hidden hover:bg-blue-500 transition-colors duration-150">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current"><g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63 0 1.14.51 1.14 1.14v1.71c0 .63-.51 1.14-1.14 1.14H13v2H11v-2H8.86c-.63 0-1.14-.51-1.14-1.14v-1.71c0-.63.51-1.14 1.14-1.14H11V11H9.5v-2H11V8.413c0-1.1.9-2 2-2h1.5v2z"></path></g></svg>
        </button>

        {/* User Profile Button - Placeholder */}
        <div className="mb-4 mt-auto w-full">
             <button className="flex items-center justify-between w-full p-3 hover:bg-gray-800/80 rounded-full transition-colors duration-150">
                 <div className="flex items-center">
                    <img src={mockUser.avatarUrl} alt="User" className="w-10 h-10 rounded-full mr-3"/>
                    <div className="text-left hidden xl:block">
                        <div className="font-bold text-sm">{mockUser.name}</div>
                        <div className="text-gray-500 text-sm">@{mockUser.handle}</div>
                    </div>
                 </div>
                 <FaEllipsisH className="hidden xl:block text-gray-500"/>
             </button>
        </div>
    </header>
  );
};

export default Sidebar;
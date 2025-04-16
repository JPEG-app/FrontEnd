import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <div>
        <div className="sticky top-0 backdrop-blur-md z-10 border-b border-gray-700/75">
           <h1 className="font-bold text-xl p-4">Notifications</h1>
            {/* Notification Tabs Placeholder */}
            <div className="flex justify-around border-b border-gray-700/75">
                <button className="flex-1 py-3 text-center font-bold text-sm hover:bg-gray-800/40 transition-colors duration-150 border-b-2 border-twitter-blue">All</button>
                <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Verified</button>
                <button className="flex-1 py-3 text-center font-medium text-sm text-gray-500 hover:bg-gray-800/40 transition-colors duration-150">Mentions</button>
            </div>
        </div>
        <div className="p-4 text-center text-gray-500">
            Notifications Placeholder
        </div>
    </div>
  );
};

export default NotificationsPage;
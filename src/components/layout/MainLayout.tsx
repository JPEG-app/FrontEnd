import React from 'react';
import Sidebar from './Sidebar';
// import RightSidebar from './RightSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center min-h-screen">
      <Sidebar />
      <main className="flex-grow border-x border-gray-700/75 max-w-[600px] w-full">
        {children}
      </main>
      {/* <RightSidebar /> */}
    </div>
  );
};

export default MainLayout;
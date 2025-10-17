import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import SideNav from './SideNav';

const Layout = () => {
  return (
    <div className="flex h-screen bg-bg">
      <SideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 md:pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { SidebarProvider } from '../context/SidebarContext';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--color-background)] transition-theme">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[var(--color-background)] transition-theme">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

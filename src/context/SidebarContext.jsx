import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  // Desktop: Expanded, Tablet: Collapsed
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1280);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      // Auto-collapse on tablet
      if (width >= 768 && width < 1280) {
        setCollapsed(true);
      } else if (width >= 1280) {
        setCollapsed(false);
      }
      // Close mobile drawer on resize to larger screen
      if (width >= 768) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggle = () => {
    if (window.innerWidth < 768) {
      setIsDrawerOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, isDrawerOpen, closeDrawer }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

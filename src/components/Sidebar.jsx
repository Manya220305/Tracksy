import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, BarChart2,
  ClipboardList, Medal, Settings,
  ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const NAV_ITEMS = [
  { name: 'Dashboard',    path: '/dashboard',    icon: LayoutDashboard },
  { name: 'My Habits',   path: '/habits',        icon: ListTodo },
  { name: 'Analytics',   path: '/analytics',     icon: BarChart2 },
  { name: 'Planner',     path: '/planner',       icon: ClipboardList },
  { name: 'Achievements',path: '/achievements',  icon: Medal },
  { name: 'Settings',    path: '/settings',      icon: Settings },
];

const Sidebar = () => {
  const { collapsed, toggle, isDrawerOpen, closeDrawer } = useSidebar();

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />

      <aside
        style={{
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        }}
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col h-full
          bg-[var(--color-surface)] border-r border-[var(--color-border)]
          transition-all duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isDrawerOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        `}
      >
        {/* ── Logo Row ── */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)] flex-shrink-0">
          {/* Logo / brand */}
          <div className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--color-foreground)] whitespace-nowrap">Tracksy</span>
          </div>

          {/* Collapsed icon (centered when no text) */}
          {collapsed && (
            <div className="mx-auto w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <LayoutDashboard size={16} className="text-white" />
            </div>
          )}

          {/* Toggle button - hidden on mobile (Navbar handles it) */}
          <button
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`
              hidden md:flex flex-shrink-0 p-1.5 rounded-lg
              text-[var(--color-text-secondary)]
              hover:bg-[var(--color-surface-raised)]
              hover:text-[var(--color-foreground)]
              transition-all duration-200
              ${collapsed ? 'ml-0' : 'ml-auto'}
            `}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          
          {/* Mobile Close Button */}
          <button 
            onClick={closeDrawer}
            className="md:hidden flex-shrink-0 p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
          {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
            <div key={name} className="relative group">
              <NavLink
                to={path}
                onClick={() => { if(window.innerWidth < 768) closeDrawer(); }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-[var(--color-primary)] font-semibold shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)]'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full" />
                    )}

                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    />

                    {/* Label — fades out when collapsed */}
                    <span
                      className="whitespace-nowrap overflow-hidden font-medium text-sm transition-all duration-300"
                      style={{
                        maxWidth: collapsed ? '0px' : '160px',
                        opacity: collapsed ? 0 : 1,
                      }}
                    >
                      {name}
                    </span>
                  </>
                )}
              </NavLink>

              {/* Tooltip shown only when collapsed (not on mobile) */}
              {collapsed && (
                <div className="
                  hidden md:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2
                  ml-3 px-2.5 py-1.5 rounded-lg
                  bg-[var(--color-foreground)] text-[var(--color-background)]
                  text-xs font-medium whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200 z-50
                  shadow-lg
                ">
                  {name}
                  {/* Arrow */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-foreground)]" />
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Upgrade card (hidden when collapsed) ── */}
        <div
          className="m-3 overflow-hidden transition-all duration-300 flex-shrink-0"
          style={{
            maxHeight: collapsed ? '0px' : '160px',
            opacity: collapsed ? 0 : 1,
          }}
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-indigo-400" />
              <h4 className="font-semibold text-sm text-[var(--color-foreground)]">Upgrade to Pro</h4>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3 leading-relaxed">
              Unlock unlimited habits & advanced analytics.
            </p>
            <button className="
              w-full text-xs font-semibold py-2 rounded-xl
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700
              text-white shadow-md shadow-indigo-500/20
              transition-all duration-200 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95
            ">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

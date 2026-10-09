import React, { useState } from 'react';
import { Compass, Bell, Menu, X, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp, NavigationPage } from '../context/AppContext.js';
import { UserRole } from '../types/index.js';

export const Navbar: React.FC = () => {
  const {
    activePage,
    navigateTo,
    currentUserRole,
    setCurrentUserRole,
    compareEventIds,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsGoalsModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navLinks: { label: string; page: NavigationPage }[] = [
    { label: 'Discover', page: 'discover' },
    { label: 'Heatmap', page: 'heatmap' },
    { label: 'Compare', page: 'compare' },
    { label: '2-Hour Mode', page: 'freetime' },
    { label: 'My Events', page: 'myevents' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#3E2723] text-[#F3E9D8] border-b border-[#2A1713] shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo with Accent Gold */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigateTo('discover')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8963E] to-[#A9805E] flex items-center justify-center text-[#3E2723] shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-[#3E2723]" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-[#FBF3E4] block leading-none font-sans">
                  Worth<span className="text-[#C8963E]">While</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#C8963E] font-semibold block mt-0.5">
                  Campus Event Intelligence
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive = activePage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => navigateTo(link.page)}
                    className={`relative px-3.5 py-2 text-xs font-semibold rounded-full transition-colors ${
                      isActive
                        ? 'text-[#FBF3E4] bg-[#2A1713]'
                        : 'text-[#EADCC4] hover:text-[#FFFFFF] hover:bg-[#4E322C]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.page === 'compare' && compareEventIds.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#C8963E] text-[#3E2723] font-bold">
                        {compareEventIds.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#C8963E] rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Organizer Portal Tab */}
              <button
                onClick={() => navigateTo('organizer')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activePage === 'organizer'
                    ? 'text-[#FBF3E4] bg-[#2A1713]'
                    : 'text-[#EADCC4] hover:text-[#FFFFFF] hover:bg-[#4E322C]'
                }`}
              >
                Organizer Desk
              </button>
            </nav>
          </div>

          {/* Right Side: Role Selector, Notifications & Action Link */}
          <div className="flex items-center gap-3">
            
            {/* Highlighted Action Link (Pill CTA like "Order Now") */}
            <button
              onClick={() => setIsGoalsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A9805E] hover:bg-[#96704F] text-[#FBF3E4] text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              title="Change your target goals for personalized relevance scoring"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FBF3E4]" />
              <span>Semester Goals</span>
            </button>

            {/* Role Switcher (Student / Organizer) */}
            <div className="hidden lg:flex items-center bg-[#2A1713] p-0.5 rounded-full border border-[#4E322C]">
              {(['student', 'organizer'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentUserRole(role);
                    if (role === 'organizer') navigateTo('organizer');
                    else if (activePage === 'organizer') navigateTo('discover');
                  }}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors capitalize ${
                    currentUserRole === role
                      ? 'bg-[#C8963E] text-[#3E2723] shadow-xs'
                      : 'text-[#EADCC4] hover:text-[#FFFFFF]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full text-[#EADCC4] hover:bg-[#4E322C] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#FBF3E4]" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C8963E]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FBF3E4] border border-[#EADCC4] shadow-2xl p-4 z-50 text-[#1E1410] animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EADCC4]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E2723]">
                        Notifications
                      </h4>
                      {unreadNotificationCount > 0 && (
                        <span className="text-[10px] bg-[#3E2723] text-[#FBF3E4] px-1.5 py-0.2 rounded-full font-bold">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-[#A9805E] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#6B5A4E] py-4 text-center">
                        No notifications right now.
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.event_id) {
                              navigateTo('event-details', n.event_id);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'border-transparent bg-[#F3E9D8]/40 text-[#6B5A4E]'
                              : 'border-[#A9805E]/40 bg-[#F3E9D8] text-[#1E1410]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-xs text-[#1E1410]">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C8963E] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#6B5A4E] mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div
              onClick={() => navigateTo('myevents')}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-[#4E322C] transition-colors"
              title="View your Activity Portfolio"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Alex Chen"
                className="w-8 h-8 rounded-full object-cover border-2 border-[#C8963E]"
              />
              <span className="hidden sm:inline text-xs font-semibold text-[#FBF3E4]">
                Alex Chen
              </span>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#FBF3E4] hover:bg-[#4E322C]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2A1713] bg-[#3E2723] px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => {
                navigateTo(link.page);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-full ${
                activePage === link.page
                  ? 'bg-[#2A1713] text-[#FBF3E4]'
                  : 'text-[#EADCC4] hover:bg-[#4E322C]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigateTo('organizer');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-full text-[#EADCC4] hover:bg-[#4E322C]"
          >
            Organizer Desk
          </button>
          <div className="pt-2 border-t border-[#2A1713]">
            <button
              onClick={() => {
                setIsGoalsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-bold rounded-full bg-[#A9805E] text-[#FBF3E4]"
            >
              Customize Semester Goals
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

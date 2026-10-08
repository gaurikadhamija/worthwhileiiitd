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
    <header className="sticky top-0 z-40 w-full bg-[#FAF2E6]/90 backdrop-blur-md border-b border-[#D8C5AE] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigateTo('discover')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C0F12] to-[#6B1E23] flex items-center justify-center text-[#FFFDF8] shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-[#E8DCC8]" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-[#2C0F12] block leading-none">
                  WorthWhile
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#6B1E23] font-semibold block mt-0.5">
                  Campus Intelligence
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
                    className={`relative px-3.5 py-2 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'text-[#6B1E23]'
                        : 'text-[#5A3828] hover:text-[#2A1B16]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.page === 'compare' && compareEventIds.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#6B1E23] text-[#FFFDF8] font-bold">
                        {compareEventIds.length}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#6B1E23] rounded-full" />
                    )}
                  </button>
                );
              })}

              {/* Organizer Portal Tab */}
              <button
                onClick={() => navigateTo('organizer')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activePage === 'organizer'
                    ? 'text-[#6B1E23] bg-[#F4EBDD]'
                    : 'text-[#5A3828] hover:text-[#2A1B16]'
                }`}
              >
                Organizer Desk
              </button>
            </nav>
          </div>

          {/* Right Side: Role Selector, Notifications & Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Quick Goals Trigger */}
            <button
              onClick={() => setIsGoalsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DCC8] bg-[#F4EBDD]/60 hover:bg-[#F4EBDD] text-xs font-medium text-[#2A1B16] transition-colors"
              title="Change your target goals for personalized relevance scoring"
            >
              <Sliders className="w-3.5 h-3.5 text-[#6B1E23]" />
              <span>My Goals</span>
            </button>

            {/* Role Switcher (Student / Organizer / Admin) */}
            <div className="hidden lg:flex items-center bg-[#F4EBDD] p-0.5 rounded-lg border border-[#E8DCC8]">
              {(['student', 'organizer'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentUserRole(role);
                    if (role === 'organizer') navigateTo('organizer');
                    else if (activePage === 'organizer') navigateTo('discover');
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors capitalize ${
                    currentUserRole === role
                      ? 'bg-[#2C0F12] text-[#FFFDF8] shadow-xs'
                      : 'text-[#5A3828] hover:text-[#2A1B16]'
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
                className="relative p-2 rounded-xl text-[#5A3828] hover:bg-[#F4EBDD] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[#2A1B16]" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6B1E23]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFDF8] border border-[#E8DCC8] shadow-2xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4EBDD]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1B16]">
                        Notifications
                      </h4>
                      {unreadNotificationCount > 0 && (
                        <span className="text-[10px] bg-[#6B1E23] text-white px-1.5 py-0.2 rounded-full font-bold">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-[#6B1E23] hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-[#5A3828] py-4 text-center">
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
                              ? 'border-transparent bg-[#F4EBDD]/40 text-[#5A3828]'
                              : 'border-[#6B1E23]/30 bg-[#F4EBDD] text-[#2A1B16]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-xs text-[#2A1B16]">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#6B1E23] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#5A3828] mt-0.5 line-clamp-2">
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
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-[#F4EBDD] transition-colors"
              title="View your Activity Portfolio"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Alex Chen"
                className="w-8 h-8 rounded-full object-cover border border-[#E8DCC8]"
              />
              <span className="hidden sm:inline text-xs font-semibold text-[#2A1B16]">
                Alex Chen
              </span>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#2A1B16] hover:bg-[#F4EBDD]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DCC8] bg-[#FFFDF8] px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => {
                navigateTo(link.page);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl ${
                activePage === link.page
                  ? 'bg-[#2C0F12] text-[#FFFDF8]'
                  : 'text-[#2A1B16] hover:bg-[#F4EBDD]'
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
            className="block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl text-[#2A1B16] hover:bg-[#F4EBDD]"
          >
            Organizer Desk
          </button>
          <div className="pt-2 border-t border-[#E8DCC8]">
            <button
              onClick={() => {
                setIsGoalsModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-[#6B1E23] text-[#FFFDF8]"
            >
              Customize Semester Goals
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

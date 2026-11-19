import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  ChevronDown,
  User,
  Settings,
  Globe,
  ShieldCheck,
  LogOut,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage, CyberLogo } from '../ui/Primitives';
import { t } from '../../data/i18n';

interface TopBarProps {
  onOpenSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSidebar }) => {
  const {
    user,
    language,
    setLanguage,
    navigate,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    markNotificationRead,
    searchQuery,
    setSearchQuery,
    runGlobalSearch,
    setAiDrawerOpen,
    logoutDemo,
  } = useApp();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runGlobalSearch(localSearch);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0A1224]/90 backdrop-blur-md border-b border-[rgba(120,150,210,0.18)] px-2 sm:px-4 flex items-center justify-between gap-3">
      {/* Left: Mobile menu button + mobile brand + desktop search */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('dashboard')}
          className="lg:hidden shrink-0"
          aria-label="Go to CyberHub Home"
        >
          <CyberLogo compact />
        </button>

        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#A5B1C8] absolute left-3.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t(language, 'searchPlaceholder')}
            className="w-full h-10 pl-10 pr-16 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-sm text-[#F5F7FF] placeholder-[#A5B1C8]/70 focus:outline-none focus:border-[#713BFF] transition-colors"
          />
          <span className="absolute right-3 text-[11px] font-mono text-[#A5B1C8]/80 bg-[#14213B] px-1.5 py-0.5 rounded border border-[rgba(120,150,210,0.18)]">
            Ctrl+K
          </span>
        </form>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Mobile search icon */}
        <button
          onClick={() => navigate('search')}
          aria-label="Search"
          className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#A5B1C8] hover:text-[#F5F7FF] hover:bg-[#101A30]"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'so' : 'en')}
          title="Switch English / Somali"
          className="hidden md:flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-xs font-semibold text-[#A5B1C8] hover:text-[#F5F7FF] transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-[#08D9E8]" />
          <span>{language.toUpperCase()}</span>
        </button>

        {/* AI Assistant Drawer Shortcut */}
        <button
          onClick={() => setAiDrawerOpen(true)}
          aria-label="Open CyberHub AI Assistant"
          className="min-h-[40px] px-2.5 sm:px-3 flex items-center gap-1.5 rounded-xl bg-[#713BFF]/15 border border-[#713BFF]/40 text-[#F5F7FF] hover:bg-[#713BFF]/25 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#08D9E8]" />
          <span className="hidden md:inline">AI Tutor</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.18)] text-[#A5B1C8] hover:text-[#F5F7FF] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#713BFF] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#101A30] border border-[rgba(120,150,210,0.24)] rounded-2xl shadow-2xl overflow-hidden z-40">
              <div className="px-4 py-3 border-b border-[rgba(120,150,210,0.16)] flex items-center justify-between bg-[#0A1224]">
                <span className="text-sm font-semibold text-[#F5F7FF]">Notifications</span>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#08D9E8] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(120,150,210,0.1)]">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setNotifOpen(false);
                      navigate(n.targetPage);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-[#14213B] transition-colors ${
                      n.read ? 'opacity-70' : 'bg-[#14213B]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#F5F7FF]">{n.title}</span>
                      <span className="text-[11px] text-[#A5B1C8] shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#A5B1C8] mt-1 line-clamp-2">{n.body}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-[#101A30] border border-[rgba(120,150,210,0.18)] hover:border-[rgba(120,150,210,0.35)] transition-colors min-h-[40px]"
          >
            <SafeImage
              src={user.avatar}
              alt={user.fullName}
              className="w-7 h-7 rounded-lg object-cover shrink-0"
            />
            <div className="hidden md:block text-left leading-tight">
              <div className="text-xs font-semibold text-[#F5F7FF] max-w-[110px] truncate">
                {user.fullName}
              </div>
              <div className="text-[10px] text-[#08D9E8] font-medium">
                {user.membership} Member
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#A5B1C8] hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#101A30] border border-[rgba(120,150,210,0.24)] rounded-2xl shadow-2xl overflow-hidden z-40 py-1.5">
              <div className="px-3.5 py-2 border-b border-[rgba(120,150,210,0.14)]">
                <div className="text-xs font-semibold text-[#F5F7FF] truncate">{user.fullName}</div>
                <div className="text-[11px] text-[#A5B1C8] truncate">@{user.username}</div>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('profile');
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs text-[#F5F7FF] hover:bg-[#14213B] flex items-center gap-2.5"
              >
                <User className="w-4 h-4 text-[#A5B1C8]" />
                {t(language, 'navProfile')}
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('settings');
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs text-[#F5F7FF] hover:bg-[#14213B] flex items-center gap-2.5"
              >
                <Settings className="w-4 h-4 text-[#A5B1C8]" />
                {t(language, 'navSettings')}
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('landing');
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs text-[#F5F7FF] hover:bg-[#14213B] flex items-center gap-2.5"
              >
                <Globe className="w-4 h-4 text-[#08D9E8]" />
                {t(language, 'publicSite')}
              </button>
              {user.isAdmin && (
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('admin');
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-[#F5F7FF] hover:bg-[#14213B] flex items-center gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4 text-[#12D69A]" />
                  {t(language, 'navAdmin')}
                </button>
              )}
              <div className="my-1 border-t border-[rgba(120,150,210,0.14)]" />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logoutDemo();
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs text-[#FF9F43] hover:bg-[#14213B] flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

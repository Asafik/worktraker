import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Search, Moon, Sun, Bell, ChevronDown, Menu, Settings, LogOut, User } from 'lucide-react';

export default function Navbar({
    setSidebarOpen,
    darkMode,
    setDarkMode,
    userName,
    userRole,
    userAvatar,
}) {
    const { auth } = usePage().props;
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const effectiveName = userName || auth?.user?.name || 'Asafik';
    const effectiveRole = userRole || auth?.user?.role || 'Full Stack Developer';
    const effectiveAvatar = userAvatar || auth?.user?.avatar || '/images/avatar1.png';

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setProfileOpen(false);
        router.post('/logout');
    };

    return (
        <header className="h-20 bg-white dark:bg-[#0b1739] border-b border-[#e2e8f5] dark:border-[#1b2b5a] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
            {/* Left: Mobile Toggle & Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-lg">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="xl:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-[#f8fafc] dark:bg-[#0f1f4b] border border-slate-200/90 dark:border-[#223974] rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#132354] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions & User Profile */}
            <div className="flex items-center gap-2 sm:gap-4 pl-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    aria-label="Toggle Theme"
                >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                    title="Notifications"
                    aria-label="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2 ring-2 ring-white dark:ring-[#0b1739]"></span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                {/* Profile Badge with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setProfileOpen((prev) => !prev)}
                        className="flex items-center gap-3 pl-1 cursor-pointer select-none group"
                        title="Profile Menu"
                        aria-haspopup="true"
                        aria-expanded={profileOpen}
                    >
                        <img
                            src={effectiveAvatar}
                            alt={effectiveName}
                            className={`w-9 h-9 rounded-full object-cover ring-2 transition-all shadow-xs ${
                                profileOpen
                                    ? 'ring-blue-400'
                                    : 'ring-slate-100 dark:ring-slate-700 group-hover:ring-blue-400'
                            }`}
                        />
                        <div className="hidden sm:block text-left">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug flex items-center gap-1">
                                <span>{effectiveName}</span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-slate-400 transition-all duration-200 ${
                                        profileOpen ? 'rotate-180 text-blue-400' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                    }`}
                                />
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 font-normal">{effectiveRole}</span>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {profileOpen && (
                        <div
                            className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white dark:bg-[#0d1c45] border border-slate-200 dark:border-[#1b2b5a] rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 overflow-hidden z-50 animate-in"
                            style={{ animation: 'dropdownIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                        >
                            <style>{`
                                @keyframes dropdownIn {
                                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                                }
                            `}</style>

                            {/* Profile Header */}
                            <div className="px-4 py-3.5 border-b border-slate-100 dark:border-[#1b2b5a]">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={effectiveAvatar}
                                        alt={effectiveName}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400/40"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{effectiveName}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{effectiveRole}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1.5">
                                <Link
                                    href="/settings"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1b2b5a] hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#132354] flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                        <User className="w-4 h-4" />
                                    </span>
                                    <span className="font-medium">Profil Saya</span>
                                </Link>

                                <Link
                                    href="/settings"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1b2b5a] hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#132354] flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                        <Settings className="w-4 h-4" />
                                    </span>
                                    <span className="font-medium">Pengaturan</span>
                                </Link>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-100 dark:border-[#1b2b5a]" />

                            {/* Logout */}
                            <div className="py-1.5">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </span>
                                    <span className="font-semibold">Keluar</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

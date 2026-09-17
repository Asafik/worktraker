import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, Moon, Sun, Bell, ChevronDown, Menu } from 'lucide-react';

export default function Navbar({
    setSidebarOpen,
    darkMode,
    setDarkMode,
    userName,
    userRole,
    userAvatar,
}) {
    const { auth } = usePage().props;

    const effectiveName = userName || auth?.user?.name || 'Asafik';
    const effectiveRole = userRole || auth?.user?.role || 'Full Stack Developer';
    const effectiveAvatar = userAvatar || auth?.user?.avatar || '/images/avatar1.png';

    return (
        <header className="h-20 bg-white dark:bg-[#0b1739] border-b border-[#e2e8f5] dark:border-[#1b2b5a] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
            {/* Left: Mobile Toggle & Search Bar */}
            <div className="flex items-center gap-4 flex-1 max-w-lg">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                    title="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2 right-2 ring-2 ring-white dark:ring-[#0b1739]"></span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                {/* Profile Badge */}
                <Link
                    href="/settings"
                    className="flex items-center gap-3 pl-1 cursor-pointer select-none group"
                    title="Pengaturan Profil"
                >
                    <img
                        src={effectiveAvatar}
                        alt={effectiveName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-blue-400 transition-all shadow-xs"
                    />
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug flex items-center gap-1">
                            <span>{effectiveName}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-slate-400 font-normal">{effectiveRole}</span>
                    </div>
                </Link>
            </div>
        </header>
    );
}

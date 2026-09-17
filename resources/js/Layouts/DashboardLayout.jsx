import React, { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';

export default function DashboardLayout({ children, activePage = 'Dashboard', user }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Persistent dark mode state
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="h-screen bg-[#f4f7fc] dark:bg-[#070c1e] flex antialiased font-sans text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-200 selection:bg-blue-600 selection:text-white">
            {/* Modular Sidebar Component */}
            <Sidebar
                activePage={activePage}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Modular Navbar Component */}
                <Navbar
                    setSidebarOpen={setSidebarOpen}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    userName={user?.name}
                    userRole={user?.role}
                    userAvatar={user?.avatar}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 bg-[#f4f7fc] dark:bg-[#070c1e] transition-colors duration-200">
                    <div className="w-full space-y-5">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

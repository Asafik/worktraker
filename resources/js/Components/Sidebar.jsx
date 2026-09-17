import React from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    FileText,
    Calendar,
    Archive,
    Briefcase,
    Settings,
    X,
} from 'lucide-react';

export default function Sidebar({ activePage = 'Dashboard', sidebarOpen, setSidebarOpen }) {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Projects', icon: FolderKanban, href: '/projects' },
        { name: 'Tasks', icon: CheckSquare, href: '/tasks' },
        { name: 'Notes', icon: FileText, href: '/notes' },
        { name: 'Calendar', icon: Calendar, href: '/calendar' },
        { name: 'Archive', icon: Archive, href: '/archive' },
        { name: 'Portfolio', icon: Briefcase, href: '/portfolio' },
        { name: 'Settings', icon: Settings, href: '/settings' },
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container (Deep Royal Navy #0b1739) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#0b1739] text-slate-300 flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Brand / Logo */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-[#1b2b5a]/60 flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/images/logo.png"
                                alt="WorkTrack Logo"
                                className="w-8 h-8 rounded-lg object-contain shadow-md shadow-blue-500/20"
                            />
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                                    WorkTrack
                                </h1>
                                <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                                    Plan &bull; Build &bull; Grow
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white p-1"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.name === activePage;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    prefetch
                                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? 'bg-[#3b52d4] text-white shadow-md shadow-blue-900/40'
                                            : 'text-[#8a99b5] hover:text-white hover:bg-[#142452]'
                                    }`}
                                >
                                    <Icon
                                        className={`w-[18px] h-[18px] transition-colors ${
                                            isActive ? 'text-white' : 'text-[#8a99b5] group-hover:text-white'
                                        }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Motivation Area (Seamless edge-to-edge, font Poppins) */}
                <div className="w-full relative select-none overflow-hidden flex flex-col flex-shrink-0">
                    <div className="px-5 pt-2 pb-1 relative z-10 space-y-1">
                        <p className="text-[13px] font-medium text-slate-100 leading-snug tracking-tight font-['Poppins',sans-serif]">
                            "A little progress<br />
                            each day adds up<br />
                            to big results."
                        </p>
                        <p className="text-[11px] text-[#7d93be] font-medium font-['Poppins',sans-serif]">
                            — Unknown
                        </p>
                    </div>
                    <div className="relative w-full overflow-hidden pointer-events-none">
                        <img
                            src="/images/sidebar_boy_night.png"
                            alt="Inspiration illustration"
                            className="w-full h-auto object-cover object-bottom block"
                        />
                    </div>
                </div>
            </aside>
        </>
    );
}

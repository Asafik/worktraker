import React from 'react';
import { Link } from '@inertiajs/react';
import { Mail } from 'lucide-react';

const navItems = [
    { id: 'home', label: 'Home', href: '/#home' },
    { id: 'projects', label: 'Projects', href: '/#projects' },
    { id: 'experience', label: 'Experience', href: '/#experience' },
    { id: 'about', label: 'About', href: '/#about' },
    { id: 'contact', label: 'Contact', href: '/#contact' },
];

export default function LandingNavbar({
    activeSection = 'home',
    onNavClick = null,
    onContactClick = null,
}) {
    const handleItemClick = (e, item) => {
        if (onNavClick) {
            e.preventDefault();
            onNavClick(e, item.id);
        }
    };

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-[#070b19]/90 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                {/* Left: Brand */}
                <div className="flex-1 flex items-center justify-start">
                    <Link
                        href="/"
                        onClick={(e) => {
                            if (onNavClick) {
                                e.preventDefault();
                                onNavClick(e, 'home');
                            }
                        }}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <img
                            src="/images/logo.png"
                            alt="Rabirts Logo"
                            className="w-8 h-8 rounded-lg object-contain shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform"
                        />
                        <span className="font-extrabold text-lg tracking-tight text-white">
                            Rabirts
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation Links strictly centered */}
                <nav className="hidden md:flex items-center justify-center gap-8 text-xs sm:text-sm font-medium">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={(e) => handleItemClick(e, item)}
                                className={`relative transition-colors py-1 ${
                                    isActive
                                        ? 'text-white font-semibold after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-500'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Right: CTA Actions */}
                <div className="flex-1 flex items-center justify-end">
                    {onContactClick ? (
                        <button
                            type="button"
                            onClick={onContactClick}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4338ca] hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Let's Talk</span>
                        </button>
                    ) : (
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4338ca] hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Let's Talk</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ExternalLink,
    Mail,
    User,
    Puzzle,
    GraduationCap,
    Briefcase,
    MapPin,
    Moon,
    Sun,
    Send,
    CheckCircle2,
    X,
    LayoutDashboard,
} from 'lucide-react';

// Brand SVGs
const GithubIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedinIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
);

const InstagramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

// Tech Stack SVGs
const LaravelSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
        <path d="M57.6 15.8L34.1 2.2c-1.3-.7-2.9-.7-4.2 0L6.4 15.8c-1.3.7-2.1 2.1-2.1 3.6v27.2c0 1.5.8 2.9 2.1 3.6l23.5 13.6c1.3.7 2.9.7 4.2 0l23.5-13.6c1.3-.7 2.1-2.1 2.1-3.6V19.4c0-1.5-.8-2.9-2.1-3.6z" fill="#FF2D20" opacity="0.15" />
        <path d="M32 6L9 19.3v26.7L32 59.3l23-13.3V19.3L32 6z" stroke="#FF2D20" strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 6v26.7m0 0L9 19.3m23 13.4l23-13.4m-23 13.4v26.6" stroke="#FF2D20" strokeWidth="2.5" />
    </svg>
);

const PhpSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64">
        <ellipse cx="32" cy="32" rx="28" ry="18" fill="#777BB4" opacity="0.2" />
        <ellipse cx="32" cy="32" rx="28" ry="18" stroke="#777BB4" strokeWidth="2.5" fill="none" />
        <text x="32" y="38" textAnchor="middle" fill="#777BB4" fontSize="16" fontWeight="bold" fontFamily="sans-serif">PHP</text>
    </svg>
);

const MysqlSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64">
        <path d="M48 20c-4-4-12-6-20-4-10 2-16 10-16 18 0 10 8 16 18 16 12 0 20-8 20-16 0-3-1-6-2-8" fill="none" stroke="#00758F" strokeWidth="3" strokeLinecap="round" />
        <path d="M36 28c4 2 8 8 6 14-2 6-8 8-12 6" fill="none" stroke="#F29111" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const TailwindSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
        <path d="M16 28c3-6 7.5-9 13.5-9 9 0 11.5 6 16.5 6 3.5 0 6.5-1.5 9-4.5-3 6-7.5 9-13.5 9-9 0-11.5-6-16.5-6-3.5 0-6.5 1.5-9 4.5zM7 43c3-6 7.5-9 13.5-9 9 0 11.5 6 16.5 6 3.5 0 6.5-1.5 9-4.5-3 6-7.5 9-13.5 9-9 0-11.5-6-16.5-6-3.5 0-6.5 1.5-9 4.5z" fill="#06B6D4" />
    </svg>
);

const JsSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
        <rect width="48" height="48" x="8" y="8" rx="8" fill="#F7DF1E" />
        <path d="M26 40c0 4-3 6-7 6-3 0-5.5-1.5-6.5-3.5l3.5-2c.5 1 1.5 1.5 3 1.5s2.5-.5 2.5-2V26h4.5v14zm19.5-1c-1 3-3.5 5-7.5 5-5 0-8-3-8-8s3.5-8 8-8c4 0 7 2.5 7 7v1h-10.5c.2 2 1.5 3.5 4 3.5 1.5 0 2.5-.5 3-1.5l4 1z" fill="#000" />
    </svg>
);

const GitSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
        <rect width="36" height="36" x="14" y="14" rx="6" transform="rotate(45 32 32)" fill="#F05032" />
        <circle cx="27" cy="37" r="3.5" fill="#FFF" />
        <circle cx="37" cy="27" r="3.5" fill="#FFF" />
        <circle cx="43" cy="33" r="3.5" fill="#FFF" />
        <path d="M27 37l16-4M37 27v10" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const VscodeSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none">
        <path d="M47 8l-23 20 23 28 8-4V12l-8-4z" fill="#0065A9" />
        <path d="M47 8L31 22l-14-11-8 4v34l8 4 14-11 16 14 8-4V12l-8-4z" fill="#007ACC" />
        <path d="M9 15l15 17-15 17V15z" fill="#1F9CF0" />
    </svg>
);

const FigmaSvg = ({ className }) => (
    <svg className={className} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
        <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
);

export default function Welcome() {
    // Default to Light Mode per user request
    const [isDark, setIsDark] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [sentToast, setSentToast] = useState(false);

    const handleSendMessage = (e) => {
        e.preventDefault();
        setContactModal(false);
        setSentToast(true);
        setTimeout(() => setSentToast(false), 3000);
    };

    return (
        <div className={`min-h-screen font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
            isDark ? 'bg-[#070b19] text-slate-100' : 'bg-white text-slate-900'
        }`}>
            <Head title="Rabirts - Full Stack Web Developer" />

            {/* Success Toast */}
            {sentToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pesan Anda berhasil terkirim! Terima kasih telah menghubungi.</span>
                </div>
            )}

            {/* ========================================================== */}
            {/* 1. TOP NAVBAR (Always deep navy hero bar matching mockup) */}
            {/* ========================================================== */}
            <header className="fixed top-0 inset-x-0 z-40 bg-[#070b19]/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt="Rabirts Logo"
                            className="w-8 h-8 rounded-lg object-contain shadow-md shadow-blue-500/20"
                        />
                        <span className="font-extrabold text-lg tracking-tight text-white">
                            Rabirts
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-slate-300">
                        <a
                            href="#home"
                            className="text-white font-semibold relative after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                        >
                            Home
                        </a>
                        <a href="#projects" className="hover:text-white transition-colors">
                            Projects
                        </a>
                        <a href="#experience" className="hover:text-white transition-colors">
                            Experience
                        </a>
                        <a href="#about" className="hover:text-white transition-colors">
                            About
                        </a>
                        <a href="#contact" className="hover:text-white transition-colors">
                            Contact
                        </a>
                    </nav>

                    {/* Right CTA Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-300" />
                            )}
                        </button>

                        <button
                            onClick={() => setContactModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4338ca] hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/30 transition-all cursor-pointer"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Let's Talk</span>
                        </button>

                        {/* Direct link to WorkTrack Dashboard */}
                        <Link
                            href="/dashboard"
                            title="Buka WorkTrack Dashboard"
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ========================================================== */}
            {/* 2. HERO SECTION (Dark developer workstation matching mockup) */}
            {/* ========================================================== */}
            <section
                id="home"
                className="relative pt-28 sm:pt-36 pb-16 lg:pb-24 overflow-hidden bg-[#070b19] border-b border-slate-800/80"
            >
                {/* Ambient Radial Gradient Glow */}
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left Column: Bio & Action Buttons */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Greeting Badge */}
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Hello, I'm
                            </span>

                            {/* Headings */}
                            <div className="space-y-1">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                                    Rabirts
                                </h1>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500 tracking-tight">
                                    Web Developer
                                </h2>
                            </div>

                            {/* Bio Paragraph */}
                            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                                I build web applications, improve existing systems, and enjoy turning ideas into useful and clean digital products. Always learning, always improving.
                            </p>

                            {/* Call to Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="#projects"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>View My Work</span>
                                </a>

                                <a
                                    href="#about"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <User className="w-4 h-4" />
                                    <span>About Me</span>
                                </a>
                            </div>

                            {/* 4 Quick Stats Badges */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                                <div>
                                    <span className="block text-2xl font-black text-white">6+</span>
                                    <span className="text-[11px] text-slate-400">
                                        Months <br />Professional Experience
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-white">10+</span>
                                    <span className="text-[11px] text-slate-400">
                                        Projects <br />Worked On
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-white">3+</span>
                                    <span className="text-[11px] text-slate-400">
                                        Technologies <br />Mastered
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-black text-white">100%</span>
                                    <span className="text-[11px] text-slate-400">
                                        Keep Learning <br />Everyday
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Workstation Illustration & Quote Card */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-blue-950/40 group">
                                <img
                                    src="/images/hero_developer.png"
                                    alt="Developer Workstation"
                                    className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
                                />

                                {/* Glassmorphism floating quote card overlay */}
                                <div className="absolute bottom-5 right-5 max-w-[220px] sm:max-w-[250px] p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg space-y-1">
                                    <span className="text-blue-400 font-serif text-2xl leading-none">“</span>
                                    <p className="text-xs sm:text-sm text-slate-200 font-medium italic">
                                        A better version of me, every day.
                                    </p>
                                    <div className="w-8 h-0.5 bg-blue-500 mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 3. FEATURED PROJECTS (Selected Works - Default Light) */}
            {/* ========================================================== */}
            <section
                id="projects"
                className={`py-16 sm:py-20 border-b transition-colors ${
                    isDark ? 'bg-[#090e21] border-slate-800/80' : 'bg-[#fcfdfd] border-slate-200/80'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ FEATURED PROJECTS
                            </span>
                            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Selected <span className="text-blue-600">Works</span>
                            </h2>
                            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Some of the projects I've worked on, from internal systems to personal projects.
                            </p>
                        </div>

                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <span>View All Projects</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* 4 Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                id: 1,
                                type: 'Internal Project',
                                title: 'Monitoring Dapur MBG',
                                desc: 'A system for monitoring and verifying MBG kitchens, used by field officers with offline mode support.',
                                tags: ['Laravel', 'MySQL', 'Offline Mode'],
                                img: '/images/proj1.png',
                            },
                            {
                                id: 2,
                                type: 'Internal Project',
                                title: 'Verval Data System',
                                desc: 'Data verification system with role management and reporting features.',
                                tags: ['Laravel', 'Tailwind CSS', 'DOF'],
                                img: '/images/proj2.png',
                            },
                            {
                                id: 3,
                                type: 'Personal Project',
                                title: 'Personal Tracker',
                                desc: 'Track daily work, projects, and progress. Integrated with portfolio.',
                                tags: ['Laravel', 'Filament', 'Chart.js'],
                                img: '/images/proj3.png',
                            },
                            {
                                id: 4,
                                type: 'UI/UX Redesign',
                                title: 'Application Redesign',
                                desc: 'Redesigned the interface to be more modern, user-friendly, and responsive.',
                                tags: ['UI/UX', 'Tailwind CSS', 'Responsive'],
                                img: '/images/proj4.png',
                            },
                        ].map((proj) => (
                            <div
                                key={proj.id}
                                className={`rounded-xl border overflow-hidden hover:-translate-y-1 transition-all group flex flex-col justify-between ${
                                    isDark
                                        ? 'bg-[#0e1633] border-slate-800/80 shadow-lg hover:border-blue-500/50'
                                        : 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400'
                                }`}
                            >
                                <div className="space-y-3.5">
                                    {/* Thumbnail Preview with badges */}
                                    <div className="relative h-40 bg-slate-100 overflow-hidden border-b border-slate-100">
                                        <img
                                            src={proj.img}
                                            alt={proj.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                        />
                                        {/* Tag badge */}
                                        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                            isDark
                                                ? 'bg-slate-900/80 backdrop-blur-xs text-slate-300 border-slate-700/60'
                                                : 'bg-white/90 backdrop-blur-xs text-slate-700 border-slate-200/80 shadow-xs'
                                        }`}>
                                            {proj.type}
                                        </span>
                                        {/* Diagonal arrow button */}
                                        <div className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                                            isDark
                                                ? 'bg-slate-900/80 text-slate-300 border-slate-700/60 group-hover:text-blue-400'
                                                : 'bg-white text-slate-700 border-slate-200 shadow-xs group-hover:text-blue-600'
                                        }`}>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-4 space-y-1.5">
                                        <h3 className={`font-bold text-sm sm:text-base transition-colors ${
                                            isDark
                                                ? 'text-white group-hover:text-blue-400'
                                                : 'text-slate-900 group-hover:text-blue-600'
                                        }`}>
                                            {proj.title}
                                        </h3>
                                        <p className={`text-xs line-clamp-3 leading-relaxed ${
                                            isDark ? 'text-slate-400' : 'text-slate-500'
                                        }`}>
                                            {proj.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags footer */}
                                <div className="p-4 pt-3 flex flex-wrap gap-1.5">
                                    {proj.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                                isDark
                                                    ? 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200/70'
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 4. RECENT EXPERIENCE (Work Journey - Default Light) */}
            {/* ========================================================== */}
            <section
                id="experience"
                className={`py-16 sm:py-20 border-b transition-colors ${
                    isDark ? 'bg-[#070b19] border-slate-800/80' : 'bg-white border-slate-200/80'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ WORK JOURNEY
                            </span>
                            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Recent Experience
                            </h2>
                            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                A glimpse of what I've been working on.
                            </p>
                        </div>

                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <span>View Full Timeline</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Horizontal 4-step Timeline with connecting line */}
                    <div className="relative">
                        {/* Connecting line behind dots on large screens */}
                        <div className="hidden lg:block absolute top-[11px] left-8 right-8 h-0.5 bg-blue-100 dark:bg-slate-800 z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                            {[
                                {
                                    date: 'Sep 2026',
                                    title: 'UI/UX Redesign',
                                    desc: 'Improved interface and user experience for internal application.',
                                },
                                {
                                    date: 'Aug 2026',
                                    title: 'Feature Development',
                                    desc: 'Built new module and fixed several issues.',
                                },
                                {
                                    date: 'Jul 2026',
                                    title: 'Data Verification System',
                                    desc: 'Developed verval system with reporting features.',
                                },
                                {
                                    date: 'Jun 2026',
                                    title: 'System Maintenance',
                                    desc: 'Bug fixes and performance improvements.',
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-5 rounded-xl border transition-all space-y-3 relative ${
                                        isDark
                                            ? 'bg-[#0e1633] border-slate-800/80 hover:border-slate-700'
                                            : 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950/60" />
                                        <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {item.date}
                                        </span>
                                    </div>
                                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 5. TECH STACK (Tools I Use - Default Light) */}
            {/* ========================================================== */}
            <section
                className={`py-16 sm:py-20 border-b transition-colors ${
                    isDark ? 'bg-[#090e21] border-slate-800/80' : 'bg-[#fcfdfd] border-slate-200/80'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="space-y-1 text-center sm:text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            ‹ TECH STACK
                        </span>
                        <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Tools I Use
                        </h2>
                        <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Technologies and tools that I work with.
                        </p>
                    </div>

                    {/* 8 Tool cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
                        {[
                            { name: 'Laravel', icon: LaravelSvg },
                            { name: 'PHP', icon: PhpSvg },
                            { name: 'MySQL', icon: MysqlSvg },
                            { name: 'Tailwind CSS', icon: TailwindSvg },
                            { name: 'JavaScript', icon: JsSvg },
                            { name: 'Git', icon: GitSvg },
                            { name: 'VS Code', icon: VscodeSvg },
                            { name: 'Figma', icon: FigmaSvg },
                        ].map((tool, tIdx) => {
                            const IconComponent = tool.icon;
                            return (
                                <div
                                    key={tIdx}
                                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all hover:-translate-y-1 group ${
                                        isDark
                                            ? 'bg-[#0e1633] border-slate-800/80 hover:border-blue-500/50'
                                            : 'bg-white border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md'
                                    }`}
                                >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <IconComponent className="w-8 h-8 object-contain transition-transform group-hover:scale-110" />
                                    </div>
                                    <span className={`text-xs font-semibold transition-colors ${
                                        isDark
                                            ? 'text-slate-300 group-hover:text-white'
                                            : 'text-slate-700 group-hover:text-slate-900'
                                    }`}>
                                        {tool.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 6. ABOUT ME (More Than Just Code - Default Light) */}
            {/* ========================================================== */}
            <section
                id="about"
                className={`py-16 sm:py-20 border-b transition-colors ${
                    isDark ? 'bg-[#070b19] border-slate-800/80' : 'bg-white border-slate-200/80'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left: Bio & Philosophy */}
                        <div className="lg:col-span-5 space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ ABOUT ME
                            </span>
                            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                More Than <span className="text-indigo-600">Just Code</span>
                            </h2>
                            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                I'm a web developer who enjoys solving problems, learning new technologies, and building things that are useful. I'm currently working while continuously improving my skills, with a focus on Laravel and modern web development.
                            </p>

                            <div className="pt-2">
                                <Link
                                    href="/portfolio"
                                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                                        isDark
                                            ? 'border-slate-700 bg-[#0e1633] hover:bg-[#152047] text-white'
                                            : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                                    }`}
                                >
                                    <span>Learn More About Me</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Center: Mountain Banner Illustration */}
                        <div className="lg:col-span-4 flex items-center justify-center">
                            <div className={`rounded-xl overflow-hidden border shadow-xs ${
                                isDark ? 'border-slate-800/80' : 'border-slate-200'
                            }`}>
                                <img
                                    src="/images/about_illustration.png"
                                    alt="Same person, bigger goals"
                                    className="w-full h-auto object-contain max-h-[190px]"
                                />
                            </div>
                        </div>

                        {/* Right: 4 Attribute Pills */}
                        <div className="lg:col-span-3 space-y-2.5">
                            {[
                                { title: 'Problem Solver', icon: Puzzle },
                                { title: 'Continuous Learner', icon: GraduationCap },
                                { title: 'Open to Opportunities', icon: Briefcase },
                                { title: 'Based in Indonesia', icon: MapPin },
                            ].map((attr, aIdx) => {
                                const AttrIcon = attr.icon;
                                return (
                                    <div
                                        key={aIdx}
                                        className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
                                            isDark
                                                ? 'bg-[#0e1633] border-slate-800/80 hover:border-slate-700'
                                                : 'bg-[#f8fafc] border-slate-200/80 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                            <AttrIcon className="w-4 h-4" />
                                        </div>
                                        <span className={`font-semibold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                            {attr.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 7. GET IN TOUCH (Let's Connect - Default Light) */}
            {/* ========================================================== */}
            <section
                id="contact"
                className={`py-16 sm:py-20 border-b transition-colors ${
                    isDark ? 'bg-[#090e21] border-slate-800/80' : 'bg-[#fcfdfd] border-slate-200/80'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ LET'S CONNECT
                            </span>
                            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Get In Touch
                            </h2>
                            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Have a project in mind or just want to say hello? Feel free to reach out!
                            </p>
                        </div>

                        {/* Right Action & Socials */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setContactModal(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4f46e5] hover:bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Send Me a Message</span>
                            </button>

                            <div className="flex items-center gap-2 pl-2">
                                <a
                                    href="https://github.com/asafik"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`p-2 rounded-lg border transition-colors ${
                                        isDark
                                            ? 'bg-[#0e1633] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <GithubIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://linkedin.com/in/asafik"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`p-2 rounded-lg border transition-colors ${
                                        isDark
                                            ? 'bg-[#0e1633] border-slate-800 text-slate-400 hover:text-blue-400 hover:border-slate-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <LinkedinIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`p-2 rounded-lg border transition-colors ${
                                        isDark
                                            ? 'bg-[#0e1633] border-slate-800 text-slate-400 hover:text-pink-400 hover:border-slate-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:text-pink-600 hover:border-slate-300 shadow-xs'
                                    }`}
                                >
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 8. FOOTER (Default Light matching mockup) */}
            {/* ========================================================== */}
            <footer className={`py-8 transition-colors ${
                isDark ? 'bg-[#070b19] text-slate-400' : 'bg-white text-slate-600'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}>
                        {/* Logo & Slogan */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Rabirts"
                                className="w-6 h-6 rounded-md object-contain"
                            />
                            <div>
                                <h3 className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Rabirts</h3>
                                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Building a better tomorrow, line by line.
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className={`flex items-center gap-6 text-xs ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            <a href="#home" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                                Home
                            </a>
                            <a href="#projects" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                                Projects
                            </a>
                            <a href="#experience" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                                Experience
                            </a>
                            <a href="#about" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                                About
                            </a>
                            <a href="#contact" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                                Contact
                            </a>
                        </div>
                    </div>

                    <div className={`pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                        <p>© 2026 Rabirts. All rights reserved.</p>
                        <p>Designed for WorkTrack Portfolio Showcase</p>
                    </div>
                </div>
            </footer>

            {/* ========================================================== */}
            {/* CONTACT MODAL */}
            {/* ========================================================== */}
            {contactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className={`rounded-xl border shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
                        isDark ? 'bg-[#0e1633] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                        <div className={`flex items-center justify-between pb-3 border-b ${
                            isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}>
                            <h3 className={`text-base font-bold flex items-center gap-2 ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                <Send className="w-4 h-4 text-blue-600" />
                                <span>Kirim Pesan ke Rabirts</span>
                            </h3>
                            <button
                                onClick={() => setContactModal(false)}
                                className={`p-1 cursor-pointer ${
                                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-3.5">
                            <div>
                                <label className={`block text-xs font-semibold mb-1 ${
                                    isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: John Doe"
                                    className={`w-full border rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${
                                        isDark
                                            ? 'bg-[#070b19] border-slate-700/80 text-slate-100 placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                                    }`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-1 ${
                                    isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                    Email Anda
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`w-full border rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${
                                        isDark
                                            ? 'bg-[#070b19] border-slate-700/80 text-slate-100 placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                                    }`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold mb-1 ${
                                    isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                    Pesan / Keperluan Proyek
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Ceritakan proyek atau tawaran kerja sama Anda..."
                                    className={`w-full border rounded-lg p-3 text-xs sm:text-sm focus:outline-none focus:border-blue-500 resize-none ${
                                        isDark
                                            ? 'bg-[#070b19] border-slate-700/80 text-slate-100 placeholder-slate-500'
                                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                                    }`}
                                    required
                                />
                            </div>

                            <div className={`flex items-center justify-end gap-2 pt-2 border-t ${
                                isDark ? 'border-slate-800' : 'border-slate-200'
                            }`}>
                                <button
                                    type="button"
                                    onClick={() => setContactModal(false)}
                                    className={`px-4 py-2 border rounded-lg text-xs font-semibold cursor-pointer ${
                                        isDark
                                            ? 'border-slate-700 text-slate-400 hover:text-white'
                                            : 'border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#4f46e5] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
                                >
                                    Kirim Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

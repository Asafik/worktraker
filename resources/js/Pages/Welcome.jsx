import React, { useState, useEffect } from 'react';
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

export default function Welcome({ initialSection = 'home' }) {
    const [contactModal, setContactModal] = useState(false);
    const [sentToast, setSentToast] = useState(false);
    const [activeSection, setActiveSection] = useState(initialSection);

    // Ensure landing page is strictly light mode (isolated from dashboard dark mode)
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    // Initial section scroll handling (e.g. if arriving via /about or hash)
    useEffect(() => {
        const target = initialSection || (window.location.hash ? window.location.hash.replace('#', '') : 'home');
        if (target && target !== 'home') {
            const el = document.getElementById(target);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(target);
                }, 150);
            }
        }
    }, [initialSection]);

    // Scroll Spy using IntersectionObserver to update active menu indicator
    useEffect(() => {
        const sections = ['home', 'projects', 'experience', 'about', 'contact'];
        const observers = [];

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        setActiveSection(sectionId);
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', `#${sectionId}`);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        setContactModal(false);
        setSentToast(true);
        setTimeout(() => setSentToast(false), 3000);
    };

    const navItems = [
        { label: 'Home', id: 'home' },
        { label: 'Projects', id: 'projects' },
        { label: 'Experience', id: 'experience' },
        { label: 'About', id: 'about' },
        { label: 'Contact', id: 'contact' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
            <Head title="Rabirts - Full Stack Web Developer" />

            {/* Success Toast */}
            {sentToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pesan Anda berhasil terkirim! Terima kasih telah menghubungi.</span>
                </div>
            )}

            {/* ========================================================== */}
            {/* 1. TOP NAVBAR (Deep navy bar matching mockup with active indicator) */}
            {/* ========================================================== */}
            <header className="fixed top-0 inset-x-0 z-40 bg-[#070b19]/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Brand */}
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, 'home')}
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
                    </a>

                    {/* Navigation Links with dynamic active underline */}
                    <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => handleNavClick(e, item.id)}
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

                    {/* Right CTA Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setContactModal(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4338ca] hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-indigo-500/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
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
            {/* 2. HERO SECTION (Compacted spacing, tight transition to projects) */}
            {/* ========================================================== */}
            <section
                id="home"
                className="relative pt-24 sm:pt-28 pb-10 sm:pb-12 lg:pb-14 overflow-hidden bg-[#070b19] border-b border-slate-800/80"
            >
                {/* Ambient Radial Gradient Glow */}
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        {/* Left Column: Bio & Action Buttons */}
                        <div className="lg:col-span-6 space-y-5">
                            {/* Greeting Badge */}
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Hello, I'm
                            </span>

                            {/* Headings */}
                            <div className="space-y-0.5">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
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
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <a
                                    href="#projects"
                                    onClick={(e) => handleNavClick(e, 'projects')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>View My Work</span>
                                </a>

                                <a
                                    href="#about"
                                    onClick={(e) => handleNavClick(e, 'about')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <User className="w-4 h-4" />
                                    <span>About Me</span>
                                </a>
                            </div>

                            {/* 4 Quick Stats Badges (Tighter top border margin) */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-800/80">
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
                                    src="/images/hero.png"
                                    alt="Developer Workstation"
                                    className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
                                />

                                {/* Glassmorphism floating quote card overlay */}
                                <div className="absolute bottom-4 right-4 max-w-[210px] sm:max-w-[240px] p-3.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-lg space-y-1">
                                    <span className="text-blue-400 font-serif text-2xl leading-none">“</span>
                                    <p className="text-xs sm:text-sm text-slate-200 font-medium italic">
                                        A better version of me, every day.
                                    </p>
                                    <div className="w-8 h-0.5 bg-blue-500 mt-1.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 3. FEATURED PROJECTS (Fully clickable cards with rich hover) */}
            {/* ========================================================== */}
            <section
                id="projects"
                className="py-14 sm:py-16 border-b bg-[#fcfdfd] border-slate-200/80"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ FEATURED PROJECTS
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Selected <span className="text-blue-600">Works</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Some of the projects I've worked on, from internal systems to personal projects.
                            </p>
                        </div>

                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                        >
                            <span>View All Projects</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* 4 Cards Grid - ENTIRE CARD IS CLICKABLE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                id: 1,
                                type: 'Internal Project',
                                title: 'Monitoring Dapur MBG',
                                desc: 'A system for monitoring and verifying MBG kitchens, used by field officers with offline mode support.',
                                tags: ['Laravel', 'MySQL', 'Offline Mode'],
                                img: '/images/proj1.png',
                                link: '/projects',
                            },
                            {
                                id: 2,
                                type: 'Internal Project',
                                title: 'Verval Data System',
                                desc: 'Data verification system with role management and reporting features.',
                                tags: ['Laravel', 'Tailwind CSS', 'DOF'],
                                img: '/images/proj2.png',
                                link: '/projects',
                            },
                            {
                                id: 3,
                                type: 'Personal Project',
                                title: 'Personal Tracker',
                                desc: 'Track daily work, projects, and progress. Integrated with portfolio.',
                                tags: ['Laravel', 'Filament', 'Chart.js'],
                                img: '/images/proj3.png',
                                link: '/projects',
                            },
                            {
                                id: 4,
                                type: 'UI/UX Redesign',
                                title: 'Application Redesign',
                                desc: 'Redesigned the interface to be more modern, user-friendly, and responsive.',
                                tags: ['UI/UX', 'Tailwind CSS', 'Responsive'],
                                img: '/images/proj4.png',
                                link: '/projects',
                            },
                        ].map((proj) => (
                            <Link
                                key={proj.id}
                                href={proj.link}
                                className="rounded-xl border overflow-hidden transition-all duration-300 group flex flex-col justify-between bg-white border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400/90 hover:-translate-y-1.5 cursor-pointer block text-left"
                            >
                                <div className="space-y-3.5">
                                    {/* Thumbnail Preview with badges */}
                                    <div className="relative h-40 bg-slate-100 overflow-hidden border-b border-slate-100">
                                        <img
                                            src={proj.img}
                                            alt={proj.title}
                                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                                        />
                                        {/* Tag badge */}
                                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border bg-white/90 backdrop-blur-xs text-slate-700 border-slate-200/80 shadow-xs">
                                            {proj.type}
                                        </span>
                                        {/* Diagonal arrow button */}
                                        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 bg-white text-slate-700 border-slate-200 shadow-xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:rotate-12">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-4 space-y-1.5">
                                        <h3 className="font-bold text-sm sm:text-base transition-colors text-slate-900 group-hover:text-blue-600">
                                            {proj.title}
                                        </h3>
                                        <p className="text-xs line-clamp-3 leading-relaxed text-slate-500">
                                            {proj.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags footer */}
                                <div className="p-4 pt-3 flex flex-wrap gap-1.5">
                                    {proj.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-slate-50 text-slate-600 border-slate-200/70 group-hover:border-slate-300 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 4. RECENT EXPERIENCE (1:1 with mockup screenshot) */}
            {/* ========================================================== */}
            <section
                id="experience"
                className="py-14 sm:py-16 border-b bg-white border-slate-200/80"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                ‹ WORK JOURNEY
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Recent Experience
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                A glimpse of what I've been working on.
                            </p>
                        </div>

                        <Link
                            href="/portfolio"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
                        >
                            <span>View Full Timeline</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Unified Timeline: Continuous Track + Cards with Dots on Top Border */}
                    <div className="relative pt-4">
                        {/* Horizontal connecting line spanning continuously across the entire width behind the dots */}
                        <div className="hidden lg:block absolute top-[16px] left-0 right-0 h-[1.5px] bg-[#e0e7ff] z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
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
                                    className="relative pt-8 pb-7 px-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300 group hover:-translate-y-1"
                                >
                                    {/* Solid Blue Circle Dot sitting right on top-left border on the horizontal track */}
                                    <div className="absolute -top-[7px] left-6 w-3.5 h-3.5 rounded-full bg-[#4f46e5] ring-4 ring-white z-10 group-hover:scale-125 transition-transform" />

                                    <span className="block text-xs font-semibold text-slate-500">
                                        {item.date}
                                    </span>
                                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 5. TECH STACK (Tools I Use) */}
            {/* ========================================================== */}
            <section className="py-14 sm:py-16 border-b bg-[#fcfdfd] border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
                    <div className="space-y-1 text-center sm:text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                            ‹ TECH STACK
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Tools I Use
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
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
                                    className="p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all duration-300 hover:-translate-y-1 group bg-white border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md cursor-default"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <IconComponent className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-200" />
                                    </div>
                                    <span className="text-xs font-semibold transition-colors text-slate-700 group-hover:text-blue-600">
                                        {tool.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 6. ABOUT ME (Generous illustration proportion matching mockup) */}
            {/* ========================================================== */}
            <section
                id="about"
                className="py-14 sm:py-16 border-b bg-white border-slate-200/80"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left: Bio & Philosophy (Col 5) */}
                        <div className="lg:col-span-5 space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ ABOUT ME
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                More Than <span className="text-indigo-600">Just Code</span>
                            </h2>
                            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                                I'm a web developer who enjoys solving problems, learning new technologies, and building things that are useful. I'm currently working while continuously improving my skills, with a focus on Laravel and modern web development.
                            </p>

                            <div className="pt-2">
                                <Link
                                    href="/portfolio"
                                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-xs sm:text-sm font-semibold transition-all hover:-translate-y-0.5 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs group"
                                >
                                    <span>Learn More About Me</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Center: Mountain Banner Illustration (avatar1.png + custom font typography) */}
                        <div className="lg:col-span-4 flex items-center justify-center">
                            <div className="w-full max-w-[460px] mx-auto relative group">
                                <img
                                    src="/images/avatar1.png"
                                    alt="Same person, bigger goals"
                                    className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-102"
                                />

                                {/* Elegant cursive handwriting text overlay */}
                                <div className="absolute top-3 right-2 sm:top-5 sm:right-5 text-right pointer-events-none select-none">
                                    <p
                                        className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight tracking-wide"
                                        style={{ fontFamily: "'Caveat', 'Kalam', cursive" }}
                                    >
                                        Same person, <br />
                                        bigger goals.
                                    </p>
                                    <div className="w-8 sm:w-10 h-0.5 bg-[#4338ca] ml-auto mt-1.5 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Right: 4 Attribute Pills (Col 3) */}
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
                                        className="p-3.5 rounded-xl border flex items-center gap-3.5 transition-all duration-200 bg-[#f8fafc] border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-xs group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <AttrIcon className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-xs text-slate-800 group-hover:text-slate-900">
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
            {/* 7. GET IN TOUCH (Let's Connect) */}
            {/* ========================================================== */}
            <section
                id="contact"
                className="py-14 sm:py-16 border-b bg-[#fcfdfd] border-slate-200/80"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                ‹ LET'S CONNECT
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Get In Touch
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Have a project in mind or just want to say hello? Feel free to reach out!
                            </p>
                        </div>

                        {/* Right Action & Socials */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setContactModal(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4f46e5] hover:bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Send Me a Message</span>
                            </button>

                            <div className="flex items-center gap-2 pl-2">
                                <a
                                    href="https://github.com/asafik"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg border transition-all bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:-translate-y-0.5 shadow-xs"
                                >
                                    <GithubIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://linkedin.com/in/asafik"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg border transition-all bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-slate-300 hover:-translate-y-0.5 shadow-xs"
                                >
                                    <LinkedinIcon className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg border transition-all bg-white border-slate-200 text-slate-600 hover:text-pink-600 hover:border-slate-300 hover:-translate-y-0.5 shadow-xs"
                                >
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 8. FOOTER */}
            {/* ========================================================== */}
            <footer className="py-8 bg-white text-slate-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                        {/* Logo & Slogan */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Rabirts"
                                className="w-6 h-6 rounded-md object-contain"
                            />
                            <div>
                                <h3 className="font-extrabold text-sm text-slate-900">Rabirts</h3>
                                <p className="text-[11px] text-slate-500">
                                    Building a better tomorrow, line by line.
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6 text-xs text-slate-600">
                            {navItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                    className="transition-colors hover:text-slate-900"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
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
                    <div className="rounded-xl border shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 bg-white border-slate-200 text-slate-900">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                                <Send className="w-4 h-4 text-blue-600" />
                                <span>Kirim Pesan ke Rabirts</span>
                            </h3>
                            <button
                                onClick={() => setContactModal(false)}
                                className="p-1 cursor-pointer text-slate-400 hover:text-slate-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-700">
                                    Nama Anda
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: John Doe"
                                    className="w-full border rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-700">
                                    Email Anda
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full border rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500 bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-1 text-slate-700">
                                    Pesan / Keperluan Proyek
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Ceritakan proyek atau tawaran kerja sama Anda..."
                                    className="w-full border rounded-lg p-3 text-xs sm:text-sm focus:outline-none focus:border-blue-500 resize-none bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setContactModal(false)}
                                    className="px-4 py-2 border rounded-lg text-xs font-semibold cursor-pointer border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
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

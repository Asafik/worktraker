import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronRight,
    ExternalLink,
    ChevronLeft,
    CheckCircle2,
    Check,
    Clock,
    User,
    Users,
    Shield,
    Calendar,
    Globe,
    ArrowRight,
    Moon,
    Sun,
    Mail,
    Quote,
    Layers,
    FolderKanban,
    Database,
    Code2,
    Smartphone,
    MapPin,
} from 'lucide-react';
import LandingNavbar from '@/Components/LandingNavbar';

const GithubIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
        />
    </svg>
);

const projectsDatabase = {
    'monitoring-dapur-mbg': {
        index: '01',
        title: 'Monitoring Dapur MBG',
        subtitle: 'A system for monitoring and verifying MBG kitchens, used by field officers with offline mode support.',
        category: 'Web Application',
        techHeader: 'Laravel · MySQL',
        liveDemoUrl: 'https://demo-mbg.asafik.dev',
        liveDemoDisplay: 'demo-mbg.asafik.dev',
        githubUrl: 'https://github.com/asafik/mbg',
        githubDisplay: 'github.com/asafik/mbg',
        info: {
            type: 'Web Application',
            role: 'Frontend Developer',
            team: '2 Developers',
            duration: 'Mar 2026 – Jun 2026',
            status: 'Completed',
            client: 'Internal / Government Program',
        },
        quote: 'Technology can help create transparency and better public services.',
        quoteAuthor: 'Asafik',
        overview: 'Monitoring Dapur MBG is a web application used to monitor and verify MBG kitchens across various regions. This system is used by field officers to collect data, verify the condition of kitchens, and generate reports. It features an offline mode to support usage in remote areas with limited internet access.',
        techStack: [
            { name: 'Laravel', icon: 'laravel' },
            { name: 'MySQL', icon: 'mysql' },
            { name: 'Tailwind CSS', icon: 'tailwind' },
            { name: 'JavaScript', icon: 'js' },
            { name: 'PWA', icon: 'pwa' },
            { name: 'Leaflet.js', icon: 'leaflet' },
            { name: 'Chart.js', icon: 'chartjs' },
            { name: 'SQLite (Offline)', icon: 'sqlite' },
        ],
        keyFeatures: [
            'Kitchen data management',
            'Verification system with role management',
            'Offline mode for field usage',
            'Interactive map with location data',
            'Reporting and data export',
            'User management and access control',
        ],
        challenges: [
            'Unstable internet connection in remote areas',
            'Handling offline data synchronization',
            'Designing a simple and clear UI for field officers',
        ],
        contributions: [
            'Built and implemented the frontend UI using Laravel Blade & Tailwind CSS',
            'Integrated interactive maps using Leaflet.js',
            'Implemented offline data storage using SQLite',
            'Collaborated with backend developer for API integration',
            'Participated in system testing and bug fixes',
        ],
        results: [
            'Successfully used by field officers in several regions',
            'Improved data collection and verification process',
            'Offline mode works well in low connectivity areas',
            'Positive feedback from end users',
        ],
        gallery: [
            { id: 1, title: 'Dashboard Overview with Map', img: '/images/proj1.png' },
            { id: 2, title: 'Data List & Table Verification', img: '/images/proj2.png' },
            { id: 3, title: 'Detail View & Status Tracking', img: '/images/proj3.png' },
            { id: 4, title: 'Analytics & Regional Coverage', img: '/images/proj4.png' },
        ],
    },
    'verval-data-system': {
        index: '02',
        title: 'Verval Data System',
        subtitle: 'Data verification portal with role-based access management, approval workflows, and audit reporting.',
        category: 'Web Application',
        techHeader: 'Laravel · Tailwind CSS',
        liveDemoUrl: 'https://verval.asafik.dev',
        liveDemoDisplay: 'verval.asafik.dev',
        githubUrl: 'https://github.com/asafik/verval-data',
        githubDisplay: 'github.com/asafik/verval-data',
        info: {
            type: 'Web Application',
            role: 'Full Stack Developer',
            team: 'Solo Project',
            duration: 'Jan 2026 – Feb 2026',
            status: 'Completed',
            client: 'Internal Enterprise Portal',
        },
        quote: 'Clean workflows and clear audit trails turn complex audits into confident decisions.',
        quoteAuthor: 'Asafik',
        overview: 'Verval Data System streamlines multi-tier validation procedures with comprehensive role verification, document previewing, and exportable audit logs tailored for high compliance reliability.',
        techStack: [
            { name: 'Laravel', icon: 'laravel' },
            { name: 'Tailwind CSS', icon: 'tailwind' },
            { name: 'MySQL', icon: 'mysql' },
            { name: 'JavaScript', icon: 'js' },
            { name: 'DDF', icon: 'chartjs' },
        ],
        keyFeatures: [
            'Hierarchical approval workflows',
            'Document upload & instant preview',
            'Customizable validation checklists',
            'Granular audit trail logging',
            'Automated email notifications',
        ],
        challenges: [
            'Ensuring strict role permission boundaries',
            'High volume batch processing of CSV exports',
        ],
        contributions: [
            'Designed normalized relational schema and database migrations',
            'Architected queue-driven report generation',
            'Implemented accessible UI with interactive data tables',
        ],
        results: [
            'Reduced verification bottlenecks by over 40%',
            'Zero permission leak incidents reported during testing',
        ],
        gallery: [
            { id: 1, title: 'Verification Portal Dashboard', img: '/images/proj2.png' },
            { id: 2, title: 'Approval Queue & Filter Matrix', img: '/images/proj1.png' },
            { id: 3, title: 'Audit Trail Explorer', img: '/images/proj3.png' },
            { id: 4, title: 'Batch Export System', img: '/images/proj4.png' },
        ],
    },
    'personal-tracker': {
        index: '03',
        title: 'Personal Tracker',
        subtitle: 'Track daily work, projects, and progress. Integrated with portfolio and analytics.',
        category: 'Web Application',
        techHeader: 'Laravel · Filament · Chart.js',
        liveDemoUrl: 'https://worktrack.asafik.dev',
        liveDemoDisplay: 'worktrack.asafik.dev',
        githubUrl: 'https://github.com/asafik/worktracker',
        githubDisplay: 'github.com/asafik/worktracker',
        info: {
            type: 'Web Application',
            role: 'Lead Developer & Designer',
            team: 'Solo Developer',
            duration: 'Dec 2025 – Present',
            status: 'Completed',
            client: 'Personal Productivity Tool',
        },
        quote: 'Consistency in tracking small wins compounds into massive long-term growth.',
        quoteAuthor: 'Asafik',
        overview: 'Personal Tracker is an all-in-one developer productivity dashboard that organizes tasks, daily activities, notes, and milestones with elegant visual data breakdowns.',
        techStack: [
            { name: 'Laravel', icon: 'laravel' },
            { name: 'Filament', icon: 'filament' },
            { name: 'Tailwind CSS', icon: 'tailwind' },
            { name: 'Chart.js', icon: 'chartjs' },
            { name: 'Inertia.js', icon: 'js' },
        ],
        keyFeatures: [
            'Daily work time tracking & sprint logging',
            'Interactive productivity charts and trends',
            'Integrated portfolio showcases and notes system',
            'Dark mode and aesthetic clean workspace',
        ],
        challenges: [
            'Balancing rich feature set with fast, snappy page loads',
            'Creating intuitive micro-interactions and smooth chart transitions',
        ],
        contributions: [
            'Built end-to-end full-stack application using Laravel & Inertia React',
            'Designed customized dashboard widgets and calendar scheduling',
        ],
        results: [
            'Doubled daily focus time with structured task checkpoints',
            '100% automated personal sprint retrospectives',
        ],
        gallery: [
            { id: 1, title: 'Analytics Dashboard Overview', img: '/images/proj3.png' },
            { id: 2, title: 'Task Pipeline Kanban', img: '/images/proj1.png' },
            { id: 3, title: 'Calendar & Sprint Scheduler', img: '/images/proj2.png' },
            { id: 4, title: 'Notes & Idea Vault', img: '/images/proj4.png' },
        ],
    },
    'application-redesign': {
        index: '04',
        title: 'Application Redesign',
        subtitle: 'Redesigned the interface to be more modern, user-friendly, and responsive.',
        category: 'UI/UX Redesign',
        techHeader: 'UI/UX · Tailwind CSS · Responsive',
        liveDemoUrl: 'https://redesign.asafik.dev',
        liveDemoDisplay: 'redesign.asafik.dev',
        githubUrl: 'https://github.com/asafik/app-redesign',
        githubDisplay: 'github.com/asafik/app-redesign',
        info: {
            type: 'Design & Frontend',
            role: 'UI/UX Designer & Frontend Eng',
            team: 'Solo Designer',
            duration: 'Nov 2025 – Dec 2025',
            status: 'Completed',
            client: 'Platform Modernization',
        },
        quote: 'Good design is invisible—it simply empowers users to accomplish their goals effortlessly.',
        quoteAuthor: 'Asafik',
        overview: 'A complete ground-up revamp of legacy enterprise views into a clean, modern, and delightfully accessible digital experience with responsive cross-device consistency.',
        techStack: [
            { name: 'Figma', icon: 'figma' },
            { name: 'Tailwind CSS', icon: 'tailwind' },
            { name: 'JavaScript', icon: 'js' },
            { name: 'Responsive UI', icon: 'pwa' },
        ],
        keyFeatures: [
            'Modernized design token system and typographic hierarchy',
            'Mobile-first responsive layouts across phones, tablets, and desktop',
            'Consistent micro-animations and intuitive hover feedback',
            'WCAG AA accessible contrast levels and keyboard navigation',
        ],
        challenges: [
            'Migrating dense complex tables to compact mobile viewports',
            'Retaining feature familiarity while drastically modernizing aesthetics',
        ],
        contributions: [
            'Conducted user flow analysis and high-fidelity wireframing',
            'Authored Tailwind utility system and reusable UI component primitives',
        ],
        results: [
            '95% positive feedback rating on interface intuitiveness',
            'Zero layout breakage across all tested viewport sizes',
        ],
        gallery: [
            { id: 1, title: 'Redesigned Platform Overview', img: '/images/proj4.png' },
            { id: 2, title: 'Mobile Responsive Adaptation', img: '/images/proj1.png' },
            { id: 3, title: 'Component Library & Design Tokens', img: '/images/proj2.png' },
            { id: 4, title: 'Form Verification Flow', img: '/images/proj3.png' },
        ],
    },
    'company-profile-cms': {
        index: '05',
        title: 'Company Profile & CMS',
        subtitle: 'Dynamic corporate web application with custom content management, lead tracking, and responsive portal.',
        category: 'Web Application',
        techHeader: 'Laravel · Vue.js · Tailwind CSS',
        liveDemoUrl: 'https://demo-cms.asafik.dev',
        liveDemoDisplay: 'demo-cms.asafik.dev',
        githubUrl: 'https://github.com/asafik/company-cms',
        githubDisplay: 'github.com/asafik/company-cms',
        info: {
            type: 'Client Project',
            role: 'Full Stack Developer',
            team: 'Solo Developer',
            duration: 'Apr 2026 – May 2026',
            status: 'Completed',
            client: 'Corporate Enterprise',
        },
        quote: 'A powerful CMS turns company communication into an effortless growth engine.',
        quoteAuthor: 'Asafik',
        overview: 'Company Profile & CMS is an all-in-one web portal enabling enterprise marketing teams to publish dynamic articles, manage career listings, and capture client inquiries with detailed analytics.',
        techStack: [
            { name: 'Laravel', icon: 'laravel' },
            { name: 'Vue.js', icon: 'js' },
            { name: 'Tailwind CSS', icon: 'tailwind' },
            { name: 'MySQL', icon: 'mysql' },
        ],
        keyFeatures: [
            'Dynamic page builder with customizable sections',
            'Rich-text article & blog publishing',
            'Interactive lead & contact form management',
            'SEO optimization & auto-generated sitemaps',
            'Role-based admin access control',
        ],
        challenges: [
            'Designing flexible schema for diverse content formats',
            'Optimizing initial bundle size for fast mobile loading',
        ],
        contributions: [
            'Architected Laravel backend APIs and database migrations',
            'Created modular Vue.js components with Tailwind CSS',
            'Configured automated email triggers and inquiry handling',
        ],
        results: [
            'Reduced content publishing turnaround time by 60%',
            'Achieved 98+ PageSpeed performance score',
        ],
        gallery: [
            { id: 1, title: 'CMS Dashboard & Overview', img: '/images/proj2.png' },
            { id: 2, title: 'Page Builder Interface', img: '/images/proj1.png' },
            { id: 3, title: 'Lead Analytics & Reports', img: '/images/proj3.png' },
            { id: 4, title: 'Mobile Responsive View', img: '/images/proj4.png' },
        ],
    },
};

const allRelatedProjects = [
    {
        slug: 'verval-data-system',
        title: 'Verval Data System',
        desc: 'Data verification system with role management and reporting features.',
        tags: ['Laravel', 'Tailwind CSS', 'DDF'],
        img: '/images/proj2.png',
    },
    {
        slug: 'personal-tracker',
        title: 'Personal Tracker',
        desc: 'Track daily work, projects, and progress. Integrated with portfolio.',
        tags: ['Laravel', 'Filament', 'Chart.js'],
        img: '/images/proj3.png',
    },
    {
        slug: 'application-redesign',
        title: 'Application Redesign',
        desc: 'Redesigned the interface to be more modern, user-friendly, and responsive.',
        tags: ['UI/UX', 'Tailwind CSS', 'Responsive'],
        img: '/images/proj4.png',
    },
    {
        slug: 'monitoring-dapur-mbg',
        title: 'Monitoring Dapur MBG',
        desc: 'A system for monitoring and verifying MBG kitchens, used by field officers.',
        tags: ['Laravel', 'MySQL', 'Offline Mode'],
        img: '/images/proj1.png',
    },
];

export default function ProjectDetail({ slug = 'monitoring-dapur-mbg' }) {
    const project = projectsDatabase[slug] || projectsDatabase['monitoring-dapur-mbg'];
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const related = allRelatedProjects
        .filter((p) => p.slug !== slug)
        .slice(0, 3);

    const handlePrev = () => {
        setActiveImageIdx((prev) => (prev === 0 ? project.gallery.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveImageIdx((prev) => (prev === project.gallery.length - 1 ? 0 : prev + 1));
    };

    const getTechIconBadge = (name) => {
        switch (name.toLowerCase()) {
            case 'laravel':
                return <div className="w-2.5 h-2.5 rounded-full bg-red-500" />;
            case 'mysql':
                return <Database className="w-3.5 h-3.5 text-blue-500" />;
            case 'tailwind css':
                return <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />;
            case 'javascript':
                return <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />;
            case 'pwa':
                return <Smartphone className="w-3.5 h-3.5 text-indigo-500" />;
            case 'leaflet.js':
                return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />;
            case 'chart.js':
                return <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />;
            case 'sqlite (offline)':
            case 'sqlite':
                return <Database className="w-3.5 h-3.5 text-slate-500" />;
            default:
                return <Code2 className="w-3.5 h-3.5 text-blue-500" />;
        }
    };

    return (
        <div className={`min-h-screen font-sans antialiased transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
            <Head title={`${project.title} - Rabirts`} />

            {/* ========================================================== */}
            {/* 1. TOP NAVBAR (Shared Reusable LandingNavbar Component)   */}
            {/* ========================================================== */}
            <LandingNavbar activeSection="projects" />

            {/* ========================================================== */}
            {/* 2. HERO HEADER (Seamless layout matching Welcome.jsx hero) */}
            {/* ========================================================== */}
            <section className="relative bg-[#070b19] text-white pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden min-h-[440px] lg:min-h-[480px] flex items-center">
                {/* Ambient Radial Gradient Glow */}
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Seamless Edge-to-Edge Developer Workstation Image on the right */}
                <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[58%] xl:w-[52%] pointer-events-none overflow-hidden select-none z-0">
                    <img
                        src="/images/hero.png"
                        alt="Developer Workstation"
                        className="w-full h-full object-cover object-[right_top] lg:object-[90%_top] opacity-60"
                    />
                    {/* Seamless Gradient Fade: left edge dissolves smoothly into the #070b19 background */}
                    <div className="absolute inset-y-0 left-0 w-36 sm:w-56 lg:w-72 bg-gradient-to-r from-[#070b19] via-[#070b19]/80 to-transparent" />
                    {/* Darken overlay so text remains perfectly legible */}
                    <div className="absolute inset-0 bg-[#070b19]/40 backdrop-blur-xs" />
                    {/* Top & Bottom seamless fades */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070b19] to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070b19] to-transparent" />
                </div>

                <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        {/* Left: Breadcrumbs + Title + Description + CTA (aligned identical to Welcome.jsx hero) */}
                        <div className="lg:w-[54%] xl:w-[50%] space-y-6">
                            {/* Breadcrumbs matching greeting badge styling & position */}
                            <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-slate-300">
                                <Link href="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                                <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                                <Link href="/#projects" className="hover:text-white transition-colors">
                                    Projects
                                </Link>
                                <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                                <span className="text-blue-400 font-medium truncate max-w-[200px] sm:max-w-none">
                                    {project.title}
                                </span>
                            </nav>

                            {/* Headings */}
                            <div className="space-y-1">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-tight">
                                    {project.title}
                                </h1>
                            </div>

                            {/* Subtitle */}
                            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                                {project.subtitle}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <a
                                    href={project.liveDemoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>View Live Demo</span>
                                </a>

                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <GithubIcon className="w-4 h-4" />
                                    <span>View on GitHub</span>
                                </a>
                            </div>
                        </div>

                        {/* Right: Big Index / Meta Counter */}
                        <div className="lg:text-right shrink-0 select-none z-10 flex flex-row lg:flex-col items-baseline lg:items-end justify-between border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0">
                            <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white/90 select-none">
                                / {project.index}
                            </span>
                            <div className="mt-2">
                                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {project.category}
                                </span>
                                <span className="block text-xs text-slate-400 mt-1.5 font-medium">
                                    {project.techHeader}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* 3. SHOWCASE GALLERY & PROJECT INFO SIDEBAR                 */}
            {/* ========================================================== */}
            <main className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 relative z-20 pb-20 space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Showcase (8 Cols): Main Frame + Interactive Thumbnails */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Main Featured Image Card */}
                        <div className="rounded-lg border overflow-hidden bg-slate-900 border-slate-800/80 shadow-xl relative group">
                            <div className="aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                                <img
                                    src={project.gallery[activeImageIdx]?.img || '/images/proj1.png'}
                                    alt={project.gallery[activeImageIdx]?.title || project.title}
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Carousel Strip */}
                        <div className="flex items-center gap-3 pt-1">
                            <button
                                type="button"
                                onClick={handlePrev}
                                aria-label="Previous image"
                                className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 shadow-xs transition-all hover:scale-105 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-4 gap-3 flex-1">
                                {project.gallery.map((item, idx) => {
                                    const isActive = idx === activeImageIdx;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setActiveImageIdx(idx)}
                                            className={`rounded-lg border overflow-hidden aspect-[16/10] relative transition-all cursor-pointer ${
                                                isActive
                                                    ? 'border-blue-600 ring-2 ring-blue-500/40 shadow-md scale-102'
                                                    : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                                            }`}
                                        >
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next image"
                                className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 shadow-xs transition-all hover:scale-105 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar (4 Cols): Project Info & Quote Card */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Project Information Card */}
                        <div className={`p-6 rounded-lg border shadow-xs space-y-5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'}`}>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                                Project Information
                            </h2>

                            <div className="space-y-3.5 text-xs">
                                {/* Type */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <Layers className="w-4 h-4 text-slate-400" />
                                        <span>Type</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {project.info.type}
                                    </span>
                                </div>

                                {/* Role */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span>Role</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {project.info.role}
                                    </span>
                                </div>

                                {/* Team */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>Team</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {project.info.team}
                                    </span>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>Duration</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {project.info.duration}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                        <span>Status</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>{project.info.status}</span>
                                    </span>
                                </div>

                                {/* Client */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <Shield className="w-4 h-4 text-slate-400" />
                                        <span>Client</span>
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                                        {project.info.client}
                                    </span>
                                </div>

                                {/* Repository */}
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <GithubIcon className="w-4 h-4 text-slate-400" />
                                        <span>Repository</span>
                                    </div>
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
                                    >
                                        <span>{project.githubDisplay}</span>
                                    </a>
                                </div>

                                {/* Live Demo */}
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                        <ExternalLink className="w-4 h-4 text-slate-400" />
                                        <span>Live Demo</span>
                                    </div>
                                    <a
                                        href={project.liveDemoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
                                    >
                                        <span>{project.liveDemoDisplay}</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quote Card */}
                        <div className={`p-6 rounded-lg border relative overflow-hidden space-y-3 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-200/80'}`}>
                            <Quote className="w-8 h-8 text-blue-400/30" />
                            <p className="text-xs sm:text-sm italic font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                                "{project.quote}"
                            </p>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 pt-1">
                                — {project.quoteAuthor}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================================== */}
                {/* 4. DETAILED 2-COLUMN SECTIONS (Overview, Stack, Features)   */}
                {/* ========================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 pt-4">
                    {/* Column 1: Overview, Key Features, Challenges */}
                    <div className="space-y-10">
                        {/* Project Overview */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Project Overview
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {project.overview}
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="space-y-3.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                Key Features
                            </h3>
                            <ul className="space-y-2.5">
                                {project.keyFeatures.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Challenges */}
                        <div className="space-y-3.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                Challenges
                            </h3>
                            <ul className="space-y-2.5">
                                {project.challenges.map((chal, cIdx) => (
                                    <li key={cIdx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 stroke-[2.5]" />
                                        </div>
                                        <span>{chal}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Column 2: Tech Stack, My Contribution, Results */}
                    <div className="space-y-10">
                        {/* Tech Stack */}
                        <div className="space-y-3.5">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Tech Stack
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {project.techStack.map((tech, tIdx) => (
                                    <div
                                        key={tIdx}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold shadow-2xs transition-all hover:scale-103 ${
                                            isDarkMode
                                                ? 'bg-slate-900 border-slate-800 text-slate-200'
                                                : 'bg-white border-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {getTechIconBadge(tech.name)}
                                        <span>{tech.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Contribution */}
                        <div className="space-y-3.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                My Contribution
                            </h3>
                            <ul className="space-y-2.5">
                                {project.contributions.map((con, conIdx) => (
                                    <li key={conIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-2 shrink-0" />
                                        <span>{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Results */}
                        <div className="space-y-3.5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                Results
                            </h3>
                            <ul className="space-y-2.5">
                                {project.results.map((res, rIdx) => (
                                    <li key={rIdx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span>{res}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ========================================================== */}
                {/* 5. RELATED PROJECTS SECTION                               */}
                {/* ========================================================== */}
                <div className="pt-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Related Projects
                        </h2>
                        <Link
                            href="/#projects"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
                        >
                            <span>View All Projects</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {related.map((relProj) => (
                            <Link
                                key={relProj.slug}
                                href={`/projects/${relProj.slug}`}
                                className={`rounded-lg border overflow-hidden p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group flex items-start gap-3.5 ${
                                    isDarkMode
                                        ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50'
                                        : 'bg-white border-slate-200/90 hover:border-blue-400'
                                }`}
                            >
                                <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 bg-slate-100 border border-slate-100 dark:border-slate-800">
                                    <img
                                        src={relProj.img}
                                        alt={relProj.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-start justify-between gap-1">
                                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                            {relProj.title}
                                        </h3>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {relProj.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {relProj.tags.map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* ========================================================== */}
            {/* 6. FOOTER (Matching user mockup)                           */}
            {/* ========================================================== */}
            <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 py-10">
                <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xs">
                                A
                            </div>
                            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Asafik
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Building a better tomorrow, line by line.
                        </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 text-center sm:text-right">
                        <div className="flex items-center justify-center sm:justify-end gap-6 text-xs text-slate-600 dark:text-slate-400">
                            <Link href="/" className="hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                            <Link href="/#projects" className="hover:text-blue-600 transition-colors">
                                Projects
                            </Link>
                            <Link href="/#experience" className="hover:text-blue-600 transition-colors">
                                Experience
                            </Link>
                            <Link href="/#about" className="hover:text-blue-600 transition-colors">
                                About
                            </Link>
                            <Link href="/#contact" className="hover:text-blue-600 transition-colors">
                                Contact
                            </Link>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            © 2026 Asafik. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    ArrowRight,
    ExternalLink,
    Folder,
    CheckCircle2,
    Clock,
    ChevronRight,
    Star,
    X,
    Send,
    Layers,
    Calendar,
    Sparkles,
    Filter,
} from 'lucide-react';
import LandingNavbar from '@/Components/LandingNavbar';

// Brand SVGs
const GithubIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const LinkedinIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const DEFAULT_COVER = '/images/default_project_cover.jpg';

export default function AllProjects({ projects = [], userProfile = null }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'featured'
    const [contactModal, setContactModal] = useState(false);
    const [sentToast, setSentToast] = useState(false);

    const profile = {
        name: userProfile?.fullName || 'Asafik Daroini',
        role: userProfile?.headline || userProfile?.role || 'Full Stack Developer',
        avatar: userProfile?.avatar || '/images/avatars/avatar_1789566043.png',
        location: userProfile?.location || 'Indonesia',
        socials: {
            github: userProfile?.socials?.github || 'https://github.com/asafik',
            linkedin: userProfile?.socials?.linkedin || 'https://linkedin.com/in/asafik',
            instagram: userProfile?.socials?.instagram || '',
            website: userProfile?.socials?.website || 'https://asafik.dev',
        },
    };

    // Extract dynamic categories from projects
    const availableCategories = useMemo(() => {
        const cats = new Set();
        projects.forEach((p) => {
            if (p.category) cats.add(p.category);
        });
        return ['All', 'Featured', ...Array.from(cats)];
    }, [projects]);

    // Filter and Sort projects
    const filteredProjects = useMemo(() => {
        let list = [...projects];

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter((p) => {
                const name = (p.name || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                const category = (p.category || '').toLowerCase();
                const tech = Array.isArray(p.tech_stack)
                    ? p.tech_stack.join(' ').toLowerCase()
                    : '';
                return (
                    name.includes(q) ||
                    desc.includes(q) ||
                    category.includes(q) ||
                    tech.includes(q)
                );
            });
        }

        // Category / Featured filter
        if (selectedCategory === 'Featured') {
            list = list.filter((p) => !!p.is_featured);
        } else if (selectedCategory !== 'All') {
            list = list.filter((p) => p.category === selectedCategory);
        }

        // Sort
        if (sortBy === 'name') {
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortBy === 'featured') {
            list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        } else {
            // 'recent' by default (start_date or created_at)
            list.sort((a, b) => {
                const dateA = new Date(a.start_date || a.created_at || 0);
                const dateB = new Date(b.start_date || b.created_at || 0);
                return dateB - dateA;
            });
        }

        return list;
    }, [projects, searchQuery, selectedCategory, sortBy]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        setContactModal(false);
        setSentToast(true);
        setTimeout(() => setSentToast(false), 3500);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            <Head title={`All Projects - ${profile.name}`} />

            {/* Success Toast */}
            {sentToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pesan Anda berhasil terkirim! Terima kasih telah menghubungi.</span>
                </div>
            )}

            {/* Top Reusable Landing Navbar */}
            <LandingNavbar
                activeSection="projects"
                onContactClick={() => setContactModal(true)}
            />

            {/* ========================================================== */}
            {/* HERO HEADER                                               */}
            {/* ========================================================== */}
            <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 bg-[#070b19] border-b border-slate-800 text-white overflow-hidden">
                {/* Ambient Radial Gradient Glow */}
                <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                {/* Seamless Background Image on the right */}
                <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[55%] pointer-events-none overflow-hidden select-none z-0">
                    <img
                        src="/images/hero.png"
                        alt="Developer Workstation"
                        className="w-full h-full object-cover object-[right_top] lg:object-[90%_top] opacity-60"
                    />
                    <div className="absolute inset-y-0 left-0 w-36 sm:w-56 lg:w-72 bg-gradient-to-r from-[#070b19] via-[#070b19]/80 to-transparent" />
                    <div className="absolute inset-0 bg-[#070b19]/40 backdrop-blur-xs" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070b19] to-transparent" />
                </div>

                <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-3xl space-y-5">
                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-slate-300">
                            <Link href="/" className="hover:text-white transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                            <Link href="/#projects" className="hover:text-white transition-colors">
                                Selected Works
                            </Link>
                            <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="text-blue-400 font-medium">
                                All Projects
                            </span>
                        </nav>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-indigo-500">All Projects</span>
                            </h1>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                                Kumpulan lengkap seluruh proyek dan aplikasi yang telah dibangun, mulai dari sistem manajemen internal, web portal, hingga aplikasi personal.
                            </p>
                        </div>

                        {/* Quick Stats Badges */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200">
                                <Layers className="w-3.5 h-3.5 text-blue-400" />
                                <span>Total <strong>{projects.length}</strong> Proyek</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span><strong>{projects.filter((p) => p.is_featured).length}</strong> Unggulan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================== */}
            {/* TOOLBAR & PROJECTS GRID                                   */}
            {/* ========================================================== */}
            <main className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama proyek, deskripsi, atau teknologi..."
                                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                                    title="Hapus pencarian"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2.5 self-end md:self-auto">
                            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Urutkan:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="recent">Terbaru (Recent)</option>
                                <option value="name">Nama (A - Z)</option>
                                <option value="featured">Unggulan (Featured)</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Kategori:</span>
                        </span>
                        {availableCategories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                    }`}
                                >
                                    {cat === 'All' ? 'Semua Proyek' : cat === 'Featured' ? '★ Unggulan' : cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Counter Bar */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
                    <p>
                        Menampilkan <strong className="text-slate-800">{filteredProjects.length}</strong> dari{' '}
                        <strong className="text-slate-800">{projects.length}</strong> proyek
                    </p>
                    {(searchQuery || selectedCategory !== 'All') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Projects Grid */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {filteredProjects.map((proj) => {
                            const coverImg =
                                proj.portfolio_cover ||
                                (Array.isArray(proj.images) && proj.images.length > 0 && proj.images[0]) ||
                                proj.cover_image_url ||
                                DEFAULT_COVER;

                            const projectLink = proj.slug
                                ? `/projects/${proj.slug}`
                                : proj.live_url || proj.github_repo_url || '/projects';

                            const techList = Array.isArray(proj.tech_stack) && proj.tech_stack.length > 0
                                ? proj.tech_stack
                                : ['Laravel', 'MySQL'];

                            return (
                                <Link
                                    key={proj.id}
                                    href={projectLink}
                                    className="rounded-xl border overflow-hidden transition-all duration-300 group flex flex-col justify-between h-full bg-white border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400/90 hover:-translate-y-1.5 cursor-pointer block text-left"
                                >
                                    <div className="flex-1 flex flex-col">
                                        {/* Thumbnail Preview */}
                                        <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100 shrink-0">
                                            <img
                                                src={coverImg}
                                                alt={proj.name}
                                                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                                                onError={(e) => {
                                                    e.currentTarget.src = DEFAULT_COVER;
                                                }}
                                            />

                                            {/* Badge */}
                                            {proj.is_featured ? (
                                                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border bg-amber-500 text-white border-amber-400 shadow-xs flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold border bg-white/90 backdrop-blur-xs text-slate-700 border-slate-200/80 shadow-xs">
                                                    {proj.category || (proj.ownership_type ? `${proj.ownership_type} Project` : 'Web Application')}
                                                </span>
                                            )}

                                            {/* Hover External Link Icon */}
                                            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 bg-white text-slate-700 border-slate-200 shadow-xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:rotate-12">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 flex-1 flex flex-col justify-start">
                                            <h3 className="font-bold text-sm sm:text-base transition-colors text-slate-900 group-hover:text-blue-600 line-clamp-1">
                                                {proj.name}
                                            </h3>
                                            {proj.description ? (
                                                <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 mt-1.5">
                                                    {proj.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Tech Stack Tags Footer */}
                                    <div className="px-4 pb-4 pt-1 flex flex-wrap items-center gap-1.5 border-t border-slate-100/80 mt-auto">
                                        {techList.slice(0, 3).map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/80"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {techList.length > 3 && (
                                            <span className="text-[10px] font-semibold text-slate-400">
                                                +{techList.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty Search State */
                    <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                            <Folder className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <div className="space-y-1 max-w-sm mx-auto">
                            <h3 className="text-base font-bold text-slate-900">Tidak ada proyek yang sesuai</h3>
                            <p className="text-xs text-slate-500">
                                Tidak ditemukan proyek dengan kata kunci atau filter yang Anda pilih. Coba gunakan kata kunci lain.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            Reset Filter Pencarian
                        </button>
                    </div>
                )}
            </main>

            {/* ========================================================== */}
            {/* FOOTER                                                     */}
            {/* ========================================================== */}
            <footer className="py-8 bg-white text-slate-600 border-t border-slate-200 mt-16">
                <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt={profile.name}
                                className="w-6 h-6 rounded-md object-contain"
                            />
                            <div>
                                <h3 className="font-extrabold text-sm text-slate-900">{profile.name}</h3>
                                <p className="text-[11px] text-slate-500">
                                    Building a better tomorrow, line by line.
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
                            <Link href="/" className="transition-colors hover:text-slate-900 font-medium">
                                Home
                            </Link>
                            <Link href="/all-projects" className="transition-colors text-blue-600 font-semibold">
                                All Projects
                            </Link>
                            <Link href="/#experience" className="transition-colors hover:text-slate-900 font-medium">
                                Experience
                            </Link>
                            <Link href="/#about" className="transition-colors hover:text-slate-900 font-medium">
                                About
                            </Link>
                            <Link href="/#contact" className="transition-colors hover:text-slate-900 font-medium">
                                Contact
                            </Link>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 text-slate-500">
                            {profile.socials.github && (
                                <a
                                    href={profile.socials.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={`GitHub @${profile.name}`}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                >
                                    <GithubIcon className="w-4 h-4" />
                                </a>
                            )}
                            {profile.socials.linkedin && (
                                <a
                                    href={profile.socials.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="LinkedIn"
                                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                >
                                    <LinkedinIcon className="w-4 h-4" />
                                </a>
                            )}
                            {profile.socials.instagram && (
                                <a
                                    href={profile.socials.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Instagram"
                                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-pink-600 transition-colors"
                                >
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                        <p>© 2026 {profile.name}. All rights reserved.</p>
                        <p>Designed for WorkTrack Portfolio Showcase</p>
                    </div>
                </div>
            </footer>

            {/* Contact Modal */}
            {contactModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="rounded-xl border shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 bg-white border-slate-200 text-slate-900">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                                <Send className="w-4 h-4 text-blue-600" />
                                <span>Kirim Pesan ke {profile.name}</span>
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

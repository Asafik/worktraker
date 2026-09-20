import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from '@/Components/Modal';
import {
    ExternalLink,
    Settings,
    Plus,
    GripVertical,
    User,
    Sparkles,
    Briefcase,
    Palette,
    CheckCircle2,
    X,
    ChevronRight,
    Edit2,
    MoreHorizontal,
    Monitor,
    Smartphone,
    Layers,
    Globe,
    Code2,
    LayoutDashboard,
    Building2,
    Calendar,
    MapPin,
    Mail,
    Star,
    Trash2,
    Eye,
    EyeOff,
    Check,
    Sun,
    Moon,
    Laptop,
    ArrowUp,
    ArrowDown,
    Save,
    Quote,
    Search,
    Image as ImageIcon,
} from 'lucide-react';

export default function PortfolioPage({ projects: initialProjects = [], userProfile = null }) {
    // Active navigation tab: Projects, About, Experience, Skills, Testimonials, Appearance
    const [activeTab, setActiveTab] = useState('Projects');
    const [isLiveNoticeOpen, setIsLiveNoticeOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [savedToast, setSavedToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('Perubahan berhasil disimpan!');

    const triggerSaveNotice = (msg = 'Perubahan berhasil disimpan!') => {
        setToastMessage(msg);
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 2500);
    };

    // ==========================================
    // 1. ABOUT STATE
    // ==========================================
    const [aboutData, setAboutData] = useState({
        name: userProfile?.fullName || 'Asafik Daroini',
        headline: userProfile?.headline || 'Full Stack Web Developer',
        bio: userProfile?.bio || 'I build modern web applications and turn ideas into reality. Focused on clean architecture, responsive UX, and scalable backend solutions.',
        location: userProfile?.location || 'Jawa Timur, Indonesia',
        showLocation: true,
        email: userProfile?.email || 'asafik.dev@gmail.com',
        showEmail: true,
        avatar: userProfile?.avatar || '/images/avatar1.png',
        stats: {
            projects: `${initialProjects?.length || 10}+`,
            experience: '2+',
            passion: '100%',
        },
        socials: userProfile?.socials || {
            github: 'https://github.com/asafik',
            linkedin: 'https://linkedin.com/in/asafik',
            twitter: 'https://x.com/asafik',
        },
    });

    const DEFAULT_PROJECT_IMAGE = '/images/default_project_cover.jpg';

    const formatProject = (p, idx) => {
        const defaultCover = DEFAULT_PROJECT_IMAGE;
        return {
            id: p.id,
            name: p.name || p.title || 'Untitled Project',
            title: p.name || p.title || 'Untitled Project',
            description: p.description || '',
            category: p.category || 'Web Application',
            tags: Array.isArray(p.tech_stack) && p.tech_stack.length > 0
                ? p.tech_stack
                : (Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : ['Laravel', 'MySQL']),
            tagColors: p.tagColors || [
                'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
                'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40',
                'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40',
            ],
            githubUrl: p.github_repo_url || p.githubUrl || '',
            liveUrl: p.live_url || p.liveUrl || '',
            published: typeof p.is_portfolio !== 'undefined' ? !!p.is_portfolio : false,
            is_portfolio: typeof p.is_portfolio !== 'undefined' ? !!p.is_portfolio : false,
            featured: typeof p.is_featured !== 'undefined' ? !!p.is_featured : false,
            is_featured: typeof p.is_featured !== 'undefined' ? !!p.is_featured : false,
            portfolio_order: p.portfolio_order ?? idx,
            portfolio_cover: p.portfolio_cover || null,
            cover_image_url: p.cover_image_url || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : defaultCover),
            images: Array.isArray(p.images) ? p.images : [],
            previewType: p.previewType || (p.category === 'Mobile' ? 'mobile' : (p.category === 'UI/UX' ? 'design' : 'dashboard')),
        };
    };

    const [projects, setProjects] = useState(() => {
        if (initialProjects && initialProjects.length > 0) {
            return initialProjects.map(formatProject);
        }
        return [
            {
                id: 1,
                title: 'Monitoring System',
                featured: true,
                description:
                    'Sistem monitoring dan pelaporan data secara real-time dengan dashboard interaktif.',
                tags: ['Laravel', 'MySQL', 'Tailwind CSS'],
                tagColors: [
                    'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40',
                    'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
                    'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40',
                ],
                githubUrl: 'https://github.com/asafik/monitoring-system',
                liveUrl: 'https://monitoring.example.com',
                published: true,
                previewType: 'dashboard',
            },
        ];
    });

    useEffect(() => {
        if (initialProjects && initialProjects.length > 0) {
            setProjects(initialProjects.map(formatProject));
        }
    }, [initialProjects]);

    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [editProjectItem, setEditProjectItem] = useState(null);
    const [projectSearchQuery, setProjectSearchQuery] = useState('');
    const [projectFilterTab, setProjectFilterTab] = useState('all'); // 'all', 'published', 'hidden'

    const togglePublishProject = (id) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    const nextVal = !p.published;
                    return { ...p, published: nextVal, is_portfolio: nextVal };
                }
                return p;
            })
        );

        router.post(
            `/portfolio/projects/${id}/toggle-publish`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => triggerSaveNotice('Status portofolio diperbarui!'),
            }
        );
    };

    const toggleFeaturedProject = (id) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    const nextVal = !p.featured;
                    return { ...p, featured: nextVal, is_featured: nextVal };
                }
                return p;
            })
        );

        router.post(
            `/portfolio/projects/${id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => triggerSaveNotice('Status unggulan (featured) diperbarui!'),
            }
        );
    };

    const moveProject = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= projects.length) return;
        const updated = [...projects];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setProjects(updated);

        const orderIds = updated.map((p) => p.id);
        router.post(
            '/portfolio/projects/update-order',
            { order: orderIds },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => triggerSaveNotice('Urutan proyek berhasil diperbarui!'),
            }
        );
    };

    // ==========================================
    // 3. EXPERIENCE STATE & MODALS
    // ==========================================
    const [experiences, setExperiences] = useState([
        {
            id: 1,
            role: 'Full Stack Web Developer',
            company: 'PT Solusi Teknologi Nusantara',
            period: '2024 - Sekarang',
            type: 'Full-time',
            location: 'Surabaya (Hybrid)',
            description:
                'Mengembangkan sistem manajemen workflow internal berbasis Laravel & React, mengoptimalkan query database MySQL, dan merancang REST API integrasi.',
            published: true,
        },
        {
            id: 2,
            role: 'Backend Developer Intern',
            company: 'Inovasi Digital Kreatif',
            period: '2023 - 2024',
            type: 'Internship',
            location: 'Remote',
            description:
                'Membangun modul absensi berbasis GPS, autentikasi multi-guard Laravel Sanctum, dan integrasi push notification Firebase.',
            published: true,
        },
        {
            id: 3,
            role: 'Freelance Web Developer',
            company: 'Self-Employed',
            period: '2022 - 2023',
            type: 'Freelance',
            location: 'Remote',
            description:
                'Merancang website profil perusahaan, landing page interaktif dengan Tailwind CSS, dan sistem e-commerce sederhana.',
            published: true,
        },
    ]);

    const [isAddExpOpen, setIsAddExpOpen] = useState(false);
    const [editExpItem, setEditExpItem] = useState(null);

    const togglePublishExp = (id) => {
        setExperiences(
            experiences.map((exp) =>
                exp.id === id ? { ...exp, published: !exp.published } : exp
            )
        );
    };

    const deleteExp = (id) => {
        setExperiences(experiences.filter((exp) => exp.id !== id));
    };

    // ==========================================
    // 4. SKILLS STATE & MODALS
    // ==========================================
    const [skills, setSkills] = useState([
        { id: 1, name: 'Laravel', category: 'Backend', level: 'Advanced', published: true },
        { id: 2, name: 'PHP', category: 'Backend', level: 'Advanced', published: true },
        { id: 3, name: 'React.js', category: 'Frontend', level: 'Intermediate', published: true },
        { id: 4, name: 'JavaScript', category: 'Frontend', level: 'Advanced', published: true },
        { id: 5, name: 'Tailwind CSS', category: 'Frontend', level: 'Advanced', published: true },
        { id: 6, name: 'MySQL', category: 'Database', level: 'Advanced', published: true },
        { id: 7, name: 'Git & GitHub', category: 'Tools', level: 'Intermediate', published: true },
        { id: 8, name: 'RESTful API', category: 'Backend', level: 'Advanced', published: true },
        { id: 9, name: 'Docker', category: 'DevOps', level: 'Basic', published: false },
        { id: 10, name: 'Postman', category: 'Tools', level: 'Intermediate', published: true },
    ]);

    const [skillFilter, setSkillFilter] = useState('All');
    const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

    const togglePublishSkill = (id) => {
        setSkills(
            skills.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
        );
    };

    const deleteSkill = (id) => {
        setSkills(skills.filter((s) => s.id !== id));
    };

    // ==========================================
    // 5. TESTIMONIALS STATE & MODALS
    // ==========================================
    const [isTestimonialsEnabled, setIsTestimonialsEnabled] = useState(true);
    const [testimonials, setTestimonials] = useState([
        {
            id: 1,
            author: 'Budi Santoso',
            role: 'Product Lead, PT Solusi Teknologi',
            company: 'PT Solusi Teknologi',
            comment:
                'Asafik sangat cepat beradaptasi dengan arsitektur Laravel kami. Penyelesaian modul monitoring berjalan tepat waktu dengan performa query yang sangat optimal.',
            rating: 5,
            published: true,
        },
        {
            id: 2,
            author: 'Dina Rahmawati',
            role: 'Project Manager',
            company: 'Inovasi Digital',
            comment:
                'Komunikasi sangat baik dan hasil koding rapi. Sangat teliti dalam mengimplementasikan integrasi API dan responsive layout.',
            rating: 5,
            published: true,
        },
    ]);

    const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);

    // ==========================================
    // 6. APPEARANCE STATE
    // ==========================================
    const [appearance, setAppearance] = useState({
        themeMode: 'dark', // light, dark, system
        accentColor: 'blue', // blue, emerald, purple, amber, rose
        heroLayout: 'split', // split, centered, compact
        projectCardLayout: 'cards', // cards, list, compact
        sections: {
            hero: true,
            about: true,
            featuredProjects: true,
            experience: true,
            skills: true,
            testimonials: false,
            contact: true,
        },
    });

    // Helper: Mockup thumbnail renderer for project items
    const renderPreviewMockup = (type) => {
        if (type === 'mobile') {
            return (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-[#122352] p-1.5 flex items-center justify-center gap-1">
                    <div className="w-5 h-11 bg-white dark:bg-[#0c183b] rounded-sm shadow-xs border border-blue-200 dark:border-blue-900/60 p-0.5 flex flex-col justify-between">
                        <div className="w-2.5 h-0.5 bg-blue-500 rounded-full mx-auto" />
                        <div className="space-y-0.5">
                            <div className="w-full h-1 bg-blue-100 dark:bg-blue-900/50 rounded-xs" />
                            <div className="w-2/3 h-1 bg-blue-200 dark:bg-blue-800/50 rounded-xs" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500/30 mx-auto" />
                    </div>
                    <div className="w-6 h-12 bg-blue-600 text-white rounded-sm shadow-sm p-0.5 flex flex-col justify-between">
                        <div className="w-3 h-0.5 bg-white/60 rounded-full mx-auto" />
                        <div className="space-y-0.5">
                            <div className="w-full h-1.5 bg-white/20 rounded-xs" />
                            <div className="w-4 h-1.5 bg-white/30 rounded-xs" />
                        </div>
                        <div className="w-2.5 h-0.5 bg-white/50 rounded-full mx-auto" />
                    </div>
                </div>
            );
        }

        if (type === 'api' || type === 'design') {
            return (
                <div className="w-full h-full bg-[#111827] dark:bg-[#060c1f] p-1.5 flex flex-col justify-between text-slate-400">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-rose-500" />
                            <div className="w-1 h-1 rounded-full bg-amber-500" />
                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        </div>
                        <div className="w-6 h-0.5 bg-slate-700 rounded-full" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-10 h-1 bg-blue-500/60 rounded-xs" />
                        <div className="w-14 h-1 bg-purple-500/40 rounded-xs" />
                        <div className="w-8 h-1 bg-emerald-500/40 rounded-xs" />
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-xs" />
                </div>
            );
        }

        // Default web / dashboard mockup
        return (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-[#122352] p-1.5 flex flex-col justify-between border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-1">
                    <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-slate-400" />
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                    </div>
                    <div className="w-8 h-1 bg-blue-500/40 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-1">
                    <div className="h-4 bg-blue-100 dark:bg-blue-950/60 rounded-xs border border-blue-200/50" />
                    <div className="h-4 bg-emerald-100 dark:bg-emerald-950/60 rounded-xs border border-emerald-200/50" />
                    <div className="h-4 bg-purple-100 dark:bg-purple-950/60 rounded-xs border border-purple-200/50" />
                </div>
                <div className="w-full h-3 bg-white dark:bg-[#0c183b] rounded-xs border border-slate-200/60 dark:border-slate-800" />
            </div>
        );
    };

    return (
        <>
            <Head title="Portfolio - WorkTrack" />

            {/* Notification Toast */}
            {savedToast && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/30 animate-in fade-in slide-in-from-top-3 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="space-y-6">
                {/* 1. Header & Top Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Portfolio
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Pusat pengaturan website portfolio publikmu. Pilih project, atur profil, pengalaman, skills, dan tampilan.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <button
                            onClick={() => window.open('http://127.0.0.1:8000', '_blank')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-200 rounded-md text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-500" />
                            <span>View Public Site</span>
                        </button>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Portfolio Settings</span>
                        </button>
                    </div>
                </div>

                {/* 2. Top Navigation Tabs */}
                <div className="flex items-center gap-6 border-b border-slate-200/90 dark:border-[#1e346e] text-xs sm:text-sm font-semibold overflow-x-auto">
                    {[
                        'Projects',
                        'About',
                        'Experience',
                        'Skills',
                        'Testimonials',
                        'Appearance',
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
                                activeTab === tab
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 3. Main 2-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (8 cols): Tab Content Switcher */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* ========================================================== */}
                        {/* TAB 1: PROJECTS */}
                        {/* ========================================================== */}
                        {activeTab === 'Projects' && (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Daftar Proyek Portofolio
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Kelola proyek dari WorkTrack yang tampil di portofolio publik. Foto sampul otomatis mengambil screenshot pertama proyek.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsAddProjectOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-xs hover:shadow-blue-600/40 transition-all self-start sm:self-auto cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 stroke-[2.5]" />
                                        <span>Pilih dari Proyek WorkTrack</span>
                                    </button>
                                </div>

                                {/* Filter Pills */}
                                <div className="flex items-center gap-2 pb-1">
                                    <button
                                        onClick={() => setProjectFilterTab('all')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                            projectFilterTab === 'all'
                                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        Semua ({projects.length})
                                    </button>
                                    <button
                                        onClick={() => setProjectFilterTab('published')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                            projectFilterTab === 'published'
                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        Ditampilkan ({projects.filter((p) => p.published).length})
                                    </button>
                                    <button
                                        onClick={() => setProjectFilterTab('hidden')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                            projectFilterTab === 'hidden'
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        Disembunyikan ({projects.filter((p) => !p.published).length})
                                    </button>
                                </div>

                                {/* Project List Items */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {projects
                                        .filter((p) => {
                                            if (projectFilterTab === 'published') return p.published;
                                            if (projectFilterTab === 'hidden') return !p.published;
                                            return true;
                                        })
                                        .map((project, idx) => (
                                            <div
                                                key={project.id}
                                                className="py-4 flex items-center justify-between gap-4 group transition-colors"
                                            >
                                                {/* Left group */}
                                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                                    <span className="w-5 text-center font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                                        {idx + 1}
                                                    </span>

                                                    {/* Reorder Buttons */}
                                                    <div className="flex flex-col gap-0.5">
                                                        <button
                                                            onClick={() => moveProject(idx, -1)}
                                                            disabled={idx === 0}
                                                            className="text-slate-400 hover:text-blue-500 disabled:opacity-20 transition-colors p-0.5 cursor-pointer"
                                                            title="Pindah ke atas"
                                                        >
                                                            <ArrowUp className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => moveProject(idx, 1)}
                                                            disabled={idx === projects.length - 1}
                                                            className="text-slate-400 hover:text-blue-500 disabled:opacity-20 transition-colors p-0.5 cursor-pointer"
                                                            title="Pindah ke bawah"
                                                        >
                                                            <ArrowDown className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Thumbnail: First project screenshot or default project photo */}
                                                    <div className="w-20 sm:w-24 h-14 sm:h-16 rounded-md overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative bg-slate-100 dark:bg-slate-900">
                                                        <img
                                                            src={project.cover_image_url || DEFAULT_PROJECT_IMAGE}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Project Info & Tags */}
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                                                {project.title}
                                                            </h3>
                                                            {/* Toggle featured star */}
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleFeaturedProject(project.id)}
                                                                title={project.featured ? "Hapus dari Unggulan (Featured)" : "Jadikan Proyek Unggulan (Featured)"}
                                                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                                                    project.featured 
                                                                        ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/40' 
                                                                        : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
                                                                }`}
                                                            >
                                                                <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-500' : ''}`} />
                                                            </button>
                                                            {project.featured && (
                                                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                                                                    Featured
                                                                </span>
                                                            )}
                                                            {project.category && (
                                                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                                    {project.category}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                            {project.description || 'Tidak ada deskripsi.'}
                                                        </p>

                                                        {/* Tags */}
                                                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                            {project.tags.map((tag, tIdx) => (
                                                                <span
                                                                    key={tIdx}
                                                                    className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                                                                        project.tagColors?.[tIdx] ||
                                                                        'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40'
                                                                    }`}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right group */}
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => togglePublishProject(project.id)}
                                                            className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                                                                project.published
                                                                    ? 'bg-[#2563eb]'
                                                                    : 'bg-slate-300 dark:bg-slate-700'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                                                                    project.published
                                                                        ? 'translate-x-4.5'
                                                                        : 'translate-x-0.5'
                                                                }`}
                                                            />
                                                        </button>
                                                        <span
                                                            className={`text-xs font-semibold w-16 ${
                                                                project.published
                                                                    ? 'text-slate-700 dark:text-slate-300'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {project.published ? 'Published' : 'Hidden'}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => setEditProjectItem(project)}
                                                        className="px-3 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* ========================================================== */}
                        {/* TAB 2: ABOUT */}
                        {/* ========================================================== */}
                        {activeTab === 'About' && (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Profil & Bio Pengembang
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Informasi utama yang tampil pada hero section website portfolio publik Anda.
                                        </p>
                                    </div>
                                    <button
                                        onClick={triggerSaveNotice}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Simpan Perubahan</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Nama Lengkap / Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={aboutData.name}
                                            onChange={(e) =>
                                                setAboutData({ ...aboutData, name: e.target.value })
                                            }
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                            placeholder="Contoh: Asafik Daroini"
                                        />
                                    </div>

                                    {/* Headline / Role */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Headline / Spesialisasi
                                        </label>
                                        <input
                                            type="text"
                                            value={aboutData.headline}
                                            onChange={(e) =>
                                                setAboutData({
                                                    ...aboutData,
                                                    headline: e.target.value,
                                                })
                                            }
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                            placeholder="Contoh: Full Stack Web Developer"
                                        />
                                    </div>

                                    {/* Lokasi */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Lokasi
                                            </label>
                                            <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={aboutData.showLocation}
                                                    onChange={(e) =>
                                                        setAboutData({
                                                            ...aboutData,
                                                            showLocation: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded text-blue-600 focus:ring-0"
                                                />
                                                <span>Tampilkan</span>
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                            <input
                                                type="text"
                                                value={aboutData.location}
                                                onChange={(e) =>
                                                    setAboutData({
                                                        ...aboutData,
                                                        location: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                                placeholder="Jawa Timur, Indonesia"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Publik */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Email Publik Kontak
                                            </label>
                                            <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={aboutData.showEmail}
                                                    onChange={(e) =>
                                                        setAboutData({
                                                            ...aboutData,
                                                            showEmail: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded text-blue-600 focus:ring-0"
                                                />
                                                <span>Tampilkan</span>
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                            <input
                                                type="email"
                                                value={aboutData.email}
                                                onChange={(e) =>
                                                    setAboutData({
                                                        ...aboutData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Deskripsi Singkat / Bio */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Deskripsi Singkat (Bio Hero)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={aboutData.bio}
                                            onChange={(e) =>
                                                setAboutData({ ...aboutData, bio: e.target.value })
                                            }
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                                            placeholder="Tuliskan perkenalan singkat yang menarik bagi klien/rekruiter..."
                                        />
                                    </div>
                                </div>

                                {/* Mini Hero Stats Settings */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                        Statistik Mini Card
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                Projects Done
                                            </label>
                                            <input
                                                type="text"
                                                value={aboutData.stats.projects}
                                                onChange={(e) =>
                                                    setAboutData({
                                                        ...aboutData,
                                                        stats: {
                                                            ...aboutData.stats,
                                                            projects: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                Years Exp.
                                            </label>
                                            <input
                                                type="text"
                                                value={aboutData.stats.experience}
                                                onChange={(e) =>
                                                    setAboutData({
                                                        ...aboutData,
                                                        stats: {
                                                            ...aboutData.stats,
                                                            experience: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                Passion
                                            </label>
                                            <input
                                                type="text"
                                                value={aboutData.stats.passion}
                                                onChange={(e) =>
                                                    setAboutData({
                                                        ...aboutData,
                                                        stats: {
                                                            ...aboutData.stats,
                                                            passion: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ========================================================== */}
                        {/* TAB 3: EXPERIENCE */}
                        {/* ========================================================== */}
                        {activeTab === 'Experience' && (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Riwayat Pengalaman Kerja
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Daftar posisi profesional, perusahaan/instansi, periode, dan peran Anda.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsAddExpOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-xs hover:shadow-blue-600/40 transition-all self-start sm:self-auto"
                                    >
                                        <Plus className="w-4 h-4 stroke-[2.5]" />
                                        <span>Add Experience</span>
                                    </button>
                                </div>

                                <div className="space-y-3.5">
                                    {experiences.map((exp) => (
                                        <div
                                            key={exp.id}
                                            className="p-4 rounded-lg border border-slate-200/70 dark:border-[#1b2f66] bg-slate-50/50 dark:bg-[#0c183b]/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors"
                                        >
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {exp.role}
                                                    </h3>
                                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                                                        {exp.type}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                                        {exp.company}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        {exp.period}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{exp.location}</span>
                                                </div>

                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                                                    {exp.description}
                                                </p>
                                            </div>

                                            {/* Action group */}
                                            <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                                                <button
                                                    onClick={() => togglePublishExp(exp.id)}
                                                    className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                                                        exp.published
                                                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                                                    }`}
                                                >
                                                    {exp.published ? 'Published' : 'Hidden'}
                                                </button>

                                                <button
                                                    onClick={() => deleteExp(exp.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ========================================================== */}
                        {/* TAB 4: SKILLS */}
                        {/* ========================================================== */}
                        {activeTab === 'Skills' && (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Keahlian & Teknologi (Skills)
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Teknologi yang Anda kuasai untuk ditampilkan pada portfolio publik.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setIsAddSkillOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-xs hover:shadow-blue-600/40 transition-all self-start sm:self-auto"
                                    >
                                        <Plus className="w-4 h-4 stroke-[2.5]" />
                                        <span>Add Skill</span>
                                    </button>
                                </div>

                                {/* Category Filters */}
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Backend', 'Frontend', 'Database', 'Tools', 'DevOps'].map(
                                        (cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSkillFilter(cat)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                                                    skillFilter === cat
                                                        ? 'bg-[#2563eb] text-white'
                                                        : 'bg-slate-100 dark:bg-[#122352] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* Skill Items Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {skills
                                        .filter(
                                            (s) => skillFilter === 'All' || s.category === skillFilter
                                        )
                                        .map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="p-3 rounded-lg border border-slate-200/70 dark:border-[#1b2f66] bg-slate-50/50 dark:bg-[#0c183b]/60 flex items-center justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-8 h-8 rounded-md bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-400 shrink-0">
                                                        {skill.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                                            {skill.name}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                            <span>{skill.category}</span>
                                                            <span>•</span>
                                                            <span className="text-blue-500 font-medium">
                                                                {skill.level}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        onClick={() => togglePublishSkill(skill.id)}
                                                        className={`p-1.5 rounded text-xs transition-colors ${
                                                            skill.published
                                                                ? 'text-blue-600 dark:text-blue-400'
                                                                : 'text-slate-300 dark:text-slate-600'
                                                        }`}
                                                        title={
                                                            skill.published
                                                                ? 'Ditampilkan di portfolio'
                                                                : 'Disembunyikan'
                                                        }
                                                    >
                                                        {skill.published ? (
                                                            <Eye className="w-4 h-4" />
                                                        ) : (
                                                            <EyeOff className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSkill(skill.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* ========================================================== */}
                        {/* TAB 5: TESTIMONIALS */}
                        {/* ========================================================== */}
                        {activeTab === 'Testimonials' && (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Testimonials (Opsional)
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Ulasan dari klien, atasan, atau rekan kerja untuk meningkatkan kredibilitas portfolio.
                                        </p>
                                    </div>

                                    {/* Enable / Disable Section Toggle */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                            Aktifkan Section:
                                        </span>
                                        <button
                                            onClick={() =>
                                                setIsTestimonialsEnabled(!isTestimonialsEnabled)
                                            }
                                            className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                                                isTestimonialsEnabled
                                                    ? 'bg-[#2563eb]'
                                                    : 'bg-slate-300 dark:bg-slate-700'
                                            }`}
                                        >
                                            <span
                                                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                                                    isTestimonialsEnabled
                                                        ? 'translate-x-4.5'
                                                        : 'translate-x-0.5'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {!isTestimonialsEnabled ? (
                                    <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-[#0c183b]/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                                        <Quote className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
                                        <div className="max-w-md mx-auto px-4">
                                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                                Section Testimonials Dinonaktifkan
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Section ini tidak akan ditampilkan pada website publik. Anda dapat mengaktifkannya kapan saja saat memiliki ulasan dari klien atau rekan kerja.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => setIsAddTestimonialOpen(true)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs font-semibold shadow-xs"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Tambah Testimoni</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {testimonials.map((t) => (
                                                <div
                                                    key={t.id}
                                                    className="p-4 rounded-lg border border-slate-200/70 dark:border-[#1b2f66] bg-slate-50/50 dark:bg-[#0c183b]/60 flex flex-col justify-between space-y-3"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1 text-amber-400">
                                                            {[...Array(t.rating)].map((_, r) => (
                                                                <Star
                                                                    key={r}
                                                                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                                            "{t.comment}"
                                                        </p>
                                                    </div>

                                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                                        <div>
                                                            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                                                                {t.author}
                                                            </h5>
                                                            <p className="text-[10px] text-slate-400">
                                                                {t.role}
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                                                            Published
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ========================================================== */}
                        {/* TAB 6: APPEARANCE */}
                        {/* ========================================================== */}
                        {activeTab === 'Appearance' && (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-6">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Pengaturan Tampilan Portfolio Publik
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Kustomisasi tema warna, tata letak hero section, dan susunan kartu proyek.
                                        </p>
                                    </div>
                                    <button
                                        onClick={triggerSaveNotice}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-all"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Terapkan</span>
                                    </button>
                                </div>

                                {/* 1. Accent Color */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Warna Aksen Utama (Accent Color)
                                    </label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {[
                                            { name: 'Royal Blue', key: 'blue', color: 'bg-blue-600' },
                                            { name: 'Emerald', key: 'emerald', color: 'bg-emerald-600' },
                                            { name: 'Electric Purple', key: 'purple', color: 'bg-purple-600' },
                                            { name: 'Amber Gold', key: 'amber', color: 'bg-amber-600' },
                                            { name: 'Rose', key: 'rose', color: 'bg-rose-600' },
                                        ].map((c) => (
                                            <button
                                                key={c.key}
                                                onClick={() =>
                                                    setAppearance({ ...appearance, accentColor: c.key })
                                                }
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                                                    appearance.accentColor === c.key
                                                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300'
                                                        : 'border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                <span className={`w-3.5 h-3.5 rounded-full ${c.color}`} />
                                                <span>{c.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Hero Layout */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Tata Letak Hero (Intro Layout)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            {
                                                key: 'split',
                                                title: 'Split Hero (Rekomendasi)',
                                                desc: 'Teks di kiri, foto di kanan dengan kartu statistik',
                                            },
                                            {
                                                key: 'centered',
                                                title: 'Centered Focus',
                                                desc: 'Foto avatar di tengah dengan teks pengenalan luas',
                                            },
                                            {
                                                key: 'compact',
                                                title: 'Compact Minimal',
                                                desc: 'Format ringkas hemat ruang langsung ke project',
                                            },
                                        ].map((ly) => (
                                            <div
                                                key={ly.key}
                                                onClick={() =>
                                                    setAppearance({ ...appearance, heroLayout: ly.key })
                                                }
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                    appearance.heroLayout === ly.key
                                                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {ly.title}
                                                    </h4>
                                                    {appearance.heroLayout === ly.key && (
                                                        <Check className="w-3.5 h-3.5 text-blue-600" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                    {ly.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Sections Visibility */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                        Visibilitas Section di Halaman Publik
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {[
                                            { key: 'hero', label: 'Hero / Bio' },
                                            { key: 'featuredProjects', label: 'Featured Projects' },
                                            { key: 'experience', label: 'Work Experience' },
                                            { key: 'skills', label: 'Tech Skills' },
                                            { key: 'testimonials', label: 'Testimonials' },
                                            { key: 'contact', label: 'Contact Section' },
                                        ].map((sec) => (
                                            <label
                                                key={sec.key}
                                                className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 p-2 rounded-md bg-slate-50 dark:bg-[#0c183b]/60 border border-slate-200/60 dark:border-[#1b2f66] cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={appearance.sections[sec.key]}
                                                    onChange={(e) =>
                                                        setAppearance({
                                                            ...appearance,
                                                            sections: {
                                                                ...appearance.sections,
                                                                [sec.key]: e.target.checked,
                                                            },
                                                        })
                                                    }
                                                    className="rounded text-blue-600 focus:ring-0"
                                                />
                                                <span>{sec.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (4 cols): Live Portfolio Preview + Quick Actions + Live Callout */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* 1. Portfolio Preview Card */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Portfolio Preview
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Lihat bagaimana halaman portfolio kamu di mata pengunjung.
                                </p>
                            </div>

                            {/* Mini Hero Card with dynamic Asafik Daroini profile */}
                            <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/70 dark:from-[#09153a] dark:to-[#0e1d47] rounded-lg border border-slate-200/70 dark:border-slate-800 p-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    {/* Bio & Intro */}
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-xs text-slate-400 font-medium">Hi, I'm</p>
                                        <h4 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                            {aboutData.name}
                                        </h4>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                            {aboutData.headline}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1 line-clamp-3">
                                            {aboutData.bio}
                                        </p>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-1.5 pt-2">
                                            <button className="px-2.5 py-1 bg-[#2563eb] text-white text-[11px] font-semibold rounded-md shadow-xs">
                                                View Projects
                                            </button>
                                            <button className="px-2.5 py-1 bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-200 text-[11px] font-semibold rounded-md">
                                                Contact Me
                                            </button>
                                        </div>
                                    </div>

                                    {/* Profile Avatar Image */}
                                    <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-sm">
                                        <img
                                            src={aboutData.avatar}
                                            alt={aboutData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-3 text-center">
                                    <div>
                                        <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                                            {aboutData.stats.projects}
                                        </h5>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                            Projects
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                                            {aboutData.stats.experience}
                                        </h5>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                            Years Experience
                                        </p>
                                    </div>
                                    <div>
                                        <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                                            {aboutData.stats.passion}
                                        </h5>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                            Passion
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Published Projects Preview */}
                            <div className="pt-2 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        Proyek Portofolio ({projects.filter((p) => p.published).length})
                                    </span>
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                                    >
                                        <span>Lihat Web</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {projects
                                        .filter((p) => p.published)
                                        .slice(0, 4)
                                        .map((p) => (
                                            <div
                                                key={p.id}
                                                className="rounded-md border border-slate-200 dark:border-slate-800 p-1.5 bg-slate-50/70 dark:bg-[#0c183b] space-y-1"
                                            >
                                                <div className="w-full h-14 rounded overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                                                    <img
                                                        src={p.cover_image_url || DEFAULT_PROJECT_IMAGE}
                                                        alt={p.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                                    {p.title}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Quick Actions Card (switches tabs immediately) */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800/80">
                                Quick Actions
                            </h3>

                            <div className="space-y-1">
                                {[
                                    {
                                        tab: 'About',
                                        icon: User,
                                        title: 'Edit About Section',
                                        subtitle: 'Update your bio, photo, and introduction',
                                    },
                                    {
                                        tab: 'Skills',
                                        icon: Sparkles,
                                        title: 'Manage Skills',
                                        subtitle: 'Add or edit your skills',
                                    },
                                    {
                                        tab: 'Experience',
                                        icon: Briefcase,
                                        title: 'Update Experience',
                                        subtitle: 'Manage your work experience',
                                    },
                                    {
                                        tab: 'Appearance',
                                        icon: Palette,
                                        title: 'Change Appearance',
                                        subtitle: 'Customize theme, colors, and layout',
                                    },
                                ].map((act, i) => {
                                    const ActIcon = act.icon;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setActiveTab(act.tab)}
                                            className={`p-2.5 -mx-1 rounded-md flex items-center justify-between cursor-pointer transition-colors group ${
                                                activeTab === act.tab
                                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                                                    : 'hover:bg-slate-50 dark:hover:bg-[#122352]/40'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                    <ActIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {act.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {act.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Live Status Callout Notice */}
                        {isLiveNoticeOpen && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg p-4 flex items-start gap-3 shadow-xs">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                                        Your portfolio is live!
                                    </h4>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                                        Keep your content updated to showcase your latest work.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsLiveNoticeOpen(false)}
                                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 p-0.5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* MODAL 1: PILIH PROYEK DARI WORKTRACK */}
            {/* ================================================================ */}
            <Modal
                isOpen={isAddProjectOpen}
                onClose={() => setIsAddProjectOpen(false)}
                title="Pilih Proyek dari WorkTrack"
                description="Centang proyek yang ingin ditampilkan di portofolio publik. Foto sampul otomatis mengambil screenshot pertama dari proyek."
                icon={Sparkles}
                maxWidth="2xl"
                footer={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                        <Link
                            href="/projects/create"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Buat Proyek Baru di WorkTrack</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsAddProjectOpen(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                            Selesai
                        </button>
                    </div>
                }
            >
                {/* Search Bar */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari proyek berdasarkan nama, kategori, atau tech stack..."
                            value={projectSearchQuery}
                            onChange={(e) => setProjectSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                    </div>
                </div>

                {/* Projects List with Checkboxes & Toggles */}
                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                    {projects
                        .filter((p) => {
                            if (!projectSearchQuery) return true;
                            const q = projectSearchQuery.toLowerCase();
                            return (
                                p.title.toLowerCase().includes(q) ||
                                (p.category && p.category.toLowerCase().includes(q)) ||
                                (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
                            );
                        })
                        .map((p) => (
                            <div
                                key={p.id}
                                className={`pt-3 first:pt-0 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg p-2.5 transition-colors ${
                                    p.published
                                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/80 dark:border-blue-900/30'
                                        : 'hover:bg-slate-50 dark:hover:bg-[#10204d]'
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-12 rounded-md overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800 shadow-2xs relative bg-slate-100 dark:bg-slate-900">
                                        <img
                                            src={p.cover_image_url || DEFAULT_PROJECT_IMAGE}
                                            alt={p.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                                            }}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                                {p.title}
                                            </h4>
                                            {p.featured && (
                                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
                                                    Featured
                                                </span>
                                            )}
                                            {p.category && (
                                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                    {p.category}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                            {p.description || 'Tidak ada deskripsi.'}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                            {p.tags.slice(0, 3).map((t, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons: Featured + Publish Toggle */}
                                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                                    {/* Featured Star */}
                                    <button
                                        type="button"
                                        onClick={() => toggleFeaturedProject(p.id)}
                                        title={p.featured ? 'Hapus dari Featured' : 'Jadikan Featured'}
                                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                            p.featured
                                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                                                : 'text-slate-300 dark:text-slate-600 hover:text-amber-500'
                                        }`}
                                    >
                                        <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : ''}`} />
                                    </button>

                                    {/* Publish Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => togglePublishProject(p.id)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer flex items-center gap-1.5 ${
                                            p.published
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                : 'bg-white dark:bg-[#122352] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-[#243e80] hover:bg-slate-50 dark:hover:bg-[#192f6b]'
                                        }`}
                                    >
                                        {p.published ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Ditampilkan</span>
                                            </>
                                        ) : (
                                            <span>Tampilkan</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                    {projects.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-xs">
                            Belum ada proyek yang tercatat di WorkTrack.
                        </div>
                    )}
                </div>
            </Modal>

            {/* ================================================================ */}
            {/* MODAL 2: EDIT PROJECT */}
            {/* ================================================================ */}
            <Modal
                isOpen={!!editProjectItem}
                onClose={() => setEditProjectItem(null)}
                title="Edit Proyek Portofolio"
                description="Sesuaikan judul publik, deskripsi, tautan demo, atau unggah foto sampul khusus."
                icon={Edit2}
                maxWidth="lg"
            >
                {editProjectItem && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target;
                            const formData = new FormData();
                            formData.append('name', form.title.value);
                            formData.append('description', form.description.value);
                            formData.append('github_repo_url', form.githubUrl.value);
                            formData.append('live_url', form.liveUrl.value);
                            
                            if (form.cover_image && form.cover_image.files && form.cover_image.files[0]) {
                                formData.append('cover_image', form.cover_image.files[0]);
                            }

                            router.post(`/portfolio/projects/${editProjectItem.id}/update`, formData, {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    setEditProjectItem(null);
                                    triggerSaveNotice('Proyek portofolio berhasil disimpan!');
                                },
                            });
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Judul Proyek
                            </label>
                            <input
                                name="title"
                                defaultValue={editProjectItem.title}
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Deskripsi Publik
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={editProjectItem.description}
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Foto Sampul (Cover Thumbnail)
                            </label>
                            <div className="space-y-2">
                                {editProjectItem.cover_image_url && (
                                    <div className="w-full h-28 rounded-lg overflow-hidden border border-slate-200 dark:border-[#243e80] bg-slate-100 dark:bg-slate-900 relative">
                                        <img
                                            src={editProjectItem.cover_image_url}
                                            alt="Preview Cover"
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute bottom-1.5 right-1.5 text-[9px] bg-slate-900/80 text-white px-2 py-0.5 rounded-md font-medium">
                                            Foto Sampul Aktif
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="cover_image"
                                    accept="image/*"
                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-400 cursor-pointer"
                                />
                                <p className="text-[10px] text-slate-400">
                                    Kosongkan jika ingin otomatis menggunakan foto pertama dari proyek.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    GitHub URL
                                </label>
                                <input
                                    name="githubUrl"
                                    defaultValue={editProjectItem.githubUrl || ''}
                                    placeholder="https://github.com/..."
                                    className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Live Demo URL
                                </label>
                                <input
                                    name="liveUrl"
                                    defaultValue={editProjectItem.liveUrl || ''}
                                    placeholder="https://..."
                                    className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1b2b5a]">
                            <button
                                type="button"
                                onClick={() => setEditProjectItem(null)}
                                className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-lg text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ================================================================ */}
            {/* MODAL 3: ADD EXPERIENCE */}
            {/* ================================================================ */}
            <Modal
                isOpen={isAddExpOpen}
                onClose={() => setIsAddExpOpen(false)}
                title="Tambah Pengalaman Kerja"
                description="Tambahkan riwayat karir dan tanggung jawab profesional Anda."
                icon={Briefcase}
                maxWidth="lg"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        setExperiences([
                            ...experiences,
                            {
                                id: Date.now(),
                                role: form.role.value,
                                company: form.company.value,
                                period: form.period.value,
                                type: form.type.value,
                                location: form.location.value,
                                description: form.description.value,
                                published: true,
                            },
                        ]);
                        setIsAddExpOpen(false);
                    }}
                    className="space-y-3.5"
                >
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Posisi / Role
                        </label>
                        <input
                            name="role"
                            type="text"
                            placeholder="Contoh: Senior Backend Engineer"
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Perusahaan / Instansi
                            </label>
                            <input
                                name="company"
                                type="text"
                                placeholder="Contoh: PT Digital Karya"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Tipe Pekerjaan
                            </label>
                            <select
                                name="type"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Periode
                            </label>
                            <input
                                name="period"
                                type="text"
                                placeholder="2023 - Sekarang"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Lokasi
                            </label>
                            <input
                                name="location"
                                type="text"
                                placeholder="Surabaya (Hybrid)"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Deskripsi Tanggung Jawab
                        </label>
                        <textarea
                            name="description"
                            rows={2}
                            placeholder="Jelaskan peran teknis dan pencapaian Anda..."
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setIsAddExpOpen(false)}
                            className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-lg text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                            Tambahkan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ================================================================ */}
            {/* MODAL 4: ADD SKILL */}
            {/* ================================================================ */}
            <Modal
                isOpen={isAddSkillOpen}
                onClose={() => setIsAddSkillOpen(false)}
                title="Tambah Keahlian (Skill)"
                description="Tambahkan keahlian teknis atau tools ke dalam portofolio Anda."
                icon={Code2}
                maxWidth="md"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        setSkills([
                            ...skills,
                            {
                                id: Date.now(),
                                name: form.name.value,
                                category: form.category.value,
                                level: form.level.value,
                                published: true,
                            },
                        ]);
                        setIsAddSkillOpen(false);
                    }}
                    className="space-y-3.5"
                >
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nama Teknologi / Skill
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Contoh: Redis, Next.js, PostgreSQL"
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Kategori
                            </label>
                            <select
                                name="category"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            >
                                <option value="Backend">Backend</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Database">Database</option>
                                <option value="Tools">Tools</option>
                                <option value="DevOps">DevOps</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Level Kemahiran
                            </label>
                            <select
                                name="level"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            >
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setIsAddSkillOpen(false)}
                            className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-lg text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                            Tambahkan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ================================================================ */}
            {/* MODAL 5: ADD TESTIMONIAL */}
            {/* ================================================================ */}
            <Modal
                isOpen={isAddTestimonialOpen}
                onClose={() => setIsAddTestimonialOpen(false)}
                title="Tambah Testimoni Klien"
                description="Bagikan ulasan positif dan testimoni dari rekan kerja atau klien Anda."
                icon={Quote}
                maxWidth="md"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        setTestimonials([
                            ...testimonials,
                            {
                                id: Date.now(),
                                author: form.author.value,
                                role: form.role.value,
                                company: form.company.value,
                                comment: form.comment.value,
                                rating: parseInt(form.rating.value) || 5,
                                published: true,
                            },
                        ]);
                        setIsAddTestimonialOpen(false);
                    }}
                    className="space-y-3.5"
                >
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Nama Klien / Rekan
                        </label>
                        <input
                            name="author"
                            type="text"
                            placeholder="Contoh: Ahmad Fauzi"
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Jabatan / Role
                            </label>
                            <input
                                name="role"
                                type="text"
                                placeholder="CTO / Tech Lead"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Perusahaan
                            </label>
                            <input
                                name="company"
                                type="text"
                                placeholder="Nama Perusahaan"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Rating Bintang
                        </label>
                        <select
                            name="rating"
                            defaultValue="5"
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        >
                            <option value="5">5 Bintang (Sempurna)</option>
                            <option value="4">4 Bintang (Sangat Bagus)</option>
                            <option value="3">3 Bintang (Cukup)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Isi Testimoni / Ulasan
                        </label>
                        <textarea
                            name="comment"
                            rows={3}
                            placeholder="Tulis ulasan positif atau feedback dari klien..."
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setIsAddTestimonialOpen(false)}
                            className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-lg text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                            Simpan Testimoni
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ================================================================ */}
            {/* MODAL 6: PORTFOLIO SETTINGS */}
            {/* ================================================================ */}
            <Modal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="Pengaturan Portofolio Publik"
                description="Kelola URL kustom, domain, dan visibilitas tautan portofolio publik Anda."
                icon={Settings}
                maxWidth="md"
                footer={
                    <button
                        onClick={() => {
                            setIsSettingsOpen(false);
                            triggerSaveNotice();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        Selesai
                    </button>
                }
            >
                <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Domain / Slug Publik
                        </label>
                        <div className="flex items-center">
                            <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-slate-500">
                                worktrack.me/
                            </span>
                            <input
                                type="text"
                                defaultValue="asafik"
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-r-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Visibilitas
                        </label>
                        <select className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500">
                            <option value="public">Publik (Bisa dilihat siapa saja)</option>
                            <option value="private">Privat (Hanya dengan tautan khusus)</option>
                            <option value="draft">Draft (Offline Sementara)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Custom Domain (Opsional)
                        </label>
                        <input
                            type="text"
                            placeholder="asafik.dev"
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}

PortfolioPage.layout = (page) => <DashboardLayout activePage="Portfolio">{page}</DashboardLayout>;

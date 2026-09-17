import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Home,
    ChevronRight,
    Plus,
    Folder,
    Clock,
    CheckCircle2,
    PauseCircle,
    MoreHorizontal,
    ArrowUp,
    Search,
    ChevronDown,
    Table as TableIcon,
    Kanban,
    ListFilter,
    Monitor,
    Smartphone,
    LayoutDashboard,
    Link2,
    Palette,
    FileText,
    Layers,
    ChevronLeft,
    GitBranch,
    Lock,
    Globe,
    Star,
    GitFork,
    ExternalLink,
    RefreshCw,
    X,
    Check,
    Users,
    User as UserIcon,
    Trash2,
    Building2,
} from 'lucide-react';

const GithubIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

export default function Projects({
    projects: initialProjects = [],
    stats = { total: 0, active: 0, completed: 0, on_hold: 0 },
    isGitHubConnected = false,
    githubUsername = '',
}) {
    // Filter & Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // 'table', 'board', 'list'

    // GitHub Repos Modal state
    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [repoError, setRepoError] = useState(null);
    const [repoSearch, setRepoSearch] = useState('');
    const [repoFilterType, setRepoFilterType] = useState('all'); // 'all', 'personal', 'collab'

    // Projects data from DB
    const projects = initialProjects;

    // Filter logic
    const filteredProjects = projects.filter((item) => {
        const matchesSearch =
            (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handleDeleteProject = (proj) => {
        if (!proj) return;
        if (confirm(`Apakah Anda yakin ingin menghapus proyek "${proj.name}"? Data proyek dan tangkapan layar akan dihapus secara permanen.`)) {
            router.delete(`/projects/${proj.id}`);
        }
    };

    // Fetch GitHub Repositories function
    const fetchRepositories = async () => {
        setIsRepoModalOpen(true);
        if (repos.length > 0) return; // already loaded

        setLoadingRepos(true);
        setRepoError(null);

        try {
            const res = await fetch('/projects/github/repositories');
            const data = await res.json();

            if (!res.ok || !data.success) {
                setRepoError(data.message || 'Gagal memuat repositori dari GitHub.');
            } else {
                setRepos(data.repos || []);
            }
        } catch (err) {
            setRepoError('Terjadi kesalahan jaringan saat mengambil repositori.');
        } finally {
            setLoadingRepos(false);
        }
    };

    // Filter GitHub Repos
    const filteredRepos = repos.filter((r) => {
        const matchesQuery =
            r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
            (r.description && r.description.toLowerCase().includes(repoSearch.toLowerCase())) ||
            (r.language && r.language.toLowerCase().includes(repoSearch.toLowerCase()));

        if (repoFilterType === 'personal') return matchesQuery && r.is_owner;
        if (repoFilterType === 'collab') return matchesQuery && !r.is_owner;
        return matchesQuery;
    });

    return (
        <>
            <Head title="Projects - WorkTrack" />

            {/* 1. Header & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 font-medium">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                        </Link>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-300">Projects</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Projects
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Manage and track all your projects in one place.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {isGitHubConnected ? (
                        <button
                            onClick={fetchRepositories}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-sm font-semibold shadow-xs hover:-translate-y-0.5 transition-all border border-slate-700 dark:border-slate-600"
                        >
                            <GithubIcon className="w-4 h-4 text-white" />
                            <span>Import from GitHub</span>
                        </button>
                    ) : (
                        <Link
                            href="/settings?tab=Integrations"
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs sm:text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <GithubIcon className="w-4 h-4" />
                            <span>Connect GitHub</span>
                        </Link>
                    )}

                    <Link
                        href="/projects/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2952e3] hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Project</span>
                    </Link>
                </div>
            </div>

            {/* 2. Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Total Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Folder className="w-5 h-5 fill-blue-600/20" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Projects</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">{stats.total}</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                            Semua proyek terdaftar
                        </p>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Clock className="w-5 h-5 fill-blue-600/20" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Progress</p>
                        <h3 className="text-[28px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">{stats.active}</h3>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium mt-1">
                            Sedang aktif dikerjakan
                        </p>
                    </div>
                </div>

                {/* Completed Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-5 h-5 fill-emerald-600/20" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed Projects</p>
                        <h3 className="text-[28px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.completed}</h3>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-1">
                            Selesai & dirilis
                        </p>
                    </div>
                </div>

                {/* On Hold */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <PauseCircle className="w-5 h-5 fill-rose-600/20" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">On Hold / Not Started</p>
                        <h3 className="text-[28px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">{stats.on_hold}</h3>
                        <p className="text-xs text-rose-600/80 dark:text-rose-400/80 font-medium mt-1">
                            Pending / dijeda
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Projects Table Card & Filters */}
            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs overflow-hidden transition-colors">
                {/* Search & Filter Bar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Search input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Right: Dropdown Filters & View Switcher */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:border-blue-500"
                            >
                                <option value="All">All Status</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Not Started">Not Started</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:border-blue-500"
                            >
                                <option value="All">All Categories</option>
                                <option value="Web Development">Web Development</option>
                                <option value="Mobile Development">Mobile Development</option>
                                <option value="Backend">Backend</option>
                                <option value="Design">Design</option>
                                <option value="Documentation">Documentation</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:border-blue-500"
                            >
                                <option>Sort by: Recent</option>
                                <option>Sort by: Name</option>
                                <option>Sort by: Progress</option>
                                <option>Sort by: Due Date</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* View Switchers */}
                        <div className="inline-flex rounded-lg bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] p-0.5">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-[#2952e3] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <TableIcon className="w-4 h-4" />
                                <span>Table</span>
                            </button>
                            <button
                                onClick={() => setViewMode('board')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                                    viewMode === 'board'
                                        ? 'bg-[#2952e3] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <Kanban className="w-4 h-4" />
                                <span>Board</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-[#2952e3] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <ListFilter className="w-4 h-4" />
                                <span>List</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#f8fafc] dark:bg-[#0c183b] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                            <tr>
                                <th className="py-3.5 px-4 w-12 text-center">#</th>
                                <th className="py-3.5 px-4">Project Name</th>
                                <th className="py-3.5 px-4">Description</th>
                                <th className="py-3.5 px-4">Team</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Progress</th>
                                <th className="py-3.5 px-4">Due Date</th>
                                <th className="py-3.5 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-slate-400 dark:text-slate-500">
                                        <Folder className="w-10 h-10 mx-auto stroke-[1.5] text-slate-300 dark:text-slate-600 mb-2" />
                                        <p className="text-sm font-semibold">Belum ada proyek yang terdaftar</p>
                                        <p className="text-xs mt-0.5">Mulai dengan mengklik tombol "New Project" atau "Import from GitHub".</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/70 dark:hover:bg-[#122352]/40 transition-colors group"
                                    >
                                        {/* Row number */}
                                        <td className="py-4 px-4 text-center text-slate-400 dark:text-slate-500 font-medium">
                                            {idx + 1}
                                        </td>

                                        {/* Project Name + Icon / Thumbnail */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {item.images && item.images.length > 0 ? (
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-[#1e346e] shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                                                        <Folder className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <Link
                                                        href={`/projects/${item.slug || item.id}`}
                                                        className="font-semibold text-sm sm:text-[15px] text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                        <span className="text-xs text-slate-400 dark:text-slate-400">
                                                            {item.category || 'General'}
                                                        </span>
                                                        {item.company_name ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/70 dark:border-blue-800/60">
                                                                <Building2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                                <span>{item.company_name}</span>
                                                            </span>
                                                        ) : item.ownership_type === 'Personal' ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/60">
                                                                <span>Personal</span>
                                                            </span>
                                                        ) : null}
                                                        {item.role && (
                                                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                                • {item.role}
                                                            </span>
                                                        )}
                                                        {item.github_repo_name && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                                <GithubIcon className="w-3 h-3" />
                                                                <span>{item.github_repo_name}</span>
                                                            </span>
                                                        )}
                                                        {item.hide_github_link && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50" title="Repo Private PT (Tautan disembunyikan)">
                                                                <Lock className="w-2.5 h-2.5" />
                                                                <span>Private PT</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate text-xs sm:text-sm">
                                            {item.description || 'Tidak ada deskripsi'}
                                        </td>

                                        {/* Project Type & Tech Stack */}
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                                                    item.project_type === 'Team'
                                                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                    {item.project_type === 'Team' ? (
                                                        <>
                                                            <Users className="w-3 h-3" />
                                                            <span>Team</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserIcon className="w-3 h-3" />
                                                            <span>Solo</span>
                                                        </>
                                                    )}
                                                </span>
                                                {item.tech_stack && item.tech_stack.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                                                        {item.tech_stack.slice(0, 2).map((tech, ti) => (
                                                            <span key={ti} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {item.tech_stack.length > 2 && (
                                                            <span className="text-[10px] text-slate-400">
                                                                +{item.tech_stack.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="py-4 px-4">
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                                    item.status === 'In Progress'
                                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50'
                                                        : item.status === 'Completed'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                                                        : item.status === 'On Hold'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>

                                        {/* Gallery preview count */}
                                        <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                                            {item.images && item.images.length > 0 ? (
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                    {item.images.length} Gambar
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">Belum ada</span>
                                            )}
                                        </td>

                                        {/* Due Date */}
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                                            {item.due_date || item.dueDate || '-'}
                                        </td>

                                        {/* Actions: Edit, View & Delete */}
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link
                                                    href={`/projects/${item.id}/edit`}
                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/projects/${item.slug || item.id}`}
                                                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteProject(item)}
                                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                    title="Hapus Proyek"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination */}
                <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <div>
                        Showing <span className="font-semibold text-slate-800 dark:text-slate-200">1</span> to{' '}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredProjects.length}</span> of{' '}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{projects.length}</span> projects
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-md bg-[#2952e3] text-white font-semibold flex items-center justify-center shadow-xs">
                            1
                        </button>
                        <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors font-medium">
                            2
                        </button>
                        <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Project Board (Kanban Columns) */}
            <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Kanban className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Project Board</h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Visualize your projects by status
                            </p>
                        </div>
                    </div>

                    {/* Group by */}
                    <div className="relative self-start sm:self-auto">
                        <select className="appearance-none bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#1e346e] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none shadow-xs">
                            <option>Group by: Status</option>
                            <option>Group by: Priority</option>
                            <option>Group by: Category</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* 4 Kanban Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Column 1: Not Started */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Not Started</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {projects.filter((p) => p.status === 'Not Started').length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            {projects.filter((p) => p.status === 'Not Started').map((p) => (
                                <div key={p.id} className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link href={`/projects/${p.slug || p.id}`} className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {p.name}
                                        </Link>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link href={`/projects/${p.id}/edit`} className="text-slate-400 hover:text-blue-600 p-0.5 rounded text-xs font-medium">
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProject(p)}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded text-xs transition-colors cursor-pointer"
                                                title="Hapus Proyek"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                                        {p.description || 'Tidak ada deskripsi'}
                                    </p>
                                    {(p.company_name || p.role || p.hide_github_link) && (
                                        <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            {p.company_name && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                                                    <Building2 className="w-2.5 h-2.5" />
                                                    <span>{p.company_name}</span>
                                                </span>
                                            )}
                                            {p.role && (
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                                    {p.role}
                                                </span>
                                            )}
                                            {p.hide_github_link && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-900/40" title="Repo Private PT">
                                                    <Lock className="w-2 h-2" />
                                                    <span>Private</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Link href="/projects/create" className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </Link>
                    </div>

                    {/* Column 2: In Progress */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">In Progress</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                {projects.filter((p) => p.status === 'In Progress').length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            {projects.filter((p) => p.status === 'In Progress').map((p) => (
                                <div key={p.id} className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link href={`/projects/${p.slug || p.id}`} className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {p.name}
                                        </Link>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link href={`/projects/${p.id}/edit`} className="text-slate-400 hover:text-blue-600 p-0.5 rounded text-xs font-medium">
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProject(p)}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded text-xs transition-colors cursor-pointer"
                                                title="Hapus Proyek"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                                        {p.description || 'Tidak ada deskripsi'}
                                    </p>
                                    {(p.company_name || p.role || p.hide_github_link) && (
                                        <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            {p.company_name && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                                                    <Building2 className="w-2.5 h-2.5" />
                                                    <span>{p.company_name}</span>
                                                </span>
                                            )}
                                            {p.role && (
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                                    {p.role}
                                                </span>
                                            )}
                                            {p.hide_github_link && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-900/40" title="Repo Private PT">
                                                    <Lock className="w-2 h-2" />
                                                    <span>Private</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {p.tech_stack && p.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {p.tech_stack.slice(0, 3).map((t, ti) => (
                                                <span key={ti} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Link href="/projects/create" className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </Link>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Completed</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                {projects.filter((p) => p.status === 'Completed').length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            {projects.filter((p) => p.status === 'Completed').map((p) => (
                                <div key={p.id} className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link href={`/projects/${p.slug || p.id}`} className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                                            {p.name}
                                        </Link>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link href={`/projects/${p.id}/edit`} className="text-slate-400 hover:text-blue-600 p-0.5 rounded text-xs font-medium">
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProject(p)}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded text-xs transition-colors cursor-pointer"
                                                title="Hapus Proyek"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                                        {p.description || 'Tidak ada deskripsi'}
                                    </p>
                                    {(p.company_name || p.role || p.hide_github_link) && (
                                        <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            {p.company_name && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                                                    <Building2 className="w-2.5 h-2.5" />
                                                    <span>{p.company_name}</span>
                                                </span>
                                            )}
                                            {p.role && (
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                                    {p.role}
                                                </span>
                                            )}
                                            {p.hide_github_link && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-900/40" title="Repo Private PT">
                                                    <Lock className="w-2 h-2" />
                                                    <span>Private</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Link href="/projects/create" className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </Link>
                    </div>

                    {/* Column 4: On Hold */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <PauseCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">On Hold</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                                {projects.filter((p) => p.status === 'On Hold').length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            {projects.filter((p) => p.status === 'On Hold').map((p) => (
                                <div key={p.id} className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-rose-400 dark:hover:border-rose-500 transition-all group">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link href={`/projects/${p.slug || p.id}`} className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                                            {p.name}
                                        </Link>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Link href={`/projects/${p.id}/edit`} className="text-slate-400 hover:text-blue-600 p-0.5 rounded text-xs font-medium">
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProject(p)}
                                                className="text-slate-400 hover:text-rose-600 p-0.5 rounded text-xs transition-colors cursor-pointer"
                                                title="Hapus Proyek"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                                        {p.description || 'Tidak ada deskripsi'}
                                    </p>
                                    {(p.company_name || p.role || p.hide_github_link) && (
                                        <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            {p.company_name && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                                                    <Building2 className="w-2.5 h-2.5" />
                                                    <span>{p.company_name}</span>
                                                </span>
                                            )}
                                            {p.role && (
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                                    {p.role}
                                                </span>
                                            )}
                                            {p.hide_github_link && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-900/40" title="Repo Private PT">
                                                    <Lock className="w-2 h-2" />
                                                    <span>Private</span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Link href="/projects/create" className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* GitHub Repositories Modal */}
            {isRepoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-2xl border border-slate-200/80 dark:border-[#1e346e] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0a1533]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs">
                                    <GithubIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            Import from GitHub
                                        </h3>
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                                            @{githubUsername || 'Asafik'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Daftar repositori akun & kolaborasi tim GitHub Anda
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsRepoModalOpen(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search & Tabs Filter */}
                        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 space-y-3 bg-white dark:bg-[#0e1d47]">
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Cari repositori berdasarkan nama, bahasa, deskripsi..."
                                        value={repoSearch}
                                        onChange={(e) => setRepoSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                                    />
                                    {repoSearch && (
                                        <button
                                            onClick={() => setRepoSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Refresh Button */}
                                <button
                                    onClick={() => {
                                        setRepos([]);
                                        fetchRepositories();
                                    }}
                                    disabled={loadingRepos}
                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0 disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${loadingRepos ? 'animate-spin' : ''}`} />
                                    <span>Refresh</span>
                                </button>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setRepoFilterType('all')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        repoFilterType === 'all'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    Semua ({repos.length})
                                </button>
                                <button
                                    onClick={() => setRepoFilterType('personal')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                        repoFilterType === 'personal'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <UserIcon className="w-3 h-3" />
                                    <span>Milik Saya ({repos.filter((r) => r.is_owner).length})</span>
                                </button>
                                <button
                                    onClick={() => setRepoFilterType('collab')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                        repoFilterType === 'collab'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <Users className="w-3 h-3" />
                                    <span>Collab / Tim ({repos.filter((r) => !r.is_owner).length})</span>
                                </button>
                            </div>
                        </div>

                        {/* Repos List Container */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 max-h-[55vh]">
                            {loadingRepos ? (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Mengambil repositori dari GitHub...
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Memuat repo pribadi dan kolaborasi tim
                                    </p>
                                </div>
                            ) : repoError ? (
                                <div className="py-12 px-4 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                                        <X className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                                        {repoError}
                                    </p>
                                    <Link
                                        href="/settings?tab=Integrations"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        Buka Pengaturan Integrasi
                                    </Link>
                                </div>
                            ) : filteredRepos.length === 0 ? (
                                <div className="py-16 text-center text-slate-400 dark:text-slate-500 space-y-2">
                                    <GithubIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                                    <p className="text-sm font-medium">Tidak ada repositori yang cocok</p>
                                    <p className="text-xs">Coba kata kunci pencarian lain.</p>
                                </div>
                            ) : (
                                filteredRepos.map((repo) => (
                                    <div
                                        key={repo.id}
                                        className="p-4 rounded-xl border border-slate-200/80 dark:border-[#1e346e] bg-slate-50/40 dark:bg-[#0a1533]/40 hover:bg-white dark:hover:bg-[#0e1d47] hover:border-blue-300 dark:hover:border-blue-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                    >
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Repo Name */}
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {repo.name}
                                                </h4>

                                                {/* Private / Public Badge */}
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                                        repo.is_private
                                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                    }`}
                                                >
                                                    {repo.is_private ? (
                                                        <>
                                                            <Lock className="w-2.5 h-2.5" />
                                                            <span>Private</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe className="w-2.5 h-2.5" />
                                                            <span>Public</span>
                                                        </>
                                                    )}
                                                </span>

                                                {/* Owner / Collab Tag */}
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                                        repo.is_owner
                                                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                                                            : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900'
                                                    }`}
                                                >
                                                    {repo.is_owner ? 'Personal' : `Collab (${repo.owner.login})`}
                                                </span>

                                                {/* Language Badge */}
                                                {repo.language && repo.language !== 'Other' && (
                                                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                                        {repo.language}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                {repo.description || 'Tidak ada deskripsi pada repositori ini.'}
                                            </p>

                                            {/* Meta: Stars, Forks, Updated */}
                                            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                                                {repo.stars > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                        {repo.stars}
                                                    </span>
                                                )}
                                                {repo.forks > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <GitFork className="w-3 h-3" />
                                                        {repo.forks}
                                                    </span>
                                                )}
                                                <span>
                                                    Update:{' '}
                                                    {new Date(repo.updated_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action: Open on GitHub & Track */}
                                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Lihat di GitHub"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    setIsRepoModalOpen(false);
                                                    const params = new URLSearchParams({
                                                        name: repo.name,
                                                        description: repo.description || '',
                                                        project_type: repo.is_owner ? 'Solo' : 'Team',
                                                        status: 'In Progress',
                                                        tech_stack: repo.language || '',
                                                        github_repo_id: repo.id.toString(),
                                                        github_repo_name: repo.full_name,
                                                        github_repo_url: repo.html_url,
                                                    });
                                                    router.visit(`/projects/create?${params.toString()}`);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Pilih Repo</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0a1533]/50 flex items-center justify-between">
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                                Menampilkan {filteredRepos.length} dari {repos.length} repositori
                            </span>
                            <button
                                onClick={() => setIsRepoModalOpen(false)}
                                className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Projects.layout = (page) => <DashboardLayout activePage="Projects">{page}</DashboardLayout>;


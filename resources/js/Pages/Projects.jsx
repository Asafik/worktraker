import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
} from 'lucide-react';

export default function Projects() {
    // Filter & Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // 'table', 'board', 'list'

    // Mock projects data
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'Company Website',
            category: 'Web Development',
            description: 'Modern company profile website with CMS.',
            icon: Monitor,
            iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
            team: [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
            ],
            extraTeam: 2,
            status: 'In Progress',
            progress: 70,
            dueDate: '12 Sep 2025',
        },
        {
            id: 2,
            name: 'Mobile App',
            category: 'Mobile Development',
            description: 'Mobile app for internal team.',
            icon: Smartphone,
            iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
            team: [
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
            ],
            extraTeam: 0,
            status: 'In Progress',
            progress: 45,
            dueDate: '28 Sep 2025',
        },
        {
            id: 3,
            name: 'Admin Dashboard',
            category: 'Web Development',
            description: 'Internal dashboard for data management.',
            icon: LayoutDashboard,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
            team: [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
            ],
            extraTeam: 0,
            status: 'Completed',
            progress: 100,
            dueDate: '05 Sep 2025',
        },
        {
            id: 4,
            name: 'API Integration',
            category: 'Backend',
            description: 'Integrate with third-party services (API).',
            icon: Link2,
            iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
            team: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80',
            ],
            extraTeam: 0,
            status: 'In Progress',
            progress: 60,
            dueDate: '20 Sep 2025',
        },
        {
            id: 5,
            name: 'UI/UX Redesign',
            category: 'Design',
            description: 'Improve UI/UX for better user experience.',
            icon: Palette,
            iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
            team: [
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
            ],
            extraTeam: 0,
            status: 'On Hold',
            progress: 30,
            dueDate: '25 Sep 2025',
        },
        {
            id: 6,
            name: 'Documentation',
            category: 'Documentation',
            description: 'Create technical and user documentation.',
            icon: FileText,
            iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
            team: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80',
            ],
            extraTeam: 0,
            status: 'Not Started',
            progress: 0,
            dueDate: '30 Sep 2025',
        },
    ]);

    // Filter logic
    const filteredProjects = projects.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
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

                {/* New Project CTA Button */}
                <button
                    onClick={() => alert('Fitur tambah proyek baru siap dikembangkan di tahap backend database!')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2952e3] hover:bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            {/* 2. Top 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Total Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Folder className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Projects</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">12</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>2 this month</span>
                        </p>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Clock className="w-5 h-5 fill-emerald-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Projects</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">8</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>2 more active</span>
                        </p>
                    </div>
                </div>

                {/* Completed Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <CheckCircle2 className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed Projects</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">3</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>1 this month</span>
                        </p>
                    </div>
                </div>

                {/* On Hold */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <PauseCircle className="w-5 h-5 fill-rose-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">On Hold</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">1</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1.5">
                            No changes
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
                            {filteredProjects.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/70 dark:hover:bg-[#122352]/40 transition-colors group"
                                    >
                                        {/* Row number */}
                                        <td className="py-4 px-4 text-center text-slate-400 dark:text-slate-500 font-medium">
                                            {idx + 1}
                                        </td>

                                        {/* Project Name + Icon */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm sm:text-[15px] text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                                                        {item.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate text-xs sm:text-sm">
                                            {item.description}
                                        </td>

                                        {/* Team Stack */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center -space-x-2">
                                                {item.team.map((imgUrl, i) => (
                                                    <img
                                                        key={i}
                                                        src={imgUrl}
                                                        alt="Team member"
                                                        className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#0e1d47] object-cover"
                                                    />
                                                ))}
                                                {item.extraTeam > 0 && (
                                                    <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#1a2f66] ring-2 ring-white dark:ring-[#0e1d47] text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                                        +{item.extraTeam}
                                                    </span>
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

                                        {/* Progress Bar */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3 w-36">
                                                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            item.status === 'Completed'
                                                                ? 'bg-emerald-500'
                                                                : 'bg-[#2952e3]'
                                                        }`}
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 w-9 text-right">
                                                    {item.progress}%
                                                </span>
                                            </div>
                                        </td>

                                        {/* Due Date */}
                                        <td className="py-4 px-4 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                                            {item.dueDate}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-4 text-center">
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                                2
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Documentation
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-400">
                                    <span className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></span>
                                    <span>0%</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-slate-400" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Research &amp; Planning
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-400">
                                    <span className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></span>
                                    <span>0%</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </button>
                    </div>

                    {/* Column 2: In Progress */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">In Progress</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                4
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-4 h-4 text-blue-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Company Website
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2952e3] rounded-full w-[70%]"></div>
                                    </div>
                                    <span className="font-semibold text-slate-600 dark:text-slate-300">70%</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-purple-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Mobile App
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2952e3] rounded-full w-[45%]"></div>
                                    </div>
                                    <span className="font-semibold text-slate-600 dark:text-slate-300">45%</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link2 className="w-4 h-4 text-blue-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            API Integration
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2952e3] rounded-full w-[60%]"></div>
                                    </div>
                                    <span className="font-semibold text-slate-600 dark:text-slate-300">60%</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-purple-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            UI/UX Enhancement
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2952e3] rounded-full w-[20%]"></div>
                                    </div>
                                    <span className="font-semibold text-slate-600 dark:text-slate-300">20%</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </button>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Completed</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                3
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Admin Dashboard
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full w-[100%]"></div>
                                    </div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100%</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-4 h-4 text-emerald-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Landing Page
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full w-[100%]"></div>
                                    </div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100%</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-emerald-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Database Setup
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full w-[100%]"></div>
                                    </div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100%</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </button>
                    </div>

                    {/* Column 4: On Hold */}
                    <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <PauseCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">On Hold</h4>
                            </div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
                                1
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2.5">
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-rose-600" />
                                        <h5 className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            UI/UX Redesign
                                        </h5>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs font-medium">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 rounded-full w-[30%]"></div>
                                    </div>
                                    <span className="font-semibold text-rose-600 dark:text-rose-400">30%</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

Projects.layout = (page) => <DashboardLayout activePage="Projects">{page}</DashboardLayout>;


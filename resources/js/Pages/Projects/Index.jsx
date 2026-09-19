import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import CustomSelect from '@/Components/CustomSelect';
import { useReactTable, flexRender } from '@tanstack/react-table';
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
} from '@tanstack/table-core';
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
    ArrowDown,
    ArrowUpDown,
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
    Pencil,
    Calendar,
    ArrowRight,
} from 'lucide-react';

const formatCompletionDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return null;
    }
};

const GithubIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const STATUS_OPTIONS = [
    { value: 'All', label: 'All Status' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Not Started', label: 'Not Started' },
];

const CATEGORY_OPTIONS = [
    { value: 'All', label: 'All Categories' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Design', label: 'Design' },
    { value: 'Documentation', label: 'Documentation' },
];

const SORT_OPTIONS = [
    { value: 'recent', label: 'Sort by: Recent' },
    { value: 'name', label: 'Sort by: Name' },
    { value: 'progress', label: 'Sort by: Progress' },
    { value: 'due_date', label: 'Sort by: Due Date' },
];

const GROUP_BY_OPTIONS = [
    { value: 'status', label: 'Group by: Status' },
    { value: 'priority', label: 'Group by: Priority' },
    { value: 'category', label: 'Group by: Category' },
];

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
    const [sortBy, setSortBy] = useState('recent');
    const [groupBy, setGroupBy] = useState('status');
    const [viewMode, setViewMode] = useState('table'); // 'table', 'board', 'list'

    // DataTables (TanStack Table) state
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRowExpand = (rowId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    // GitHub Repos Modal state
    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [repoError, setRepoError] = useState(null);
    const [repoSearch, setRepoSearch] = useState('');
    const [repoFilterType, setRepoFilterType] = useState('all'); // 'all', 'personal', 'collab'

    // Projects data from DB
    const projects = initialProjects;

    // Sorting logic for toolbar dropdown (default fallback)
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (sortBy === 'name') {
                return (a.name || '').localeCompare(b.name || '');
            }
            if (sortBy === 'progress') {
                const order = { 'Completed': 3, 'In Progress': 2, 'On Hold': 1, 'Not Started': 0 };
                return (order[b.status] ?? 0) - (order[a.status] ?? 0);
            }
            if (sortBy === 'due_date') {
                if (!a.due_date) return 1;
                if (!b.due_date) return -1;
                return new Date(a.due_date) - new Date(b.due_date);
            }
            return (b.id ?? 0) - (a.id ?? 0);
        });
    }, [projects, sortBy]);

    // Filter logic
    const filteredProjects = useMemo(() => {
        return sortedProjects.filter((item) => {
            const matchesSearch =
                (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.company_name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [sortedProjects, searchQuery, statusFilter, categoryFilter]);

    // Reset pagination and expanded rows on filter or search change
    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setExpandedRows({});
    }, [searchQuery, statusFilter, categoryFilter, sortBy]);

    const handleDeleteProject = (proj) => {
        if (!proj) return;
        if (confirm(`Apakah Anda yakin ingin menghapus proyek "${proj.name}"? Data proyek dan tangkapan layar akan dihapus secara permanen.`)) {
            router.delete(`/projects/${proj.id}`);
        }
    };

    // DataTables Columns Definition
    const columns = useMemo(() => [
        {
            id: 'index',
            header: () => <span className="text-center block w-8">#</span>,
            cell: ({ row }) => (
                <div className="text-center text-slate-400 dark:text-slate-500 font-medium">
                    {pagination.pageIndex * pagination.pageSize + row.index + 1}
                </div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer select-none transition-colors"
                >
                    <span>Project & Role</span>
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return (
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
                        <div className="min-w-0">
                            <Link
                                href={`/projects/${item.slug || item.id}`}
                                className="font-semibold text-sm sm:text-[15px] text-slate-900 dark:text-white group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors block truncate max-w-[200px] sm:max-w-xs"
                            >
                                {item.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 dark:text-slate-400">
                                <span>{item.category || 'General'}</span>
                                {item.role && (
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                                        • {item.role}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'company_name',
            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="whitespace-nowrap inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer select-none transition-colors"
                >
                    <span>Client / Company</span>
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return item.company_name ? (
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] block">
                        {item.company_name}
                    </span>
                ) : item.ownership_type === 'Personal' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800/60">
                        <span>Personal Project</span>
                    </span>
                ) : (
                    <span className="text-xs text-slate-400">-</span>
                );
            },
        },
        {
            id: 'github_repo',
            header: 'GitHub Repo',
            cell: ({ row }) => {
                const item = row.original;
                if (!item.github_repo_name) {
                    return <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>;
                }
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <GithubIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
                            {item.hide_github_link ? (
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                                    {item.github_repo_name}
                                </span>
                            ) : (
                                <a
                                    href={item.github_repo_url || `https://github.com/${item.github_repo_name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[160px] inline-block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.github_repo_name}
                                </a>
                            )}
                        </div>
                        {item.hide_github_link ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Private Repo</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                                <Globe className="w-2.5 h-2.5 text-slate-400" />
                                <span>Public</span>
                            </span>
                        )}
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            id: 'tech_stack',
            header: 'Tech Stack',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
                        {item.tech_stack && item.tech_stack.length > 0 ? (
                            item.tech_stack.slice(0, 3).map((t, idx) => (
                                <span
                                    key={idx}
                                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#152554] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-[#223974]"
                                >
                                    {t}
                                </span>
                            ))
                        ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                        )}
                        {item.tech_stack && item.tech_stack.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                                +{item.tech_stack.length - 3}
                            </span>
                        )}
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'project_type',
            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="whitespace-nowrap inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer select-none transition-colors"
                >
                    <span>Team Type</span>
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <span
                        className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            item.project_type === 'Team'
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {item.project_type === 'Team' ? (
                            <>
                                <Users className="w-3 h-3 shrink-0" />
                                <span className="whitespace-nowrap">Team {item.team_size && item.team_size > 1 ? `(${item.team_size})` : ''}</span>
                            </>
                        ) : (
                            <>
                                <UserIcon className="w-3 h-3 shrink-0" />
                                <span className="whitespace-nowrap">Solo</span>
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    className="whitespace-nowrap inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer select-none transition-colors"
                >
                    <span>Status</span>
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const item = row.original;
                const completedDate = item.status === 'Completed' && item.due_date ? formatCompletionDate(item.due_date) : null;
                return (
                    <div className="flex flex-col items-start gap-1">
                        <span
                            className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${
                                item.status === 'In Progress'
                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                                    : item.status === 'Completed'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                                    : item.status === 'On Hold'
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    item.status === 'In Progress'
                                    ? 'bg-blue-500'
                                    : item.status === 'Completed'
                                    ? 'bg-emerald-500'
                                    : item.status === 'On Hold'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                            />
                            <span className="whitespace-nowrap">{item.status}</span>
                        </span>
                        {completedDate && (
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 pl-0.5">
                                {completedDate}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <span className="text-center block whitespace-nowrap">Actions</span>,
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap shrink-0">
                        <Link
                            href={`/projects/${item.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="Edit Project"
                        >
                            <Pencil className="w-4 h-4" />
                        </Link>
                        <Link
                            href={`/projects/${item.slug || item.id}`}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="View Project Details"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => handleDeleteProject(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete Project"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                );
            },
            enableSorting: false,
        },
    ], [pagination.pageIndex, pagination.pageSize]);

    // TanStack React Table Instance
    const table = useReactTable({
        data: filteredProjects,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Synced rows for Mobile Cards & List view
    const paginatedProjects = table.getRowModel().rows.map((r) => r.original);

    const renderProjectCard = (p) => (
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
    );

    const renderKanbanColumn = (title, status, icon, badgeClasses, limit = null) => {
        const columnProjects = projects.filter((p) => p.status === status);
        const displayed = limit ? columnProjects.slice(0, limit) : columnProjects;
        const hasMore = limit && columnProjects.length > limit;

        return (
            <div className="bg-[#f8fafc] dark:bg-[#0a1533] rounded-lg p-4 border border-slate-200/80 dark:border-[#1c2e5c] space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            {icon}
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${badgeClasses}`}>
                            {columnProjects.length}
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        {displayed.map(renderProjectCard)}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            onClick={() => setViewMode('board')}
                            className="w-full py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 rounded-md border border-blue-200/60 dark:border-blue-900/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                            <span>+{columnProjects.length - limit} proyek lainnya</span>
                            <ArrowRight className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <Link href="/projects/create" className="w-full py-2 rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center justify-center gap-1.5 mt-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                </Link>
            </div>
        );
    };

    const renderProjectBoard = (limit = null) => (
        <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Kanban className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Project Board</h3>
                            {limit && (
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    Preview ({limit} per kolom)
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {limit
                                ? 'Ringkasan board proyek (buka tab Board untuk melihat semua)'
                                : 'Visualize your projects by status'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    {/* Group by */}
                    <div className="w-full sm:w-40 md:w-44">
                        <CustomSelect
                            value={groupBy}
                            onChange={(val) => setGroupBy(val)}
                            options={GROUP_BY_OPTIONS}
                            buttonClassName="!py-2 !px-3 !text-xs sm:!text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* 4 Kanban Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
                {renderKanbanColumn(
                    'Not Started',
                    'Not Started',
                    <Clock className="w-4 h-4 text-slate-500" />,
                    'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
                    limit
                )}
                {renderKanbanColumn(
                    'In Progress',
                    'In Progress',
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                    'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50',
                    limit
                )}
                {renderKanbanColumn(
                    'Completed',
                    'Completed',
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                    'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50',
                    limit
                )}
                {renderKanbanColumn(
                    'On Hold',
                    'On Hold',
                    <PauseCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
                    'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50',
                    limit
                )}
            </div>
        </div>
    );

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
                <div className="flex items-center gap-2 sm:gap-2.5 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
                    {isGitHubConnected ? (
                        <button
                            onClick={fetchRepositories}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs hover:-translate-y-0.5 transition-all border border-slate-700 dark:border-slate-600"
                        >
                            <GithubIcon className="w-4 h-4 text-white shrink-0" />
                            <span>Import from GitHub</span>
                        </button>
                    ) : (
                        <Link
                            href="/settings?tab=Integrations"
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs sm:text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <GithubIcon className="w-4 h-4 shrink-0" />
                            <span>Connect GitHub</span>
                        </Link>
                    )}

                    <Link
                        href="/projects/create"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2952e3] hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span>New Project</span>
                    </Link>
                </div>
            </div>

            {/* 2. Top 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {/* Total Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <Folder className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600/20" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">Total Projects</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">{stats.total}</h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 truncate">
                            Semua proyek terdaftar
                        </p>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600/20" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">In Progress</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">{stats.active}</h3>
                        <p className="text-[10px] sm:text-xs text-blue-600/80 dark:text-blue-400/80 font-medium mt-1 truncate">
                            Sedang aktif dikerjakan
                        </p>
                    </div>
                </div>

                {/* Completed Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-600/20" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">Completed Projects</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.completed}</h3>
                        <p className="text-[10px] sm:text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-1 truncate">
                            Selesai & dirilis
                        </p>
                    </div>
                </div>

                {/* On Hold */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                            <PauseCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-600/20" />
                        </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">On Hold / Not Started</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">{stats.on_hold}</h3>
                        <p className="text-[10px] sm:text-xs text-rose-600/80 dark:text-rose-400/80 font-medium mt-1 truncate">
                            Pending / dijeda
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Projects Table Card & Filters */}
            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs transition-colors">
                {/* Search & Filter Bar */}
                <div className="p-3.5 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                    {/* Left: Search input */}
                    <div className="relative w-full lg:max-w-md">
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
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
                        {/* Status Filter */}
                        <div className="w-full sm:w-36 md:w-40">
                            <CustomSelect
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val)}
                                options={STATUS_OPTIONS}
                                buttonClassName="!py-2 !px-3 !text-xs sm:!text-sm font-medium"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="w-full sm:w-40 md:w-44">
                            <CustomSelect
                                value={categoryFilter}
                                onChange={(val) => setCategoryFilter(val)}
                                options={CATEGORY_OPTIONS}
                                buttonClassName="!py-2 !px-3 !text-xs sm:!text-sm font-medium"
                            />
                        </div>

                        {/* Sort */}
                        <div className="col-span-2 sm:col-span-1 w-full sm:w-38 md:w-44">
                            <CustomSelect
                                value={sortBy}
                                onChange={(val) => setSortBy(val)}
                                options={SORT_OPTIONS}
                                buttonClassName="!py-2 !px-3 !text-xs sm:!text-sm font-medium"
                            />
                        </div>

                        {/* View Switchers */}
                        <div className="col-span-2 sm:col-span-1 inline-flex rounded-lg bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] p-0.5 w-full sm:w-auto justify-center">
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                                    viewMode === 'table'
                                        ? 'bg-[#2952e3] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <TableIcon className="w-4 h-4" />
                                <span>Table</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('board')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                                    viewMode === 'board'
                                        ? 'bg-[#2952e3] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <Kanban className="w-4 h-4" />
                                <span>Board</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
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

                {viewMode === 'table' && (
                    <>
                        {/* DataTables Responsive Table (with expandable child rows on mobile) */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-[#f8fafc] dark:bg-[#0c183b] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {/* DataTables Responsive Control Header (+) - automatically adapts to screen width */}
                                            <th className="w-10 px-3 py-3.5 text-center 2xl:hidden"></th>
                                            {headerGroup.headers.map((header) => {
                                                const colId = header.id;
                                                const responsiveClass =
                                                    colId === 'name'
                                                        ? ''
                                                        : colId === 'github_repo' || colId === 'tech_stack'
                                                        ? 'hidden 2xl:table-cell'
                                                        : colId === 'project_type'
                                                        ? 'hidden xl:table-cell'
                                                        : 'hidden md:table-cell';
                                                return (
                                                    <th
                                                        key={header.id}
                                                        className={`py-3.5 px-3 sm:px-4 ${
                                                            colId !== 'name' ? 'whitespace-nowrap' : ''
                                                        } ${responsiveClass}`}
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                  header.column.columnDef.header,
                                                                  header.getContext()
                                                              )}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                    {table.getRowModel().rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 dark:text-slate-500">
                                                <Folder className="w-10 h-10 mx-auto stroke-[1.5] text-slate-300 dark:text-slate-600 mb-2" />
                                                <p className="text-sm font-semibold">Belum ada proyek yang terdaftar</p>
                                                <p className="text-xs mt-0.5">Mulai dengan mengklik tombol "New Project" atau "Import from GitHub".</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        table.getRowModel().rows.map((row) => {
                                            const item = row.original;
                                            const isExpanded = !!expandedRows[item.id];
                                            return (
                                                <React.Fragment key={row.id}>
                                                    <tr
                                                        className={`hover:bg-slate-50/70 dark:hover:bg-[#122352]/40 transition-colors group ${
                                                            isExpanded ? 'bg-blue-50/25 dark:bg-[#122352]/25' : ''
                                                        }`}
                                                    >
                                                        {/* DataTables Responsive Control (+) button */}
                                                        <td className="w-10 px-3 py-4 text-center 2xl:hidden align-middle">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleRowExpand(item.id)}
                                                                className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-bold text-xs transition-all shadow-xs cursor-pointer ${
                                                                    isExpanded
                                                                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                                                        : 'bg-[#2952e3] hover:bg-blue-700 text-white'
                                                                }`}
                                                                title={isExpanded ? 'Tutup Detail' : 'Buka Detail (DataTables Responsive)'}
                                                            >
                                                                {isExpanded ? '−' : '+'}
                                                            </button>
                                                        </td>
                                                        {row.getVisibleCells().map((cell) => {
                                                            const colId = cell.column.id;
                                                            const responsiveClass =
                                                                colId === 'name'
                                                                    ? ''
                                                                    : colId === 'github_repo' || colId === 'tech_stack'
                                                                    ? 'hidden 2xl:table-cell'
                                                                    : colId === 'project_type'
                                                                    ? 'hidden xl:table-cell'
                                                                    : 'hidden md:table-cell';
                                                            return (
                                                                <td
                                                                    key={cell.id}
                                                                    className={`py-4 px-3 sm:px-4 ${
                                                                        colId !== 'name' ? 'whitespace-nowrap' : ''
                                                                    } ${responsiveClass}`}
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>

                                                    {/* DataTables Responsive Child Row - Dynamically displays only fields hidden at current screen size */}
                                                    {isExpanded && (
                                                        <tr className="2xl:hidden bg-slate-50/90 dark:bg-[#0a1533] border-b border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-150">
                                                            <td colSpan={columns.length + 1} className="p-3.5 pl-4 sm:pl-10 text-xs">
                                                                <div className="bg-white dark:bg-[#0e1d47] p-3.5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-2.5">
                                                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-200">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-slate-400 font-medium">#{pagination.pageIndex * pagination.pageSize + row.index + 1}</span>
                                                                            <span>Project Details</span>
                                                                        </div>
                                                                        <span
                                                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border xl:hidden ${
                                                                                item.project_type === 'Team'
                                                                                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900'
                                                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                                            }`}
                                                                        >
                                                                            {item.project_type === 'Team'
                                                                                ? `Team ${item.team_size && item.team_size > 1 ? `(${item.team_size})` : ''}`
                                                                                : 'Solo'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Status (hidden on tablet/desktop row, shown in child row only on mobile) */}
                                                                    <div className="flex md:hidden items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/60">
                                                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                                                            Status:
                                                                        </span>
                                                                        <div className="flex flex-col items-end gap-1">
                                                                            <span
                                                                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                                                                                    item.status === 'In Progress'
                                                                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                                                                                        : item.status === 'Completed'
                                                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                                                                                        : item.status === 'On Hold'
                                                                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                                                }`}
                                                                            >
                                                                                <span
                                                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                                                        item.status === 'In Progress'
                                                                                            ? 'bg-blue-500'
                                                                                            : item.status === 'Completed'
                                                                                            ? 'bg-emerald-500'
                                                                                            : item.status === 'On Hold'
                                                                                            ? 'bg-amber-500'
                                                                                            : 'bg-slate-400'
                                                                                    }`}
                                                                                />
                                                                                <span>{item.status}</span>
                                                                            </span>
                                                                            {item.status === 'Completed' && item.due_date && (
                                                                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                                                    {formatCompletionDate(item.due_date)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Client / Company (shown in child row on mobile only) */}
                                                                    <div className="flex md:hidden items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/60">
                                                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                                                            Client / Company:
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                            {item.company_name || 'Personal Project'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Project Type (shown in child row on mobile & tablet < xl) */}
                                                                    <div className="flex xl:hidden items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/60">
                                                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                                                            Project Type:
                                                                        </span>
                                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                                            {item.project_type === 'Team' ? `Team (${item.team_size || 1})` : 'Solo'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Tech Stack (hidden on row until xl, shown in child row on < xl) */}
                                                                    {item.tech_stack && item.tech_stack.length > 0 && (
                                                                        <div className="flex xl:hidden items-start justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/60">
                                                                            <span className="font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                                                                Tech Stack:
                                                                            </span>
                                                                            <div className="flex flex-wrap gap-1 justify-end">
                                                                                {item.tech_stack.map((t, idx) => (
                                                                                    <span
                                                                                        key={idx}
                                                                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#152554] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-[#223974]"
                                                                                    >
                                                                                        {t}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* GitHub Repo (hidden on row until 2xl, shown in child row on < 2xl) */}
                                                                    <div className="flex 2xl:hidden items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800/60">
                                                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                                                            GitHub Repo:
                                                                        </span>
                                                                        <div>
                                                                            {item.hide_github_link ? (
                                                                                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 inline-flex items-center gap-1">
                                                                                    <Lock className="w-2.5 h-2.5" />
                                                                                    Repo Private PT
                                                                                </span>
                                                                            ) : item.github_repo_name ? (
                                                                                <a
                                                                                    href={
                                                                                        item.github_repo_url ||
                                                                                        `https://github.com/${item.github_repo_name}`
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                                                                >
                                                                                    <GithubIcon className="w-3 h-3" />
                                                                                    {item.github_repo_name}
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-slate-400">—</span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Actions (shown in child row on mobile only) */}
                                                                    <div className="flex md:hidden items-center justify-between gap-2 pt-1">
                                                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                                                            Aksi:
                                                                        </span>
                                                                        <div className="flex items-center gap-1">
                                                                            <Link
                                                                                href={`/projects/${item.id}/edit`}
                                                                                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                                                                                title="Edit Proyek"
                                                                            >
                                                                                <Pencil className="w-4 h-4" />
                                                                            </Link>
                                                                            <Link
                                                                                href={`/projects/${item.slug || item.id}`}
                                                                                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                                                                                title="Lihat Detail Proyek"
                                                                            >
                                                                                <ExternalLink className="w-4 h-4" />
                                                                            </Link>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleDeleteProject(item)}
                                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                                                title="Hapus Proyek"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* DataTables Pagination & Per-Page Controls */}
                        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            <div>
                                {filteredProjects.length > 0 ? (
                                    <span>
                                        Menampilkan <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.pageIndex * pagination.pageSize + 1}</span> sampai{' '}
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredProjects.length)}</span> dari{' '}
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredProjects.length}</span> proyek
                                    </span>
                                ) : (
                                    <span>Tidak ada proyek yang sesuai filter</span>
                                )}
                            </div>

                            {table.getPageCount() > 1 && (
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        title="Halaman Sebelumnya"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIdx) => (
                                        <button
                                            key={pageIdx}
                                            type="button"
                                            onClick={() => table.setPageIndex(pageIdx)}
                                            className={`w-8 h-8 rounded-md font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                                table.getState().pagination.pageIndex === pageIdx
                                                    ? 'bg-[#2952e3] text-white shadow-xs'
                                                    : 'border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352]'
                                            }`}
                                        >
                                            {pageIdx + 1}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        title="Halaman Selanjutnya"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* List View Mode */}
                {viewMode === 'list' && (
                    <>
                        <div className="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
                            {paginatedProjects.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Folder className="w-10 h-10 mx-auto stroke-[1.5] text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-sm font-semibold">Tidak ada proyek yang sesuai filter</p>
                                </div>
                            ) : (
                                paginatedProjects.map((p) => (
                                    <div key={p.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-[#122352]/30 px-3 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {p.images && p.images.length > 0 ? (
                                                <img
                                                    src={p.images[0]}
                                                    alt={p.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-[#1e346e] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                                                    <Folder className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link href={`/projects/${p.slug || p.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate text-sm">
                                                        {p.name}
                                                    </Link>
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                                        p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' :
                                                        p.status === 'In Progress' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' :
                                                        p.status === 'On Hold' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' :
                                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                                    {p.company_name ? `${p.company_name} • ` : ''}{p.description || 'Tidak ada deskripsi'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                            <Link href={`/projects/${p.id}/edit`} className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-[#162759] transition-colors" title="Edit Proyek">
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button type="button" onClick={() => handleDeleteProject(p)} className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer" title="Hapus Proyek">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* List Pagination */}
                        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            <div>
                                {filteredProjects.length > 0 ? (
                                    <>
                                        Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{pagination.pageIndex * pagination.pageSize + 1}</span> to{' '}
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredProjects.length)}</span> of{' '}
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredProjects.length}</span> projects
                                    </>
                                ) : (
                                    <span>Tidak ada proyek</span>
                                )}
                            </div>

                            {table.getPageCount() > 1 && (
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIdx) => (
                                        <button
                                            key={pageIdx}
                                            type="button"
                                            onClick={() => table.setPageIndex(pageIdx)}
                                            className={`w-8 h-8 rounded-md font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                                table.getState().pagination.pageIndex === pageIdx
                                                    ? 'bg-[#2952e3] text-white shadow-xs'
                                                    : 'border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352]'
                                            }`}
                                        >
                                            {pageIdx + 1}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* 4. Project Board (Kanban Columns) */}
            {/* Pada tampilan Table: tampilkan preview ringkas (maks. 3 kartu per kolom) */}
            {viewMode === 'table' && renderProjectBoard(3)}

            {/* Pada tampilan Board: tampilkan semua kartu tanpa batas */}
            {viewMode === 'board' && renderProjectBoard(null)}

            {/* GitHub Repositories Modal */}
            {isRepoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0a1533]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs">
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
                                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#0a1533] border border-slate-200 dark:border-[#1e346e] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
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
                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0 disabled:opacity-50"
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
                                        className="p-4 rounded-lg border border-slate-200/80 dark:border-[#1e346e] bg-slate-50/40 dark:bg-[#0a1533]/40 hover:bg-white dark:hover:bg-[#0e1d47] hover:border-blue-300 dark:hover:border-blue-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
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
                                                    const repoStartDate = repo.created_at ? repo.created_at.substring(0, 10) : '';
                                                    const params = new URLSearchParams({
                                                        name: repo.name,
                                                        description: repo.description || '',
                                                        project_type: repo.is_owner ? 'Solo' : 'Team',
                                                        status: 'In Progress',
                                                        tech_stack: repo.language || '',
                                                        github_repo_id: repo.id.toString(),
                                                        github_repo_name: repo.full_name,
                                                        github_repo_url: repo.html_url,
                                                        start_date: repoStartDate,
                                                    });
                                                    if (repo.is_private) {
                                                        params.set('hide_github_link', '1');
                                                    }
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


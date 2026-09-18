import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Checkbox from '@/Components/Checkbox';
import {
    CheckSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    Search,
    ChevronDown,
    Home,
    RotateCcw,
    Sparkles,
    Calendar as CalendarIcon,
    Trash2,
    Edit3,
    ExternalLink,
    Filter,
    Layers,
    Folder,
    LayoutList,
    Kanban,
    X,
    Check,
    ArrowRight,
} from 'lucide-react';

// GitHub SVG Icon
const GithubIcon = ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

export default function Tasks({ tasks = [], projects = [], stats = {}, filters = {}, flash = {} }) {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedProject, setSelectedProject] = useState(filters.project_id || 'all');

    // Quick Add input state
    const [quickTitle, setQuickTitle] = useState('');
    const [quickType, setQuickType] = useState('revision');
    const [quickProjectId, setQuickProjectId] = useState(projects[0]?.id || '');
    const [quickPriority, setQuickPriority] = useState('High');
    const [quickDueDate, setQuickDueDate] = useState('');
    const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [modalForm, setModalForm] = useState({
        title: '',
        description: '',
        project_id: '',
        type: 'revision',
        priority: 'High',
        status: 'todo',
        due_date: '',
    });

    // Handle quick submit
    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!quickTitle.trim()) return;

        setIsSubmittingQuick(true);
        router.post('/tasks', {
            title: quickTitle.trim(),
            type: quickType,
            project_id: quickProjectId || null,
            priority: quickPriority,
            status: 'todo',
            due_date: quickDueDate || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setQuickTitle('');
                setQuickDueDate('');
                setIsSubmittingQuick(false);
            },
            onError: () => {
                setIsSubmittingQuick(false);
            },
        });
    };

    // Toggle completion
    const handleToggleTask = (taskId) => {
        router.post(`/tasks/${taskId}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    // Delete task
    const handleDeleteTask = (taskId) => {
        if (confirm('Yakin ingin menghapus tugas ini?')) {
            router.delete(`/tasks/${taskId}`, {
                preserveScroll: true,
            });
        }
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingTask(null);
        setModalForm({
            title: '',
            description: '',
            project_id: projects[0]?.id || '',
            type: 'revision',
            priority: 'High',
            status: 'todo',
            due_date: '',
        });
        setIsModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (task) => {
        setEditingTask(task);
        setModalForm({
            title: task.title,
            description: task.description || '',
            project_id: task.project_id || '',
            type: task.type,
            priority: task.priority,
            status: task.status,
            due_date: task.due_date || '',
        });
        setIsModalOpen(true);
    };

    // Save Modal
    const handleSaveModal = (e) => {
        e.preventDefault();
        if (!modalForm.title.trim()) return;

        if (editingTask) {
            router.post(`/tasks/${editingTask.id}/update`, modalForm, {
                preserveScroll: true,
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post('/tasks', modalForm, {
                preserveScroll: true,
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    // Filter tasks locally for responsive instant feedback
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            !searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (task.project && task.project.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (task.project && task.project.github_repo_name && task.project.github_repo_name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedType === 'all' || task.type === selectedType;
        const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
        const matchesProject = selectedProject === 'all' || String(task.project_id) === String(selectedProject);

        return matchesSearch && matchesType && matchesStatus && matchesProject;
    });

    // Helper badge configs
    const getTypeConfig = (type) => {
        switch (type) {
            case 'revision':
                return {
                    label: 'Revisi',
                    bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
                    icon: RotateCcw,
                };
            case 'bugfix':
                return {
                    label: 'Bug Fix',
                    bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
                    icon: AlertCircle,
                };
            case 'feature':
                return {
                    label: 'Fitur Baru',
                    bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
                    icon: Sparkles,
                };
            default:
                return {
                    label: 'Umum',
                    bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                    icon: CheckSquare,
                };
        }
    };

    const getPriorityConfig = (priority) => {
        switch (priority) {
            case 'Urgent':
                return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50';
            case 'High':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
            case 'Medium':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <DashboardLayout activePage="Tasks">
            <Head title="Tasks & Revisi - WorkTrack" />

            <div className="space-y-6 w-full">
                {/* 1. Header & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                            </Link>
                            <span>/</span>
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">Tasks & Revisi</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                            Tasks & Revisi Proyek
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Kelola to-do, permintaan revisi klien, dan perbaikan bug yang terhubung langsung ke proyek & GitHub repository Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        {/* View Switcher */}
                        <div className="flex items-center bg-white dark:bg-[#0c183b] p-1 rounded-lg border border-slate-200 dark:border-[#223974] shadow-2xs">
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    viewMode === 'list'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title="Tampilan Daftar"
                            >
                                <LayoutList className="w-3.5 h-3.5" />
                                <span>List</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('board')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    viewMode === 'board'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                                title="Tampilan Papan Kanban"
                            >
                                <Kanban className="w-3.5 h-3.5" />
                                <span>Board</span>
                            </button>
                        </div>

                        {/* Add Task Button */}
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all hover:shadow-md cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Tambah Tugas / Revisi</span>
                        </button>
                    </div>
                </div>

                {/* 2. Top Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total Tasks */}
                    <div className="bg-white dark:bg-[#0c183b] p-4 rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Tasks</p>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                                {stats.total || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Active Revisions (Special Highlight) */}
                    <div className="bg-white dark:bg-[#0c183b] p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 shadow-xs flex items-center gap-3.5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <RotateCcw className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Revisi Aktif</p>
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                                {stats.revisions || 0}
                            </h3>
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white dark:bg-[#0c183b] p-4 rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sedang Dikerjakan</p>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                                {stats.in_progress || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-white dark:bg-[#0c183b] p-4 rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Selesai</p>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                                {stats.completed || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Add Bar (Ultra-convenient) */}
                <form
                    onSubmit={handleQuickAdd}
                    className="bg-white dark:bg-[#0c183b] p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5"
                >
                    {/* Type Selector */}
                    <div className="w-full md:w-40 shrink-0">
                        <select
                            value={quickType}
                            onChange={(e) => setQuickType(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="revision">Revisi Proyek</option>
                            <option value="feature">Fitur Baru</option>
                            <option value="bugfix">Perbaikan Bug</option>
                            <option value="general">Tugas Umum</option>
                        </select>
                    </div>

                    {/* Title Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            required
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            placeholder="Tuliskan tugas atau revisi baru... (tekan Enter)"
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0f1f4b]"
                        />
                    </div>

                    {/* Project Selector (Direct Connection to Database Projects) */}
                    <div className="w-full md:w-48 shrink-0">
                        <select
                            value={quickProjectId}
                            onChange={(e) => setQuickProjectId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">-- Tanpa Proyek (Umum) --</option>
                            {projects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.name} {proj.github_repo_name ? `(${proj.github_repo_name})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Priority Selector */}
                    <div className="w-full md:w-32 shrink-0">
                        <select
                            value={quickPriority}
                            onChange={(e) => setQuickPriority(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmittingQuick || !quickTitle.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah</span>
                    </button>
                </form>

                {/* 4. Filter Bar & Search */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0c183b] p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs">
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari tugas, revisi, repo..."
                            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Type Filter */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#122352] p-1 rounded-lg">
                            {[
                                { id: 'all', label: 'Semua' },
                                { id: 'revision', label: 'Revisi' },
                                { id: 'feature', label: 'Fitur' },
                                { id: 'bugfix', label: 'Bug Fix' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedType(tab.id)}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                                        selectedType === tab.id
                                            ? 'bg-white dark:bg-[#1c3272] text-blue-600 dark:text-blue-300 shadow-2xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Status Filter */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-slate-100 dark:bg-[#122352] border border-transparent dark:border-[#243e80] rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                        >
                            <option value="all">Semua Status</option>
                            <option value="todo">Antrean (To Do)</option>
                            <option value="in_progress">Sedang Dikerjakan</option>
                            <option value="completed">Selesai</option>
                        </select>

                        {/* Project Filter */}
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="bg-slate-100 dark:bg-[#122352] border border-transparent dark:border-[#243e80] rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[180px] truncate"
                        >
                            <option value="all">Semua Proyek</option>
                            {projects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 5. Main Content: LIST VIEW or BOARD VIEW */}
                {viewMode === 'list' ? (
                    /* ================= LIST VIEW ================= */
                    <div className="bg-white dark:bg-[#0c183b] rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs overflow-hidden">
                        {filteredTasks.length === 0 ? (
                            <div className="py-16 text-center space-y-3">
                                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <CheckSquare className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                                    Belum ada tugas atau revisi
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                    Tambahkan tugas baru melalui bar di atas untuk memulai tracking pengerjaan dan revisi proyek Anda.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-[#1b2b5a]">
                                {filteredTasks.map((task) => {
                                    const typeConf = getTypeConfig(task.type);
                                    const isDone = task.status === 'completed';
                                    const TypeIcon = typeConf.icon;

                                    return (
                                        <div
                                            key={task.id}
                                            className={`p-4 sm:px-5 flex items-start gap-3.5 hover:bg-slate-50/70 dark:hover:bg-[#122352]/40 transition-colors group ${
                                                isDone ? 'bg-slate-50/40 dark:bg-[#09122c]/40' : ''
                                            }`}
                                        >
                                            {/* Completion Checkbox */}
                                            <div className="pt-0.5">
                                                <Checkbox
                                                    checked={isDone}
                                                    onChange={() => handleToggleTask(task.id)}
                                                    size="md"
                                                />
                                            </div>

                                            {/* Main Information */}
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                {/* Top Meta Line: Badges */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {/* Type Badge */}
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${typeConf.bg}`}>
                                                        <TypeIcon className="w-3 h-3" />
                                                        <span>{typeConf.label}</span>
                                                    </span>

                                                    {/* Priority Badge */}
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityConfig(task.priority)}`}>
                                                        {task.priority}
                                                    </span>

                                                    {/* Related Project Badge (Direct Connection!) */}
                                                    {task.project ? (
                                                        <Link
                                                            href={`/projects/${task.project.slug || task.project.id}`}
                                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-[#182c66] text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-[#223974] transition-colors"
                                                        >
                                                            <Folder className="w-3 h-3 text-blue-500" />
                                                            <span>{task.project.name}</span>
                                                        </Link>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                            Umum
                                                        </span>
                                                    )}

                                                    {/* Related GitHub Repository Badge */}
                                                    {task.project?.github_repo_name && (
                                                        <a
                                                            href={task.project.github_repo_url || `https://github.com/${task.project.github_repo_name}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                                            title={`Buka repositori GitHub ${task.project.github_repo_name}`}
                                                        >
                                                            <GithubIcon className="w-3 h-3" />
                                                            <span className="font-mono">{task.project.github_repo_name}</span>
                                                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                                        </a>
                                                    )}

                                                    {/* Due Date */}
                                                    {task.due_date && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 ml-auto">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{task.due_date}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Task Title */}
                                                <h4 className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug transition-all ${
                                                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                                }`}>
                                                    {task.title}
                                                </h4>

                                                {/* Description */}
                                                {task.description && (
                                                    <p className={`text-xs leading-relaxed max-w-3xl ${
                                                        isDone ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                                                    }`}>
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(task)}
                                                    className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                    title="Edit Tugas"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                                    title="Hapus Tugas"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* ================= BOARD (KANBAN) VIEW ================= */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'todo', title: 'Antrean (To Do)', color: 'border-slate-300 dark:border-slate-700', bgHeader: 'bg-slate-100 dark:bg-slate-800' },
                            { id: 'in_progress', title: 'Sedang Dikerjakan', color: 'border-blue-300 dark:border-blue-900', bgHeader: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300' },
                            { id: 'completed', title: 'Selesai', color: 'border-emerald-300 dark:border-emerald-900', bgHeader: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300' },
                        ].map((col) => {
                            const colTasks = filteredTasks.filter((t) => t.status === col.id);

                            return (
                                <div
                                    key={col.id}
                                    className="bg-white dark:bg-[#0c183b] rounded-xl border border-slate-200/80 dark:border-[#223974] shadow-xs flex flex-col h-full min-h-[450px]"
                                >
                                    {/* Column Header */}
                                    <div className={`px-4 py-3 border-b border-slate-100 dark:border-[#1b2b5a] flex items-center justify-between font-bold text-xs rounded-t-xl ${col.bgHeader}`}>
                                        <span>{col.title}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-[11px] shadow-2xs font-extrabold">
                                            {colTasks.length}
                                        </span>
                                    </div>

                                    {/* Column Tasks */}
                                    <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                                        {colTasks.length === 0 ? (
                                            <div className="py-10 text-center text-xs text-slate-400">
                                                Tidak ada tugas
                                            </div>
                                        ) : (
                                            colTasks.map((task) => {
                                                const typeConf = getTypeConfig(task.type);

                                                return (
                                                    <div
                                                        key={task.id}
                                                        className="bg-slate-50 dark:bg-[#122352] p-3.5 rounded-lg border border-slate-200/90 dark:border-[#243e80] shadow-xs hover:shadow-md transition-all space-y-2 group"
                                                    >
                                                        {/* Badges */}
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${typeConf.bg}`}>
                                                                {typeConf.label}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getPriorityConfig(task.priority)}`}>
                                                                {task.priority}
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                            {task.title}
                                                        </h5>

                                                        {/* Related Project */}
                                                        {task.project && (
                                                            <div className="text-[11px] text-slate-500 dark:text-slate-300 flex items-center gap-1 truncate font-medium">
                                                                <Folder className="w-3 h-3 text-blue-500 shrink-0" />
                                                                <span className="truncate">{task.project.name}</span>
                                                            </div>
                                                        )}

                                                        {/* Bottom Actions */}
                                                        <div className="pt-2 border-t border-slate-200/60 dark:border-[#1e346e] flex items-center justify-between text-[11px]">
                                                            {task.due_date ? (
                                                                <span className="text-slate-400 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{task.due_date}</span>
                                                                </span>
                                                            ) : <span />}

                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleTask(task.id)}
                                                                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-[#1c3272] border border-slate-200 dark:border-[#2c4794] text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
                                                                >
                                                                    {task.status === 'completed' ? 'Kembalikan' : 'Selesai'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditModal(task)}
                                                                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Tambah / Edit Tugas */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
                    onClick={() => setIsModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="relative bg-white dark:bg-[#0c183b] border border-slate-200 dark:border-[#223974] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#1b2b5a]">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingTask ? 'Edit Tugas / Revisi' : 'Tambah Tugas / Revisi Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveModal} className="p-5 space-y-4">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Judul Tugas / Revisi *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={modalForm.title}
                                    onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                                    placeholder="Contoh: Revisi warna tombol navbar di mobile"
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Project Connection (Direct Relational Link) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Terkait dengan Proyek (Database Projects)
                                </label>
                                <select
                                    value={modalForm.project_id}
                                    onChange={(e) => setModalForm({ ...modalForm, project_id: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="">-- Tanpa Proyek (Umum) --</option>
                                    {projects.map((proj) => (
                                        <option key={proj.id} value={proj.id}>
                                            {proj.name} {proj.github_repo_name ? `(${proj.github_repo_name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Two Columns: Type & Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                        Tipe Pekerjaan *
                                    </label>
                                    <select
                                        value={modalForm.type}
                                        onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="revision">Revisi Proyek</option>
                                        <option value="feature">Pengerjaan Fitur</option>
                                        <option value="bugfix">Perbaikan Bug</option>
                                        <option value="general">Tugas Umum</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                        Tingkat Prioritas *
                                    </label>
                                    <select
                                        value={modalForm.priority}
                                        onChange={(e) => setModalForm({ ...modalForm, priority: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="Urgent">Urgent</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            {/* Two Columns: Status & Due Date */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                        Status Pengerjaan *
                                    </label>
                                    <select
                                        value={modalForm.status}
                                        onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="todo">Antrean (To Do)</option>
                                        <option value="in_progress">Sedang Dikerjakan</option>
                                        <option value="completed">Selesai</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                        Tenggat Waktu (Due Date)
                                    </label>
                                    <input
                                        type="date"
                                        value={modalForm.due_date}
                                        onChange={(e) => setModalForm({ ...modalForm, due_date: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Catatan / Detail Tambahan
                                </label>
                                <textarea
                                    rows={3}
                                    value={modalForm.description}
                                    onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                                    placeholder="Tuliskan catatan revisi dari klien atau detail instruksi perbaikan..."
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-lg p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1b2b5a]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                                >
                                    {editingTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

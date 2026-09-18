import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from '@/Components/Modal';
import CustomSelect from '@/Components/CustomSelect';
import LoadingOverlay from '@/Components/LoadingOverlay';
import Checkbox from '@/Components/Checkbox';
import { toast } from 'sonner';
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

const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Status' },
    { value: 'todo', label: 'Antrean (To Do)' },
    { value: 'in_progress', label: 'Sedang Dikerjakan' },
    { value: 'completed', label: 'Selesai' },
];

const TASK_TYPE_OPTIONS = [
    { value: 'revision', label: 'Revisi Proyek' },
    { value: 'feature', label: 'Pengerjaan Fitur' },
    { value: 'bugfix', label: 'Perbaikan Bug' },
    { value: 'general', label: 'Tugas Umum' },
];

const QUICK_TYPE_OPTIONS = [
    { value: 'revision', label: 'Revisi Proyek' },
    { value: 'feature', label: 'Fitur Baru' },
    { value: 'bugfix', label: 'Perbaikan Bug' },
    { value: 'general', label: 'Tugas Umum' },
];

const TASK_PRIORITY_OPTIONS = [
    { value: 'Urgent', label: 'Urgent (Mendesak)' },
    { value: 'High', label: 'High (Tinggi)' },
    { value: 'Medium', label: 'Medium (Sedang)' },
    { value: 'Low', label: 'Low (Rendah)' },
];

const TASK_STATUS_OPTIONS = [
    { value: 'todo', label: 'Antrean (To Do)' },
    { value: 'in_progress', label: 'Sedang Dikerjakan' },
    { value: 'completed', label: 'Selesai' },
];

export default function Tasks({ tasks = [], projects = [], stats = {}, filters = {}, flash = {} }) {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedProject, setSelectedProject] = useState(filters.project_id || 'all');

    // Quick Add input state
    const [quickTitle, setQuickTitle] = useState('');
    const [quickType, setQuickType] = useState('revision');
    const [quickProjectId, setQuickProjectId] = useState(projects[0]?.id ? String(projects[0].id) : '');
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

    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Global loading overlay state
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Derived project options for CustomSelect with Live Search
    const projectFilterOptions = [
        { value: 'all', label: 'Semua Proyek' },
        ...projects.map((p) => ({
            value: String(p.id),
            label: `${p.name}${p.github_repo_name ? ` (${p.github_repo_name})` : ''}`,
        })),
    ];

    const quickProjectOptions = [
        { value: '', label: '-- Tanpa Proyek (Umum) --' },
        ...projects.map((p) => ({
            value: String(p.id),
            label: `${p.name}${p.github_repo_name ? ` (${p.github_repo_name})` : ''}`,
        })),
    ];

    const modalProjectOptions = [
        { value: '', label: '-- Tanpa Proyek (Umum) --' },
        ...projects.map((p) => ({
            value: String(p.id),
            label: `${p.name}${p.github_repo_name ? ` (${p.github_repo_name})` : ''}`,
        })),
    ];

    // Handle quick submit
    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!quickTitle.trim()) return;

        setIsSubmittingQuick(true);
        router.post('/tasks', {
            title: quickTitle.trim(),
            type: quickType,
            project_id: quickProjectId ? Number(quickProjectId) : null,
            priority: quickPriority,
            status: 'todo',
            due_date: quickDueDate || null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setQuickTitle('');
                setQuickDueDate('');
                setIsSubmittingQuick(false);
                toast.success('Tugas baru berhasil ditambahkan!');
            },
            onError: () => {
                setIsSubmittingQuick(false);
                toast.error('Gagal menambahkan tugas cepat.');
            },
        });
    };

    // Toggle completion
    const handleToggleTask = (taskId) => {
        router.post(`/tasks/${taskId}/toggle`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Status tugas berhasil diperbarui.');
            },
            onError: () => {
                toast.error('Gagal memperbarui status tugas.');
            },
        });
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingTask(null);
        setModalForm({
            title: '',
            description: '',
            project_id: projects[0]?.id ? String(projects[0].id) : '',
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
            project_id: task.project_id ? String(task.project_id) : '',
            type: task.type,
            priority: task.priority,
            status: task.status,
            due_date: task.due_date || '',
        });
        setIsModalOpen(true);
    };

    // Save Modal submit
    const handleSaveModal = (e) => {
        e.preventDefault();
        if (!modalForm.title.trim()) return;

        // Close modal first, then trigger centered loading modal overlay
        setIsModalOpen(false);
        setIsSaving(true);

        const endpoint = editingTask ? `/tasks/${editingTask.id}/update` : '/tasks';
        router.post(endpoint, {
            ...modalForm,
            project_id: modalForm.project_id ? Number(modalForm.project_id) : null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                toast.success(editingTask ? 'Perubahan tugas berhasil disimpan!' : 'Tugas baru berhasil ditambahkan!');
            },
            onError: () => {
                setIsSaving(false);
                setIsModalOpen(true);
                toast.error(editingTask ? 'Gagal menyimpan perubahan tugas.' : 'Gagal menambahkan tugas baru.');
            },
        });
    };

    // Open delete confirmation modal
    const openDeleteModal = (task) => {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    // Confirm and execute delete
    const handleConfirmDelete = () => {
        if (!taskToDelete?.id) return;

        // Close confirmation modal first, then open centered loading modal overlay
        setIsDeleteModalOpen(false);
        setIsDeleting(true);

        router.delete(`/tasks/${taskToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                setTaskToDelete(null);
                toast.success('Tugas berhasil dihapus.');
            },
            onError: () => {
                setIsDeleting(false);
                setIsDeleteModalOpen(true);
                toast.error('Gagal menghapus tugas.');
            },
        });
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

    const formatCompletedDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch (e) {
            return dateStr;
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
                        <div className="flex items-center bg-white dark:bg-[#0e1d47] p-1 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs">
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
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-all hover:shadow-sm cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Tambah Tugas / Revisi</span>
                        </button>
                    </div>
                </div>

                {/* 2. Top Metric Cards (Matches Dashboard style) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total Tasks */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Tasks</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.total || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Active Revisions (Special Highlight) */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-amber-200/80 dark:border-amber-900/50 shadow-xs flex items-center gap-3.5 hover:border-amber-300 dark:hover:border-amber-800 transition-colors relative overflow-hidden">
                        <div className="w-10 h-10 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <RotateCcw className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Revisi Aktif</p>
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.revisions || 0}
                            </h3>
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                        <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 fill-indigo-600/20" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sedang Dikerjakan</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.in_progress || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                        <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 fill-emerald-600/20" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Selesai</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.completed || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* 3. Quick Add Bar (Ultra-convenient) */}
                <form
                    onSubmit={handleQuickAdd}
                    className="bg-white dark:bg-[#0e1d47] p-3 sm:p-4 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2.5"
                >
                    {/* Type Selector */}
                    <div className="w-full md:w-44 shrink-0">
                        <CustomSelect
                            value={quickType}
                            onChange={(val) => setQuickType(val)}
                            options={QUICK_TYPE_OPTIONS}
                            buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                        />
                    </div>

                    {/* Title Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            required
                            value={quickTitle}
                            onChange={(e) => setQuickTitle(e.target.value)}
                            placeholder="Tuliskan tugas atau revisi baru... (tekan Enter)"
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#0f1f4b]"
                        />
                    </div>

                    {/* Project Selector with Live Search */}
                    <div className="w-full md:w-56 shrink-0">
                        <CustomSelect
                            value={String(quickProjectId)}
                            onChange={(val) => setQuickProjectId(val)}
                            options={quickProjectOptions}
                            placeholder="-- Pilih Proyek --"
                            searchable={true}
                            searchPlaceholder="Cari proyek..."
                            buttonClassName="!py-2 !px-3 !text-xs"
                        />
                    </div>

                    {/* Priority Selector */}
                    <div className="w-full md:w-36 shrink-0">
                        <CustomSelect
                            value={quickPriority}
                            onChange={(val) => setQuickPriority(val)}
                            options={TASK_PRIORITY_OPTIONS}
                            buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmittingQuick || !quickTitle.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isSubmittingQuick ? 'Menambahkan...' : 'Tambah'}</span>
                    </button>
                </form>

                {/* 4. Filter Bar & Search */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0e1d47] p-3 sm:p-4 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs">
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari tugas, revisi, repo..."
                            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Type Filter Pills */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#122352] p-1 rounded-md">
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
                        <div className="w-36">
                            <CustomSelect
                                value={selectedStatus}
                                onChange={(val) => setSelectedStatus(val)}
                                options={STATUS_FILTER_OPTIONS}
                                buttonClassName="!py-1.5 !px-2.5 !text-xs font-semibold"
                            />
                        </div>

                        {/* Project Filter with Live Search */}
                        <div className="w-52">
                            <CustomSelect
                                value={String(selectedProject)}
                                onChange={(val) => setSelectedProject(val)}
                                options={projectFilterOptions}
                                searchable={true}
                                searchPlaceholder="Cari proyek..."
                                buttonClassName="!py-1.5 !px-2.5 !text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* 5. Tasks View (List or Board) */}
                {viewMode === 'list' ? (
                    /* ================= LIST VIEW ================= */
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs overflow-hidden">
                        {filteredTasks.length === 0 ? (
                            <div className="p-12 text-center space-y-3">
                                <div className="w-12 h-12 mx-auto rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <CheckSquare className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    Tidak ada tugas yang cocok
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                    Coba ubah kata kunci pencarian atau filter kategori/proyek di atas.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredTasks.map((task) => {
                                    const isDone = task.status === 'completed';
                                    const typeConf = getTypeConfig(task.type);
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
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${typeConf.bg}`}>
                                                        <TypeIcon className="w-3 h-3" />
                                                        <span>{typeConf.label}</span>
                                                    </span>

                                                    {/* Priority Badge */}
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityConfig(task.priority)}`}>
                                                        {task.priority}
                                                    </span>

                                                    {/* Related Project Badge */}
                                                    {task.project ? (
                                                        <Link
                                                            href={`/projects/${task.project.slug || task.project.id}`}
                                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            <Folder className="w-3 h-3" />
                                                            <span>{task.project.name}</span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400">Umum</span>
                                                    )}

                                                    {/* GitHub Repo Badge */}
                                                    {task.project && task.project.github_repo_name && (
                                                        <a
                                                            href={`https://github.com/${task.project.github_repo_name}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                                                            title="Buka Repositori GitHub"
                                                        >
                                                            <GithubIcon className="w-3 h-3" />
                                                            <span>{task.project.github_repo_name}</span>
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h4 className={`text-sm sm:text-base font-bold leading-snug ${
                                                    isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                    {task.title}
                                                </h4>

                                                {/* Description */}
                                                {task.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {task.description}
                                                    </p>
                                                )}

                                                {/* Bottom Meta */}
                                                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-0.5">
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Target: {task.due_date}</span>
                                                        </span>
                                                    )}
                                                    {isDone && task.completed_at && (
                                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            <span>Selesai pada {formatCompletedDate(task.completed_at)}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
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
                                                    onClick={() => openDeleteModal(task)}
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
                            { id: 'todo', title: 'Antrean (To Do)', color: 'border-slate-300 dark:border-[#243e80]' },
                            { id: 'in_progress', title: 'Sedang Dikerjakan', color: 'border-blue-500' },
                            { id: 'completed', title: 'Selesai', color: 'border-emerald-500' },
                        ].map((col) => {
                            const colTasks = filteredTasks.filter((t) => t.status === col.id);

                            return (
                                <div
                                    key={col.id}
                                    className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col min-h-[500px]"
                                >
                                    {/* Column Header */}
                                    <div className={`p-3.5 border-b border-slate-100 dark:border-[#17254d] border-t-2 ${col.color} flex items-center justify-between`}>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                                {col.title}
                                            </h4>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#172b60] text-slate-600 dark:text-slate-300">
                                                {colTasks.length}
                                            </span>
                                        </div>
                                        {col.id === 'todo' && (
                                            <button
                                                type="button"
                                                onClick={openAddModal}
                                                className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Tambah ke Antrean"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Cards Container */}
                                    <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-[700px]">
                                        {colTasks.length === 0 ? (
                                            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-[#1e346e] rounded-md">
                                                Tidak ada tugas
                                            </div>
                                        ) : (
                                            colTasks.map((task) => {
                                                const typeConf = getTypeConfig(task.type);

                                                return (
                                                    <div
                                                        key={task.id}
                                                        className="bg-slate-50 dark:bg-[#122352] p-3.5 rounded-md border border-slate-200/90 dark:border-[#243e80] shadow-xs hover:shadow-sm transition-all space-y-2 group"
                                                    >
                                                        {/* Badges */}
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${typeConf.bg}`}>
                                                                {typeConf.label}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${getPriorityConfig(task.priority)}`}>
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
                                                            {task.status === 'completed' && task.completed_at ? (
                                                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                    <span>Selesai {formatCompletedDate(task.completed_at)}</span>
                                                                </span>
                                                            ) : task.due_date ? (
                                                                <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>Target: {task.due_date}</span>
                                                                </span>
                                                            ) : <span />}

                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleTask(task.id)}
                                                                    className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-white dark:bg-[#1c3272] border border-slate-200 dark:border-[#2c4794] text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
                                                                >
                                                                    {task.status === 'completed' ? 'Kembalikan' : 'Selesai'}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditModal(task)}
                                                                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                                                    title="Edit Tugas"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openDeleteModal(task)}
                                                                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                                                    title="Hapus Tugas"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* Modal: Tambah / Edit Tugas */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTask ? 'Edit Tugas / Revisi' : 'Tambah Tugas / Revisi Baru'}
                description={editingTask ? 'Perbarui informasi tugas dan hubungkan dengan proyek.' : 'Buat kartu tugas baru untuk dipantau di Kanban dan List view.'}
                icon={editingTask ? Edit3 : Plus}
                maxWidth="lg"
            >
                <form onSubmit={handleSaveModal} className="space-y-4">
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
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Project Connection (Direct Relational Link) with Live Search */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                            Terkait dengan Proyek (Database Projects)
                        </label>
                        <CustomSelect
                            value={String(modalForm.project_id || '')}
                            onChange={(val) => setModalForm({ ...modalForm, project_id: val })}
                            options={modalProjectOptions}
                            placeholder="-- Tanpa Proyek (Umum) --"
                            searchable={true}
                            searchPlaceholder="Cari nama atau repo proyek..."
                            buttonClassName="!py-2 !px-3.5 !text-xs sm:!text-sm"
                        />
                    </div>

                    {/* Two Columns: Type & Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Tipe Pekerjaan *
                            </label>
                            <CustomSelect
                                value={modalForm.type}
                                onChange={(val) => setModalForm({ ...modalForm, type: val })}
                                options={TASK_TYPE_OPTIONS}
                                buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Tingkat Prioritas *
                            </label>
                            <CustomSelect
                                value={modalForm.priority}
                                onChange={(val) => setModalForm({ ...modalForm, priority: val })}
                                options={TASK_PRIORITY_OPTIONS}
                                buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                            />
                        </div>
                    </div>

                    {/* Two Columns: Status & Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Status Pengerjaan *
                            </label>
                            <CustomSelect
                                value={modalForm.status}
                                onChange={(val) => setModalForm({ ...modalForm, status: val })}
                                options={TASK_STATUS_OPTIONS}
                                buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Target Deadline (Opsional)
                            </label>
                            <input
                                type="date"
                                value={modalForm.due_date}
                                onChange={(e) => setModalForm({ ...modalForm, due_date: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
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
                            className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-2 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isSaving ? 'Menyimpan...' : editingTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Konfirmasi Hapus Tugas */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Tugas"
                icon={Trash2}
                maxWidth="md"
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200">
                                Apakah Anda yakin ingin menghapus tugas ini?
                            </h4>
                            <p className="text-xs text-rose-700/90 dark:text-rose-300/80 leading-relaxed">
                                Tugas{' '}
                                <strong className="font-semibold text-rose-950 dark:text-rose-100">
                                    "{taskToDelete?.title || 'Tugas'}"
                                </strong>{' '}
                                akan dihapus secara permanen dari sistem.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Ya, Hapus Tugas</span>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Global Full-Screen Loading Overlay for CRUD */}
            <LoadingOverlay
                show={isSaving || isDeleting}
                fullScreen={true}
                message={
                    isSaving
                        ? editingTask ? 'Menyimpan perubahan tugas...' : 'Menambahkan tugas baru...'
                        : 'Menghapus tugas...'
                }
                description={
                    isSaving
                        ? 'Memperbarui data dan status tugas di server'
                        : 'Menghapus data tugas dari sistem'
                }
            />
        </DashboardLayout>
    );
}

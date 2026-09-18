import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Home,
    Plus,
    Search,
    ChevronDown,
    FileText,
    Settings,
    Users,
    AlertCircle,
    BookOpen,
    Lightbulb,
    Trash2,
    Bold,
    Italic,
    List,
    ListOrdered,
    Code,
    Quote,
    Check,
    Folder,
    Copy,
    Save,
    RotateCcw,
    Sparkles,
    Calendar,
    X,
} from 'lucide-react';

export default function Notes({
    notes = [],
    projects = [],
    stats = { total: 0, revisions: 0, ideas: 0, meetings: 0 },
    filters = { search: '', category: 'all', project_id: 'all' },
    flash = {},
}) {
    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedProject, setSelectedProject] = useState(filters.project_id || 'all');

    // Active Note for viewing & editing
    const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);

    // Form state for active note editor
    const activeNote = notes.find((n) => n.id === selectedNoteId) || null;
    const [editorForm, setEditorForm] = useState({
        title: '',
        category: 'Revision',
        project_id: '',
        content: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [copiedNotice, setCopiedNotice] = useState(false);

    // Modal state for creating a new note
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        title: '',
        category: 'Revision',
        project_id: '',
        content: '',
    });
    const [isCreating, setIsCreating] = useState(false);

    // Synchronize active note into editorForm whenever selectedNoteId or notes change
    useEffect(() => {
        if (activeNote) {
            setEditorForm({
                title: activeNote.title || '',
                category: activeNote.category || 'Revision',
                project_id: activeNote.project_id ? String(activeNote.project_id) : '',
                content: activeNote.content || '',
            });
            setHasUnsavedChanges(false);
        } else if (notes.length > 0) {
            setSelectedNoteId(notes[0].id);
        }
    }, [selectedNoteId, notes]);

    // Handle filter queries with Inertia visit
    const applyFilters = (search, category, projectId) => {
        router.get(
            '/notes',
            {
                search: search || undefined,
                category: category !== 'all' ? category : undefined,
                project_id: projectId !== 'all' ? projectId : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        applyFilters(val, selectedCategory, selectedProject);
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setSelectedCategory(val);
        applyFilters(searchQuery, val, selectedProject);
    };

    const handleProjectChange = (e) => {
        const val = e.target.value;
        setSelectedProject(val);
        applyFilters(searchQuery, selectedCategory, val);
    };

    // Category style helpers
    const getCategoryConfig = (cat) => {
        switch (cat) {
            case 'Revision':
                return {
                    label: 'Revisi',
                    bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
                    icon: RotateCcw,
                };
            case 'Idea':
                return {
                    label: 'Ide Fitur',
                    bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
                    icon: Lightbulb,
                };
            case 'Meeting':
                return {
                    label: 'Meeting',
                    bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60',
                    icon: Users,
                };
            case 'Technical':
                return {
                    label: 'Teknis',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
                    icon: Settings,
                };
            default:
                return {
                    label: 'Umum',
                    bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                    icon: FileText,
                };
        }
    };

    // Date formatter
    const formatDate = (dateStr) => {
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

    // Create New Note submit
    const handleCreateNote = (e) => {
        e.preventDefault();
        if (!createForm.title.trim()) return;

        setIsCreating(true);
        router.post('/notes', {
            title: createForm.title.trim(),
            category: createForm.category,
            project_id: createForm.project_id || null,
            content: createForm.content || '',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setCreateForm({
                    title: '',
                    category: 'Revision',
                    project_id: '',
                    content: '',
                });
                setIsCreating(false);
            },
            onError: () => {
                setIsCreating(false);
            },
        });
    };

    // Save Active Note edits
    const handleSaveActiveNote = (e) => {
        if (e) e.preventDefault();
        if (!activeNote) return;

        setIsSaving(true);
        router.post(`/notes/${activeNote.id}/update`, {
            title: editorForm.title.trim() || activeNote.title,
            category: editorForm.category,
            project_id: editorForm.project_id || null,
            content: editorForm.content,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setHasUnsavedChanges(false);
            },
            onError: () => {
                setIsSaving(false);
            },
        });
    };

    // Delete Active Note
    const handleDeleteNote = (id) => {
        if (!id) return;
        if (confirm('Yakin ingin menghapus catatan ini?')) {
            router.delete(`/notes/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    const remaining = notes.filter((n) => n.id !== id);
                    if (remaining.length > 0) {
                        setSelectedNoteId(remaining[0].id);
                    } else {
                        setSelectedNoteId(null);
                    }
                },
            });
        }
    };

    // Copy Content to clipboard
    const handleCopyContent = () => {
        if (!editorForm.content) return;
        navigator.clipboard.writeText(editorForm.content);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2000);
    };

    // Quick formatting insertion in editor textarea
    const insertFormat = (prefix, suffix = '') => {
        const textarea = document.getElementById('note-editor-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = editorForm.content;
        const selected = text.substring(start, end);
        const replacement = `${prefix}${selected || 'teks'}${suffix}`;

        const newContent = text.substring(0, start) + replacement + text.substring(end);
        setEditorForm({ ...editorForm, content: newContent });
        setHasUnsavedChanges(true);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
        }, 10);
    };

    return (
        <DashboardLayout activePage="Notes">
            <Head title="Catatan & Revisi - WorkTrack" />

            <div className="space-y-6 w-full">
                {/* 1. Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                                <Home className="w-3.5 h-3.5" />
                                <span>Home</span>
                            </Link>
                            <span>/</span>
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">Notes & Dokumen</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                            Catatan & Revisi Mentah
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Tampung ide, instruksi meeting, dan catatan revisi panjang dari klien sebelum dipilah menjadi task.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-all hover:shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Catatan Baru</span>
                    </button>
                </div>

                {/* 2. Stat Cards (Matches Dashboard style) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total Notes */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Catatan</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.total || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Revisions Count */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-amber-200/80 dark:border-amber-900/50 shadow-xs flex items-center gap-3.5 hover:border-amber-300 dark:hover:border-amber-800 transition-colors">
                        <div className="w-10 h-10 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <RotateCcw className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Catatan Revisi</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.revisions || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Ideas Count */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                        <div className="w-10 h-10 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-5 h-5 fill-indigo-600/20" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ide & Konsep</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.ideas || 0}
                            </h3>
                        </div>
                    </div>

                    {/* Meetings Count */}
                    <div className="bg-white dark:bg-[#0e1d47] p-5 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                        <div className="w-10 h-10 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 fill-purple-600/20" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Diskusi / Meeting</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {stats.meetings || 0}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* 3. Main Workspace: 2-Column Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Left Column: List & Filter (4 cols on lg) */}
                    <div className="lg:col-span-4 space-y-3">
                        {/* Search & Filters */}
                        <div className="bg-white dark:bg-[#0e1d47] p-3 rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs space-y-2.5">
                            {/* Search */}
                            <div className="relative w-full">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Cari isi atau judul catatan..."
                                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Dropdowns: Category & Project */}
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer truncate"
                                >
                                    <option value="all">Semua Kategori</option>
                                    <option value="Revision">Revisi</option>
                                    <option value="Idea">Ide Fitur</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Technical">Teknis</option>
                                    <option value="General">Umum</option>
                                </select>

                                <select
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    className="bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer truncate"
                                >
                                    <option value="all">Semua Proyek</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* List of Notes */}
                        <div className="space-y-2 max-h-[680px] overflow-y-auto pr-0.5">
                            {notes.length === 0 ? (
                                <div className="bg-white dark:bg-[#0e1d47] p-8 rounded-lg border border-slate-200/80 dark:border-[#1e346e] text-center space-y-3">
                                    <div className="w-12 h-12 mx-auto rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Belum ada catatan tersimpan.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                                    >
                                        + Buat Catatan Pertama
                                    </button>
                                </div>
                            ) : (
                                notes.map((note) => {
                                    const isSelected = note.id === selectedNoteId;
                                    const catConf = getCategoryConfig(note.category);
                                    const CatIcon = catConf.icon;

                                    // Preview excerpt (strip HTML/newlines)
                                    const excerpt = note.content
                                        ? note.content.replace(/[\n\r]+/g, ' ').substring(0, 85)
                                        : 'Belum ada isi catatan...';

                                    return (
                                        <div
                                            key={note.id}
                                            onClick={() => setSelectedNoteId(note.id)}
                                            className={`p-3.5 rounded-lg border transition-all cursor-pointer shadow-xs ${
                                                isSelected
                                                    ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-500/80 dark:border-blue-500/80 ring-1 ring-blue-500/20'
                                                    : 'bg-white dark:bg-[#0e1d47] border-slate-200/80 dark:border-[#1e346e] hover:border-slate-300 dark:hover:border-[#2b4486]'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={`text-xs sm:text-sm font-bold truncate flex-1 ${
                                                    isSelected
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-slate-900 dark:text-white'
                                                }`}>
                                                    {note.title}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                                    {formatDate(note.updated_at)}
                                                </span>
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                                {excerpt}
                                            </p>

                                            {/* Badges: Category & Project */}
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${catConf.bg}`}>
                                                    <CatIcon className="w-2.5 h-2.5" />
                                                    <span>{catConf.label}</span>
                                                </span>

                                                {note.project ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 dark:bg-[#182c66] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/70 dark:border-[#223974] truncate max-w-[150px]">
                                                        <Folder className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                                                        <span className="truncate">{note.project.name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                        (Umum)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Column: Note Detail / Editor (8 cols on lg) */}
                    <div className="lg:col-span-8">
                        {activeNote ? (
                            <form
                                onSubmit={handleSaveActiveNote}
                                className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col min-h-[620px] overflow-hidden"
                            >
                                {/* Note Top Header / Meta Toolbar */}
                                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#17254d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#0b1739]">
                                    <div className="flex-1 space-y-2">
                                        {/* Editable Title */}
                                        <input
                                            type="text"
                                            value={editorForm.title}
                                            onChange={(e) => {
                                                setEditorForm({ ...editorForm, title: e.target.value });
                                                setHasUnsavedChanges(true);
                                            }}
                                            placeholder="Judul Catatan..."
                                            className="w-full bg-transparent text-base sm:text-lg font-bold text-slate-900 dark:text-white focus:outline-none border-b border-transparent focus:border-blue-500 pb-0.5"
                                        />

                                        {/* Meta Selectors: Category & Project */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Category Selector */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-[11px] text-slate-400 font-medium">Kategori:</span>
                                                <select
                                                    value={editorForm.category}
                                                    onChange={(e) => {
                                                        setEditorForm({ ...editorForm, category: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                                                >
                                                    <option value="Revision">Revisi Proyek</option>
                                                    <option value="Idea">Ide Fitur</option>
                                                    <option value="Meeting">Catatan Meeting</option>
                                                    <option value="Technical">Dokumentasi Teknis</option>
                                                    <option value="General">Catatan Umum</option>
                                                </select>
                                            </div>

                                            {/* Project Relation Selector */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-[11px] text-slate-400 font-medium">Proyek:</span>
                                                <select
                                                    value={editorForm.project_id}
                                                    onChange={(e) => {
                                                        setEditorForm({ ...editorForm, project_id: e.target.value });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    className="bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer max-w-[180px] truncate"
                                                >
                                                    <option value="">-- Tanpa Proyek (Umum) --</option>
                                                    {projects.map((proj) => (
                                                        <option key={proj.id} value={proj.id}>
                                                            {proj.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={handleCopyContent}
                                            title="Salin isi catatan"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                                        >
                                            {copiedNotice ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span>Tersalin!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>Salin</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                                                hasUnsavedChanges
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse'
                                                    : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                                            }`}
                                        >
                                            <Save className="w-3.5 h-3.5" />
                                            <span>{isSaving ? 'Menyimpan...' : hasUnsavedChanges ? 'Simpan *' : 'Simpan'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteNote(activeNote.id)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
                                            title="Hapus Catatan"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Text Formatting Quick Toolbar */}
                                <div className="px-4 py-2 bg-slate-50/90 dark:bg-[#0c183b] border-b border-slate-100 dark:border-[#17254d] flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('**', '**')}
                                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                                        title="Tebal (Bold)"
                                    >
                                        <Bold className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('*', '*')}
                                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                                        title="Miring (Italic)"
                                    >
                                        <Italic className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                                    <button
                                        type="button"
                                        onClick={() => insertFormat('- ')}
                                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                                        title="Poin List"
                                    >
                                        <List className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('1. ')}
                                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                                        title="Nomor Urut"
                                    >
                                        <ListOrdered className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                                    <button
                                        type="button"
                                        onClick={() => insertFormat('`', '`')}
                                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                                        title="Potongan Kode (Inline Code)"
                                    >
                                        <Code className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('> ')}
                                        className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors"
                                        title="Kutipan (Quote)"
                                    >
                                        <Quote className="w-3.5 h-3.5" />
                                    </button>

                                    <span className="text-[11px] text-slate-400 ml-auto hidden sm:inline">
                                        Terakhir diupdate: {formatDate(activeNote.updated_at)}
                                    </span>
                                </div>

                                {/* Textarea Editor Area */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                                    <textarea
                                        id="note-editor-textarea"
                                        value={editorForm.content}
                                        onChange={(e) => {
                                            setEditorForm({ ...editorForm, content: e.target.value });
                                            setHasUnsavedChanges(true);
                                        }}
                                        placeholder="Ketik catatan revisi, instruksi klien, atau dokumentasi bebas di sini..."
                                        rows={18}
                                        className="w-full flex-1 bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none font-sans"
                                    />
                                </div>
                            </form>
                        ) : (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-12 text-center shadow-xs">
                                <div className="w-16 h-16 mx-auto rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4">
                                    Pilih atau Buat Catatan Baru
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                                    Pilih catatan dari daftar sebelah kiri untuk melihat detailnya, atau buat catatan baru.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Buat Catatan Baru</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Tambah Catatan Baru */}
            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
                    onClick={() => setIsCreateModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="relative bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#1e346e] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1b2b5a]">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Tambah Catatan Baru
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateNote} className="p-6 space-y-4">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Judul Catatan *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.title}
                                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                    placeholder="Contoh: Catatan Revisi Desain Navbar"
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Project Connection (Optional) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Terkait Proyek (Opsional)
                                </label>
                                <select
                                    value={createForm.project_id}
                                    onChange={(e) => setCreateForm({ ...createForm, project_id: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="">-- Tanpa Proyek (Catatan Umum) --</option>
                                    {projects.map((proj) => (
                                        <option key={proj.id} value={proj.id}>
                                            {proj.name} {proj.github_repo_name ? `(${proj.github_repo_name})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Kategori Catatan *
                                </label>
                                <select
                                    value={createForm.category}
                                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="Revision">Revisi Proyek</option>
                                    <option value="Idea">Ide Fitur</option>
                                    <option value="Meeting">Catatan Meeting</option>
                                    <option value="Technical">Dokumentasi Teknis</option>
                                    <option value="General">Catatan Umum</option>
                                </select>
                            </div>

                            {/* Content Textarea */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                    Isi Catatan / Poin Revisi
                                </label>
                                <textarea
                                    rows={5}
                                    value={createForm.content}
                                    onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                                    placeholder="Tuliskan catatan revisi panjang dari WhatsApp, email, atau instruksi meeting..."
                                    className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md p-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1b2b5a]">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-5 py-2 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isCreating ? 'Menyimpan...' : 'Buat Catatan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from '@/Components/Modal';
import CustomSelect from '@/Components/CustomSelect';
import LoadingOverlay from '@/Components/LoadingOverlay';
import Checkbox from '@/Components/Checkbox';
import { toast } from 'sonner';
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
    ListTodo,
    CheckSquare,
    Square,
    ArrowUpRight,
    ArrowRight,
} from 'lucide-react';

const CATEGORY_FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Revision', label: 'Revisi' },
    { value: 'Idea', label: 'Ide Fitur' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Technical', label: 'Teknis' },
    { value: 'General', label: 'Umum' },
];

const CATEGORY_SELECT_OPTIONS = [
    { value: 'Revision', label: 'Revisi Proyek' },
    { value: 'Idea', label: 'Ide Fitur' },
    { value: 'Meeting', label: 'Catatan Meeting' },
    { value: 'Technical', label: 'Dokumentasi Teknis' },
    { value: 'General', label: 'Catatan Umum' },
];

const TASK_TYPE_OPTIONS = [
    { value: 'revision', label: 'Revisi Proyek' },
    { value: 'feature', label: 'Fitur Baru' },
    { value: 'bugfix', label: 'Perbaikan Bug' },
    { value: 'general', label: 'Tugas Umum' },
];

const TASK_PRIORITY_OPTIONS = [
    { value: 'Medium', label: 'Sedang (Medium)' },
    { value: 'High', label: 'Tinggi (High)' },
    { value: 'Urgent', label: 'Mendesak (Urgent)' },
    { value: 'Low', label: 'Rendah (Low)' },
];

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

    // Derived project options for CustomSelect
    const projectFilterOptions = [
        { value: 'all', label: 'Semua Proyek' },
        ...projects.map((p) => ({ value: String(p.id), label: p.name })),
    ];

    const editorProjectOptions = [
        { value: '', label: '-- Tanpa Proyek (Umum) --' },
        ...projects.map((proj) => ({ value: String(proj.id), label: proj.name })),
    ];

    const createProjectOptions = [
        { value: '', label: '-- Tanpa Proyek (Catatan Umum) --' },
        ...projects.map((proj) => ({
            value: String(proj.id),
            label: `${proj.name}${proj.github_repo_name ? ` (${proj.github_repo_name})` : ''}`,
        })),
    ];

    const targetProjectOptions = [
        { value: '', label: '-- Umum (Tanpa Proyek) --' },
        ...projects.map((proj) => ({ value: String(proj.id), label: proj.name })),
    ];

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
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [copiedNotice, setCopiedNotice] = useState(false);

    // AI Refinement states (Google Gemini)
    const [isRefiningAi, setIsRefiningAi] = useState(false);
    const [aiTarget, setAiTarget] = useState(null); // 'editor' | 'create'
    const [aiNotice, setAiNotice] = useState(null); // { type, message }
    const [undoBackup, setUndoBackup] = useState(null);

    // Modal state for sending note items to Tasks
    const [isSendTasksModalOpen, setIsSendTasksModalOpen] = useState(false);
    const [parsedTasks, setParsedTasks] = useState([]);
    const [targetProjectId, setTargetProjectId] = useState('');
    const [taskType, setTaskType] = useState('revision');
    const [taskPriority, setTaskPriority] = useState('Medium');
    const [useAiTaskDesc, setUseAiTaskDesc] = useState(false); // Default FALSE as requested
    const [isSendingToTasks, setIsSendingToTasks] = useState(false);

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

    const handleCategoryChange = (val) => {
        const resolvedVal = val?.target ? val.target.value : val;
        setSelectedCategory(resolvedVal);
        applyFilters(searchQuery, resolvedVal, selectedProject);
    };

    const handleProjectChange = (val) => {
        const resolvedVal = val?.target ? val.target.value : val;
        setSelectedProject(resolvedVal);
        applyFilters(searchQuery, selectedCategory, resolvedVal);
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

    // Open Create Note modal with synchronized project
    const handleOpenCreateModal = () => {
        let defaultProjectId = '';
        if (selectedProject && selectedProject !== 'all') {
            defaultProjectId = String(selectedProject);
        } else if (activeNote?.project_id) {
            defaultProjectId = String(activeNote.project_id);
        }

        setCreateForm({
            title: '',
            category: 'Revision',
            project_id: defaultProjectId,
            content: '',
            isManuallyUnlocked: false,
        });
        setIsCreateModalOpen(true);
    };

    // Create New Note submit
    const handleCreateNote = (e) => {
        e.preventDefault();
        if (!createForm.title.trim()) return;

        // Close modal first, then open centered loading modal overlay
        setIsCreateModalOpen(false);
        setIsCreating(true);

        router.post('/notes', {
            title: createForm.title.trim(),
            category: createForm.category,
            project_id: createForm.project_id || null,
            content: createForm.content || '',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setCreateForm({
                    title: '',
                    category: 'Revision',
                    project_id: '',
                    content: '',
                    isManuallyUnlocked: false,
                });
                setIsCreating(false);
                toast.success('Catatan baru berhasil dibuat!');
            },
            onError: () => {
                setIsCreating(false);
                setIsCreateModalOpen(true);
                toast.error('Gagal membuat catatan baru.');
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
                toast.success('Perubahan catatan berhasil disimpan!');
            },
            onError: () => {
                setIsSaving(false);
                toast.error('Gagal menyimpan perubahan catatan.');
            },
        });
    };

    // Open delete confirmation modal
    const handleOpenDeleteModal = (note = activeNote) => {
        if (!note) return;
        setNoteToDelete(note);
        setIsDeleteModalOpen(true);
    };

    // Confirm and execute note deletion
    const handleConfirmDelete = () => {
        const target = noteToDelete || activeNote;
        if (!target?.id) return;

        // Close modal first, then trigger centered loading modal overlay
        setIsDeleteModalOpen(false);
        setIsDeleting(true);

        router.delete(`/notes/${target.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                setNoteToDelete(null);
                const remaining = notes.filter((n) => n.id !== target.id);
                if (remaining.length > 0) {
                    setSelectedNoteId(remaining[0].id);
                } else {
                    setSelectedNoteId(null);
                }
                toast.success('Catatan berhasil dihapus.');
            },
            onError: () => {
                setIsDeleting(false);
                setIsDeleteModalOpen(true);
                toast.error('Gagal menghapus catatan.');
            },
        });
    };

    // Copy Content to clipboard
    const handleCopyContent = () => {
        if (!editorForm.content) return;
        navigator.clipboard.writeText(editorForm.content);
        setCopiedNotice(true);
        toast.success('Isi catatan berhasil disalin ke clipboard!');
        setTimeout(() => setCopiedNotice(false), 2000);
    };

    // AI Refine with Google Gemini
    const handleAiRefine = async (target = 'editor') => {
        const content = target === 'editor' ? editorForm.content : createForm.content;
        const title = target === 'editor' ? editorForm.title : createForm.title;

        if (!content || !content.trim()) {
            setAiNotice({
                type: 'error',
                message: 'Silakan tuliskan isi catatan terlebih dahulu sebelum dirapikan oleh AI.',
            });
            setTimeout(() => setAiNotice(null), 4000);
            return;
        }

        setIsRefiningAi(true);
        setAiTarget(target);
        setAiNotice(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/notes/ai-refine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();

            if (data.success && data.refined_content) {
                if (target === 'editor') {
                    setUndoBackup({
                        content: editorForm.content,
                        title: editorForm.title,
                    });
                    setEditorForm((prev) => ({
                        ...prev,
                        content: data.refined_content,
                        title: (!prev.title || prev.title.toLowerCase().includes('catatan baru') || prev.title.toLowerCase().includes('revisi')) && data.title ? data.title : prev.title,
                    }));
                    setHasUnsavedChanges(true);
                } else {
                    setCreateForm((prev) => ({
                        ...prev,
                        content: data.refined_content,
                        title: !prev.title && data.title ? data.title : prev.title,
                    }));
                }
                setAiNotice({
                    type: 'success',
                    message: 'Catatan berhasil dirapikan dan distrukturkan oleh Google Gemini AI!',
                });
                toast.success('Catatan berhasil dirapikan dengan AI Gemini!');
            } else {
                setAiNotice({
                    type: 'error',
                    message: data.message || 'Gagal memproses perapian catatan dengan AI.',
                });
                toast.error(data.message || 'Gagal merapikan catatan dengan AI.');
            }
        } catch (err) {
            setAiNotice({
                type: 'error',
                message: 'Terjadi kesalahan koneksi saat menghubungi AI: ' + err.message,
            });
            toast.error('Gagal menghubungi AI: ' + err.message);
        } finally {
            setIsRefiningAi(false);
            setAiTarget(null);
            setTimeout(() => setAiNotice(null), 8000);
        }
    };

    // Undo AI refinement
    const handleUndoRefine = () => {
        if (undoBackup) {
            setEditorForm((prev) => ({
                ...prev,
                content: undoBackup.content,
                title: undoBackup.title,
            }));
            setUndoBackup(null);
            setAiNotice({
                type: 'info',
                message: 'Isi catatan dikembalikan ke teks sebelum dirapikan AI.',
            });
            toast.info('Isi catatan dikembalikan ke versi sebelum dirapikan AI.');
            setTimeout(() => setAiNotice(null), 3000);
        }
    };

    // Parse note text into modular items for tasks
    const parseNoteItems = (content) => {
        if (!content || !content.trim()) return [];
        const lines = content.split('\n');
        const items = [];
        let currentItem = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) {
                if (currentItem && currentItem.rawDesc.length > 0) {
                    currentItem.rawDesc.push('');
                }
                continue;
            }

            // Check if line starts with numbered item like "1. " or "1) "
            const numMatch = line.match(/^(\d+)[.)]\s+(.+)/);
            // Check if line is a bold heading like "**Title**"
            const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)/);

            if (numMatch) {
                if (currentItem) {
                    items.push(finalizeParsedItem(currentItem, items.length + 1));
                }
                let titlePart = numMatch[2].trim();
                let subDesc = '';
                const innerBold = titlePart.match(/^\*\*(.+?)\*\*(.*)/);
                if (innerBold) {
                    titlePart = innerBold[1].trim();
                    subDesc = innerBold[2].trim();
                }

                currentItem = {
                    title: titlePart,
                    rawDesc: subDesc ? [subDesc] : [],
                };
            } else if (boldMatch && !line.startsWith('* ')) {
                if (currentItem) {
                    items.push(finalizeParsedItem(currentItem, items.length + 1));
                }
                currentItem = {
                    title: boldMatch[1].trim(),
                    rawDesc: boldMatch[2].trim() ? [boldMatch[2].trim()] : [],
                };
            } else if (currentItem) {
                currentItem.rawDesc.push(line);
            } else {
                currentItem = {
                    title: line.replace(/^[-*•]\s*/, ''),
                    rawDesc: [],
                };
            }
        }

        if (currentItem) {
            items.push(finalizeParsedItem(currentItem, items.length + 1));
        }

        return items.filter((it) => it.title && it.title.trim().length > 0);
    };

    const finalizeParsedItem = (item, index) => {
        let cleanTitle = item.title
            .replace(/\[Masuk Tasks\]|\(Masuk Tasks\)/gi, '')
            .replace(/^[*_#\s]+|[*_#\s]+$/g, '')
            .trim();
        if (!cleanTitle) cleanTitle = `Poin Revisi ${index}`;

        // Verify with active note tasks in database
        const isLinkedToActiveTask = (activeNote?.tasks || []).some((t) => {
            const tClean = t.title.toLowerCase().trim();
            return tClean === cleanTitle.toLowerCase() ||
                tClean.includes(cleanTitle.toLowerCase()) ||
                cleanTitle.toLowerCase().includes(tClean);
        });

        // If activeNote.tasks is available, use database relationship as source of truth
        const hasTag = activeNote?.tasks !== undefined
            ? isLinkedToActiveTask
            : (/\[Masuk Tasks\]|\(Masuk Tasks\)/i.test(item.title) ||
               item.rawDesc.some((d) => /\[Masuk Tasks\]|\(Masuk Tasks\)/i.test(d)));

        let cleanDesc = item.rawDesc
            .map((d) => d.replace(/\[Masuk Tasks\]|\(Masuk Tasks\)/gi, '').trim())
            .filter(Boolean)
            .join('\n')
            .trim();

        return {
            id: `item-${index}`,
            title: cleanTitle,
            description: cleanDesc,
            alreadyInTasks: hasTag,
            selected: !hasTag,
        };
    };

    // Open Send to Tasks Modal
    const handleOpenSendTasksModal = () => {
        if (!editorForm.content || !editorForm.content.trim()) {
            setAiNotice({
                type: 'error',
                message: 'Isi catatan masih kosong. Tulis catatan terlebih dahulu sebelum dikirim ke Tasks.',
            });
            setTimeout(() => setAiNotice(null), 3500);
            return;
        }

        const items = parseNoteItems(editorForm.content);
        if (items.length === 0) {
            setAiNotice({
                type: 'error',
                message: 'Tidak dapat menemukan poin revisi. Pastikan catatan memiliki format poin atau baris teks.',
            });
            setTimeout(() => setAiNotice(null), 3500);
            return;
        }

        setParsedTasks(items);
        // Automatically synchronize and lock project to active note's project
        setTargetProjectId(editorForm.project_id ? String(editorForm.project_id) : '');
        if (editorForm.category === 'Idea') {
            setTaskType('feature');
        } else if (editorForm.category === 'Revision') {
            setTaskType('revision');
        } else if (editorForm.category === 'Technical') {
            setTaskType('bugfix');
        } else {
            setTaskType('revision');
        }
        setTaskPriority('Medium');
        setUseAiTaskDesc(false);
        setIsSendTasksModalOpen(true);
    };

    // Toggle single item selection
    const handleToggleTaskItem = (index) => {
        setParsedTasks((prev) =>
            prev.map((item, idx) =>
                idx === index ? { ...item, selected: !item.selected } : item
            )
        );
    };

    // Select all / Deselect all
    const handleSelectAllTasks = (select) => {
        setParsedTasks((prev) => prev.map((item) => ({ ...item, selected: select })));
    };

    // Execute Send to Tasks
    const handleExecuteSendTasks = (e) => {
        e.preventDefault();
        const selectedItems = parsedTasks.filter((it) => it.selected);
        if (selectedItems.length === 0) {
            alert('Pilih minimal satu poin tugas yang ingin dikirim.');
            return;
        }

        // Close modal first, then open centered loading modal overlay
        setIsSendTasksModalOpen(false);
        setIsSendingToTasks(true);

        router.post(
            '/notes/send-to-tasks',
            {
                project_id: targetProjectId ? Number(targetProjectId) : null,
                note_id: activeNote?.id || null,
                task_type: taskType,
                priority: taskPriority,
                use_ai: useAiTaskDesc,
                items: selectedItems.map((it) => ({
                    title: it.title,
                    description: it.description,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSendingToTasks(false);

                    // Update editor content locally with [Masuk Tasks] tag for sent items
                    let newContent = editorForm.content;
                    selectedItems.forEach((it) => {
                        const rawTitle = it.title.trim();
                        if (!rawTitle) return;
                        const quoted = rawTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        if (
                            !new RegExp('\\*\\*' + quoted + '\\*\\*\\s*\\[Masuk Tasks\\]', 'i').test(newContent) &&
                            !new RegExp(quoted + '\\s*\\[Masuk Tasks\\]', 'i').test(newContent)
                        ) {
                            if (new RegExp('\\*\\*' + quoted + '\\*\\*', 'i').test(newContent)) {
                                newContent = newContent.replace(
                                    new RegExp('\\*\\*' + quoted + '\\*\\*', 'i'),
                                    `**${rawTitle}** [Masuk Tasks]`
                                );
                            } else {
                                newContent = newContent.replace(
                                    new RegExp(quoted, 'i'),
                                    `${rawTitle} [Masuk Tasks]`
                                );
                            }
                        }
                    });

                    setEditorForm((prev) => ({
                        ...prev,
                        content: newContent,
                    }));

                    setAiNotice({
                        type: 'success',
                        message: `${selectedItems.length} tugas berhasil dikirim ke Tasks dan ditandai [Masuk Tasks] di catatan!`,
                    });
                    toast.success(`${selectedItems.length} tugas berhasil dikirim ke halaman Tasks!`);
                    setTimeout(() => setAiNotice(null), 6000);
                },
                onError: (err) => {
                    setIsSendingToTasks(false);
                    setIsSendTasksModalOpen(true);
                    toast.error('Gagal mengirim ke tasks: ' + (err.message || 'Terjadi kesalahan.'));
                },
            }
        );
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
                        onClick={handleOpenCreateModal}
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
                                <CustomSelect
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    options={CATEGORY_FILTER_OPTIONS}
                                    placeholder="Semua Kategori"
                                    buttonClassName="!py-1.5 !px-2.5 !text-xs"
                                />

                                <CustomSelect
                                    value={selectedProject}
                                    onChange={handleProjectChange}
                                    options={projectFilterOptions}
                                    placeholder="Semua Proyek"
                                    buttonClassName="!py-1.5 !px-2.5 !text-xs"
                                    searchable={true}
                                    searchPlaceholder="Cari proyek..."
                                />
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
                                        onClick={handleOpenCreateModal}
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

                                                {(note.tasks !== undefined ? note.tasks.length > 0 : (note.content && /\[Masuk Tasks\]|\(Masuk Tasks\)/i.test(note.content))) && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                                                        <Check className="w-2.5 h-2.5" />
                                                        <span>Ada di Tasks</span>
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
                                className="relative bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col min-h-[620px] overflow-hidden"
                            >
                                <LoadingOverlay
                                    show={isRefiningAi && aiTarget === 'editor'}
                                    message="AI sedang merapikan catatan..."
                                    description="Menganalisis poin-poin dengan Gemini AI"
                                    fullScreen={false}
                                />
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
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[11px] text-slate-400 font-medium">Kategori:</span>
                                                <CustomSelect
                                                    value={editorForm.category}
                                                    onChange={(val) => {
                                                        setEditorForm({ ...editorForm, category: val });
                                                        setHasUnsavedChanges(true);
                                                    }}
                                                    options={CATEGORY_SELECT_OPTIONS}
                                                    className="w-36 sm:w-44"
                                                    buttonClassName="!py-1 !px-2.5 !text-xs font-semibold"
                                                />
                                            </div>

                                            {/* Project Relation Selector / Display */}
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[11px] text-slate-400 font-medium">Proyek:</span>
                                                {activeNote.project ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#122352] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#243e80] text-xs font-semibold">
                                                        <Folder className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span className="truncate max-w-[150px]">{activeNote.project.name}</span>
                                                    </div>
                                                ) : (
                                                    <CustomSelect
                                                        value={editorForm.project_id}
                                                        onChange={(val) => {
                                                            setEditorForm({ ...editorForm, project_id: val });
                                                            setHasUnsavedChanges(true);
                                                        }}
                                                        options={editorProjectOptions}
                                                        placeholder="-- Tanpa Proyek --"
                                                        className="w-44 sm:w-52"
                                                        buttonClassName="!py-1 !px-2.5 !text-xs"
                                                        searchable={true}
                                                        searchPlaceholder="Cari proyek..."
                                                    />
                                                )}
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
                                            type="button"
                                            onClick={() => handleAiRefine('editor')}
                                            disabled={isRefiningAi || !editorForm.content?.trim()}
                                            title="Otomatis perbaiki typo, jabarkan singkatan, dan rapikan poin dengan Gemini AI"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
                                        >
                                            <Sparkles className={`w-3.5 h-3.5 ${isRefiningAi && aiTarget === 'editor' ? 'animate-spin' : ''}`} />
                                            <span>{isRefiningAi && aiTarget === 'editor' ? 'Merapikan...' : 'Rapikan dengan AI'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleOpenSendTasksModal}
                                            disabled={!editorForm.content?.trim()}
                                            title="Kirim poin-poin revisi dari catatan ini langsung menjadi tugas di halaman Tasks"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
                                        >
                                            <ListTodo className="w-3.5 h-3.5" />
                                            <span>Kirim ke Tasks</span>
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

                                        {/* Delete Note Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenDeleteModal(activeNote)}
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

                                {/* AI Refinement Notice / Alert Banner */}
                                {aiNotice && (
                                    <div className={`px-4 py-2 text-xs flex items-center justify-between gap-2 border-b transition-all ${
                                        aiNotice.type === 'success'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60'
                                            : aiNotice.type === 'error'
                                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800/60'
                                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/60'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            {aiNotice.type === 'success' ? (
                                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                                            )}
                                            <span>{aiNotice.message}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {undoBackup && aiNotice.type === 'success' && (
                                                <button
                                                    type="button"
                                                    onClick={handleUndoRefine}
                                                    className="inline-flex items-center gap-1 font-semibold underline hover:no-underline text-emerald-700 dark:text-emerald-300 cursor-pointer"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    <span>Urungkan (Undo)</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setAiNotice(null)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

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
                                    onClick={handleOpenCreateModal}
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
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Tambah Catatan Baru"
                maxWidth="lg"
            >
                <form onSubmit={handleCreateNote} className="space-y-4 relative">
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

                    {/* Project Connection */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                            Terkait Proyek (Opsional)
                        </label>
                        <CustomSelect
                            value={createForm.project_id}
                            onChange={(val) => setCreateForm({ ...createForm, project_id: val })}
                            options={createProjectOptions}
                            placeholder="-- Tanpa Proyek (Catatan Umum) --"
                            buttonClassName="!py-2 !px-3.5 !text-xs sm:!text-sm"
                            searchable={true}
                            searchPlaceholder="Cari nama atau repo proyek..."
                        />
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                            Kategori Catatan *
                        </label>
                        <CustomSelect
                            value={createForm.category}
                            onChange={(val) => setCreateForm({ ...createForm, category: val })}
                            options={CATEGORY_SELECT_OPTIONS}
                            placeholder="Pilih Kategori..."
                            buttonClassName="!py-2 !px-3.5 !text-xs sm:!text-sm font-semibold"
                        />
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
                            placeholder="Tuliskan catatan revisi cepat, singkatan, atau instruksi meeting..."
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
            </Modal>

            {/* Modal: Kirim Catatan ke Tasks */}
            <Modal
                isOpen={isSendTasksModalOpen}
                onClose={() => setIsSendTasksModalOpen(false)}
                title="Kirim Catatan ke Tasks"
                description="Pilih poin revisi yang ingin langsung dibuatkan kartu tugas di halaman Tasks."
                icon={ListTodo}
                maxWidth="xl"
            >
                <form onSubmit={handleExecuteSendTasks} className="space-y-4 relative">
                    {/* Selectors Grid: Project, Task Type, Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Target Proyek */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Target Proyek
                            </label>
                            {activeNote?.project ? (
                                <div className="w-full bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Folder className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    <span className="truncate">{activeNote.project.name}</span>
                                </div>
                            ) : (
                                <CustomSelect
                                    value={targetProjectId}
                                    onChange={(val) => setTargetProjectId(val)}
                                    options={targetProjectOptions}
                                    placeholder="-- Umum (Tanpa Proyek) --"
                                    buttonClassName="!py-2 !px-3 !text-xs"
                                    searchable={true}
                                    searchPlaceholder="Cari target proyek..."
                                />
                            )}
                        </div>

                        {/* Tipe Tugas */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Tipe Tugas
                            </label>
                            <CustomSelect
                                value={taskType}
                                onChange={(val) => setTaskType(val)}
                                options={TASK_TYPE_OPTIONS}
                                placeholder="Pilih Tipe Tugas..."
                                buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                            />
                        </div>

                        {/* Prioritas */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                Prioritas
                            </label>
                            <CustomSelect
                                value={taskPriority}
                                onChange={(val) => setTaskPriority(val)}
                                options={TASK_PRIORITY_OPTIONS}
                                placeholder="Pilih Prioritas..."
                                buttonClassName="!py-2 !px-3 !text-xs font-semibold"
                            />
                        </div>
                    </div>

                    {/* Optional AI Description Checkbox */}
                    <div className="p-3 rounded-lg border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-indigo-950/30">
                        <Checkbox
                            checked={useAiTaskDesc}
                            onChange={(val) => setUseAiTaskDesc(val)}
                            size="sm"
                        >
                            <div className="space-y-0.5">
                                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                    Rapikan deskripsi tugas dengan AI (Opsional)
                                </span>
                                <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed">
                                    Standar: tidak dicentang (langsung disalin apa adanya). Jika dicentang, AI Gemini akan merangkum deskripsi standar 2-3 poin to-the-point dalam Bahasa Indonesia.
                                </p>
                            </div>
                        </Checkbox>
                    </div>

                    {/* Section: List of detected items */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Pilih Poin Tugas ({parsedTasks.filter((it) => it.selected).length} dari {parsedTasks.length} terpilih)
                            </span>
                            <div className="flex items-center gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => handleSelectAllTasks(true)}
                                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                                >
                                    Pilih Semua
                                </button>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <button
                                    type="button"
                                    onClick={() => handleSelectAllTasks(false)}
                                    className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                                >
                                    Batal Semua
                                </button>
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                            {parsedTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    onClick={() => handleToggleTaskItem(index)}
                                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                                        task.selected
                                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/20'
                                            : task.alreadyInTasks
                                            ? 'bg-slate-50 dark:bg-[#101e47]/40 border-slate-200/80 dark:border-[#1e346e]/80 opacity-70'
                                            : 'bg-slate-50 dark:bg-[#122352]/60 border-slate-200 dark:border-[#243e80] opacity-60'
                                    }`}
                                >
                                    <div className="flex items-start gap-2.5">
                                        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={task.selected}
                                                onChange={() => handleToggleTaskItem(index)}
                                                size="sm"
                                            />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {index + 1}. {task.title}
                                                </h4>
                                                {task.alreadyInTasks ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                                        <Check className="w-2.5 h-2.5" /> Sudah di Tasks
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                        Belum di Tasks
                                                    </span>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setIsSendTasksModalOpen(false)}
                            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSendingToTasks || parsedTasks.filter((t) => t.selected).length === 0}
                            className="px-5 py-2 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                        >
                            <ListTodo className="w-4 h-4" />
                            <span>
                                {isSendingToTasks
                                    ? 'Memproses ke Tasks...'
                                    : `Kirim (${parsedTasks.filter((t) => t.selected).length}) Tugas ke Tasks`}
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal: Konfirmasi Hapus Catatan */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Catatan"
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
                                Apakah Anda yakin ingin menghapus catatan ini?
                            </h4>
                            <p className="text-xs text-rose-700/90 dark:text-rose-300/80 leading-relaxed">
                                Catatan{' '}
                                <strong className="font-semibold text-rose-950 dark:text-rose-100">
                                    "{noteToDelete?.title || activeNote?.title || 'Catatan'}"
                                </strong>{' '}
                                beserta seluruh isinya akan dihapus secara permanen dari sistem.
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
                            <span>Ya, Hapus Catatan</span>
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Global Full-Screen Loading Overlay for CRUD & Sending Tasks */}
            <LoadingOverlay
                show={isSaving || isCreating || isDeleting || isSendingToTasks}
                fullScreen={true}
                message={
                    isSaving
                        ? 'Menyimpan perubahan catatan...'
                        : isCreating
                        ? 'Membuat catatan baru...'
                        : isDeleting
                        ? 'Menghapus catatan...'
                        : 'Sedang mengirim tugas ke Tasks...'
                }
                description={
                    isSendingToTasks
                        ? 'Menyiapkan kartu tugas baru di halaman Tasks'
                        : isCreating
                        ? 'Menyimpan catatan dan sinkronisasi proyek'
                        : isDeleting
                        ? 'Menghapus data dari sistem'
                        : 'Memperbarui data di server'
                }
            />
        </DashboardLayout>
    );
}

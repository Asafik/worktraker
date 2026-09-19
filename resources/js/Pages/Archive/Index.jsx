import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from '@/Components/Modal';
import CustomSelect from '@/Components/CustomSelect';
import LoadingOverlay from '@/Components/LoadingOverlay';
import { toast } from 'sonner';
import {
    Home,
    ChevronRight,
    ChevronDown,
    Search,
    Upload,
    Download,
    Eye,
    MoreHorizontal,
    Folder,
    FileText,
    Layers,
    Calendar,
    HardDrive,
    Tag,
    Edit3,
    ExternalLink,
    Trash2,
    Check,
    X,
    Cloud,
    FileCode,
    Loader2,
    Clock,
    Zap,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

export default function ArchivePage({ initialArchives = [], projects = [], isGoogleDriveConnected = true, googleDriveFolderUrl = 'https://drive.google.com/drive/folders/1LZwvt7UvPM1OOcIr366mnpmY5ITT--69', flash = {} }) {
    const [selectedTab, setSelectedTab] = useState('All'); // All, Projects, Backups, Others
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(() => initialArchives.length > 0 ? initialArchives[0].id : 1);
    const [checkedIds, setCheckedIds] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [uploadName, setUploadName] = useState('');
    const [uploadProjectName, setUploadProjectName] = useState('');
    const [uploadCategory, setUploadCategory] = useState('Project');
    const [uploadDesc, setUploadDesc] = useState('');
    const [uploadNotes, setUploadNotes] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadLoadedBytes, setUploadLoadedBytes] = useState(0);
    const [uploadTotalBytes, setUploadTotalBytes] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState('');
    const [uploadEta, setUploadEta] = useState('');
    const [uploadStage, setUploadStage] = useState('idle'); // 'idle' | 'uploading' | 'saving_drive'
    const [archiveToDelete, setArchiveToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const uploadStartTimeRef = useRef(null);

    const formatFileSize = (bytes) => {
        if (!bytes || bytes <= 0) return '0 MB';
        const mb = bytes / (1024 * 1024);
        if (mb < 1) {
            return (bytes / 1024).toFixed(1) + ' KB';
        }
        return mb.toFixed(1) + ' MB';
    };

    const categoryOptions = [
        { value: 'Project', label: 'Project' },
        { value: 'Backup', label: 'Backup' },
        { value: 'Other', label: 'Other' },
    ];

    // Derived project options for CustomSelect auto-fill
    const projectOptions = [
        { value: '', label: '-- Pilih Proyek (Auto-fill) atau Input Manual --' },
        ...projects.map((p) => ({
            value: String(p.id),
            label: `${p.name}${p.company_name ? ` (${p.company_name})` : ''}`,
        })),
    ];

    // Handle project selection: auto-fill archive name, project name, and description
    const handleSelectProject = (projId) => {
        setSelectedProjectId(projId);
        if (!projId) return;

        const proj = projects.find((p) => String(p.id) === String(projId));
        if (proj) {
            setUploadProjectName(proj.name);
            setUploadName(`${proj.name} - Archive`);
            if (proj.description) {
                setUploadDesc(proj.description);
            }
            setUploadCategory('Project');
        }
    };

    const handleOpenUploadModal = () => {
        setSelectedProjectId('');
        setUploadName('');
        setUploadProjectName('');
        setUploadCategory('Project');
        setUploadDesc('');
        setUploadNotes('');
        setSelectedFile(null);
        setUploadProgress(null);
        setUploadLoadedBytes(0);
        setUploadTotalBytes(0);
        setUploadSpeed('');
        setUploadEta('');
        uploadStartTimeRef.current = null;
        setUploadStage('idle');
        setIsUploadModalOpen(true);
    };

    // Synchronize archives from Inertia props
    const [archives, setArchives] = useState(initialArchives);

    useEffect(() => {
        if (initialArchives && initialArchives.length > 0) {
            setArchives(initialArchives);
            if (!initialArchives.some(a => a.id === selectedId)) {
                setSelectedId(initialArchives[0].id);
            }
        }
    }, [initialArchives]);

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash]);


    // Active selected archive item for right column preview
    const activeArchive = archives.find((a) => a.id === selectedId) || archives[0] || null;

    // Filter logic
    const filteredArchives = archives.filter((item) => {
        const matchesTab =
            selectedTab === 'All' ||
            (selectedTab === 'Projects' && item.category === 'Project') ||
            (selectedTab === 'Backups' && item.category === 'Backup') ||
            (selectedTab === 'Others' && item.category === 'Other');

        const matchesSearch =
            (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (Array.isArray(item.tags) ? item.tags : Object.values(item.tags || [])).some((t) =>
                (t || '').toLowerCase().includes(searchQuery.toLowerCase())
            );

        return matchesTab && matchesSearch;
    });

    // Count statistics
    const counts = {
        All: archives.length,
        Projects: archives.filter((a) => a.category === 'Project').length,
        Backups: archives.filter((a) => a.category === 'Backup').length,
        Others: archives.filter((a) => a.category === 'Other').length,
    };

    // Checkbox toggles
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setCheckedIds(filteredArchives.map((a) => a.id));
        } else {
            setCheckedIds([]);
        }
    };

    const handleToggleCheck = (id) => {
        if (checkedIds.includes(id)) {
            setCheckedIds(checkedIds.filter((item) => item !== id));
        } else {
            setCheckedIds([...checkedIds, id]);
        }
    };

    // Delete active archive with real SQLite & Google Drive deletion
    const handleDeleteArchive = (archive) => {
        setArchiveToDelete(archive);
    };

    const handleConfirmDelete = () => {
        if (!archiveToDelete) return;

        const id = archiveToDelete.id;
        setIsDeleting(true);

        router.delete(`/archive/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                setArchiveToDelete(null);
                toast.success('Arsip berhasil dihapus dari Google Drive & database.');
                const remaining = archives.filter((a) => a.id !== id);
                setArchives(remaining);
                if (remaining.length > 0) {
                    setSelectedId(remaining[0].id);
                }
            },
            onError: (err) => {
                setIsDeleting(false);
                const msg = Object.values(err)[0] || 'Terjadi kesalahan saat menghapus arsip.';
                toast.error('Gagal menghapus arsip: ' + msg);
            },
        });
    };

    // Real upload submit to Google Drive and SQLite
    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!uploadName.trim()) {
            toast.warning('Nama arsip wajib diisi!');
            return;
        }

        if (!selectedFile) {
            toast.warning('Silakan pilih file yang akan diunggah ke Google Drive!');
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);
        setUploadLoadedBytes(0);
        setUploadTotalBytes(selectedFile.size || 0);
        setUploadSpeed('Memulai...');
        setUploadEta('Menghitung...');
        setUploadStage('uploading');
        uploadStartTimeRef.current = Date.now();
        setIsUploadModalOpen(false);

        const formData = new FormData();
        formData.append('name', uploadName.trim());
        formData.append('projectName', uploadProjectName.trim());
        formData.append('category', uploadCategory);
        formData.append('description', uploadDesc.trim());
        formData.append('notes', uploadNotes.trim());
        formData.append('file', selectedFile);

        router.post('/archive', formData, {
            forceFormData: true,
            preserveScroll: true,
            onProgress: (progress) => {
                const pct = progress.percentage ?? 0;
                const loaded = progress.loaded ?? 0;
                const total = progress.total ?? (selectedFile ? selectedFile.size : 0);
                setUploadProgress(pct);
                setUploadLoadedBytes(loaded);
                setUploadTotalBytes(total);

                if (uploadStartTimeRef.current && loaded > 0) {
                    const elapsedSec = (Date.now() - uploadStartTimeRef.current) / 1000;
                    if (elapsedSec > 0.4) {
                        const bytesPerSec = loaded / elapsedSec;
                        if (bytesPerSec >= 1024 * 1024) {
                            setUploadSpeed(`${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`);
                        } else {
                            setUploadSpeed(`${Math.round(bytesPerSec / 1024)} KB/s`);
                        }

                        const remainingBytes = Math.max(0, total - loaded);
                        if (remainingBytes > 0 && bytesPerSec > 0) {
                            const remainingSec = Math.ceil(remainingBytes / bytesPerSec);
                            if (remainingSec < 60) {
                                setUploadEta(`~${remainingSec} detik`);
                            } else {
                                const mins = Math.floor(remainingSec / 60);
                                const secs = remainingSec % 60;
                                setUploadEta(`~${mins}m ${secs}s`);
                            }
                        } else {
                            setUploadEta('Hampir selesai');
                        }
                    }
                }

                if (pct >= 100) {
                    setUploadStage('saving_drive');
                    setUploadEta('Menyimpan...');
                }
            },
            onSuccess: () => {
                setIsSubmitting(false);
                setUploadStage('idle');
                setUploadProgress(null);
                setUploadSpeed('');
                setUploadEta('');
                uploadStartTimeRef.current = null;
                setIsUploadModalOpen(false);
                toast.success('Arsip berhasil diunggah dan disimpan ke Google Drive!');
                setSelectedProjectId('');
                setUploadName('');
                setUploadProjectName('');
                setUploadDesc('');
                setUploadNotes('');
                setSelectedFile(null);
            },
            onError: (err) => {
                setIsSubmitting(false);
                setUploadStage('idle');
                setUploadProgress(null);
                setUploadSpeed('');
                setUploadEta('');
                uploadStartTimeRef.current = null;
                setIsUploadModalOpen(true);
                const msg = Object.values(err)[0] || 'Terjadi kesalahan saat mengunggah arsip ke Google Drive.';
                toast.error('Gagal mengunggah arsip: ' + msg);
            },
        });
    };

    return (
        <>
            <Head title="Archive - WorkTrack" />

            <div className="space-y-6">
                {/* 1. Header & Controls */}
                <div className="space-y-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <Home className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Archive</span>
                    </div>

                    {/* Main Header Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Archive
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Your saved projects, backups, and important files.
                                </p>
                            </div>

                            {/* Filter Category Pills */}
                            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto sm:pt-1">
                                {[
                                    { key: 'All', label: 'All', count: counts.All },
                                    { key: 'Projects', label: 'Projects', count: counts.Projects },
                                    { key: 'Backups', label: 'Backups', count: counts.Backups },
                                    { key: 'Others', label: 'Others', count: counts.Others },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setSelectedTab(tab.key)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-xs ${
                                            selectedTab === tab.key
                                                ? 'bg-[#2563eb] text-white'
                                                : 'bg-white dark:bg-[#0e1d47] border border-slate-200/90 dark:border-[#1e346e] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352]'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                                                selectedTab === tab.key
                                                    ? 'bg-blue-700/80 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Search & Upload button */}
                        <div className="flex items-center gap-3 self-start lg:self-auto">
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search archive..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 sm:w-60 bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all"
                                />
                            </div>

                            <button
                                onClick={handleOpenUploadModal}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
                            >
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Main 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (8 cols): Table Card */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs overflow-hidden">
                            {/* Table Container */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-[#f8fafc] dark:bg-[#0c183b] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                                        <tr>
                                            <th className="py-3.5 px-4 w-10 text-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={
                                                        filteredArchives.length > 0 &&
                                                        checkedIds.length === filteredArchives.length
                                                    }
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </th>
                                            <th className="py-3.5 px-4">Name</th>
                                            <th className="py-3.5 px-3">Type</th>
                                            <th className="py-3.5 px-3">Size</th>
                                            <th className="py-3.5 px-4">
                                                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200">
                                                    <span>Archived At</span>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </div>
                                            </th>
                                            <th className="py-3.5 px-4">Tags</th>
                                            <th className="py-3.5 px-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                        {filteredArchives.map((item) => {
                                            const Icon = item.icon || Folder;
                                            const isSelected = item.id === selectedId;
                                            const isChecked = checkedIds.includes(item.id);
                                            const iconColor = item.iconColor || 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400';

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => setSelectedId(item.id)}
                                                    className={`cursor-pointer transition-colors group ${
                                                        isSelected
                                                            ? 'bg-blue-50/40 dark:bg-blue-950/20'
                                                            : 'hover:bg-slate-50/70 dark:hover:bg-[#122352]/40'
                                                    }`}
                                                >
                                                    {/* Checkbox */}
                                                    <td
                                                        className="py-3.5 px-4 text-center"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggleCheck(item.id)}
                                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    </td>

                                                    {/* Name + Icon + Subtitle */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${iconColor}`}
                                                            >
                                                                <Icon className="w-4.5 h-4.5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4
                                                                    className={`font-semibold text-sm truncate transition-colors ${
                                                                        isSelected
                                                                            ? 'text-blue-600 dark:text-blue-400'
                                                                            : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                                    }`}
                                                                >
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-xs text-slate-400 dark:text-slate-400 truncate mt-0.5">
                                                                    {item.subtitle}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Type Badge */}
                                                    <td className="py-3.5 px-3">
                                                        <span
                                                            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md ${item.typeBadge}`}
                                                        >
                                                            {item.category}
                                                        </span>
                                                    </td>

                                                    {/* Size */}
                                                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm whitespace-nowrap">
                                                        {item.size}
                                                    </td>

                                                    {/* Archived At */}
                                                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                                                        <div>{(item.archivedAt || '').split(' ').slice(0, 3).join(' ')}</div>
                                                        <div className="text-[11px] text-slate-400">
                                                            {(item.archivedAt || '').split(' ').slice(3).join(' ')}
                                                        </div>
                                                    </td>

                                                    {/* Tags */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            {(Array.isArray(item.tags) ? item.tags : Object.values(item.tags || [])).map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 whitespace-nowrap"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td
                                                        className="py-3.5 px-4 text-center"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex items-center justify-center gap-1 text-slate-400">
                                                            <button
                                                                title="Download"
                                                                onClick={() => {
                                                                    if (item.googleDriveDownloadLink) {
                                                                        window.open(item.googleDriveDownloadLink, '_blank');
                                                                        toast.info(`Membuka unduhan ${item.name}...`);
                                                                    } else {
                                                                        window.open(googleDriveFolderUrl, '_blank');
                                                                        toast.info(`Membuka folder Google Drive...`);
                                                                    }
                                                                }}
                                                                className="p-1 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                title="Preview"
                                                                onClick={() => setSelectedId(item.id)}
                                                                className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                title="Hapus Arsip"
                                                                onClick={() => handleDeleteArchive(item)}
                                                                className="p-1 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        {filteredArchives.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-sm text-slate-400">
                                                    Tidak ada arsip yang cocok dengan pencarian.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Pagination footer */}
                            <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                <div>
                                    Showing <span className="font-semibold text-slate-800 dark:text-slate-200">1</span> to{' '}
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {filteredArchives.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {archives.length}
                                    </span>{' '}
                                    archives
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        disabled
                                        className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-400 opacity-60 cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                    </button>
                                    <button className="w-8 h-8 rounded-md bg-[#2563eb] text-white font-semibold flex items-center justify-center shadow-xs">
                                        1
                                    </button>
                                    <button
                                        disabled
                                        className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-400 opacity-60 cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (4 cols): Archive Detail Panel */}
                    <div className="lg:col-span-4 space-y-5">
                        {activeArchive ? (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 sm:p-6 shadow-xs space-y-5">
                                {/* Card Header: Icon + Title + Badge + Subtitle */}
                                <div className="flex items-start gap-3.5">
                                    <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <Folder className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                                                {activeArchive.name}
                                            </h2>
                                            <span
                                                className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${activeArchive.typeBadge || 'bg-blue-50 text-blue-600'}`}
                                            >
                                                {activeArchive.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                                            {activeArchive.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {activeArchive.description}
                                </p>

                                {/* Metadata Key-Value List */}
                                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm">
                                    {/* Size */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <HardDrive className="w-4 h-4 text-slate-400" />
                                            <span>Size</span>
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {activeArchive.size}
                                        </span>
                                    </div>

                                    {/* Archived At */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>Archived At</span>
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {activeArchive.archivedAt}
                                        </span>
                                    </div>

                                    {/* File Type */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <FileCode className="w-4 h-4 text-slate-400" />
                                            <span>File Type</span>
                                        </div>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {activeArchive.fileType}
                                        </span>
                                    </div>

                                    {/* Storage Location */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <Cloud className="w-4 h-4 text-slate-400" />
                                            <span>Storage Location</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeArchive.storageConnected ? (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                                                    Connected
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                                                    Disconnected
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                                <img
                                                    src="/images/svg/google_drive.svg"
                                                    alt="Google Drive"
                                                    className="w-4 h-4 object-contain"
                                                />
                                                <span>{activeArchive.storageLocation || 'Google Drive'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags Section */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Tags</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        {(Array.isArray(activeArchive?.detailTags)
                                            ? activeArchive.detailTags
                                            : Object.values(activeArchive?.detailTags || [])
                                        ).map((t, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                                            <span>Notes</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newNote = prompt('Edit catatan:', activeArchive.notes);
                                                if (newNote !== null) {
                                                    setArchives(
                                                        archives.map((a) =>
                                                            a.id === activeArchive.id ? { ...a, notes: newNote } : a
                                                        )
                                                    );
                                                }
                                            }}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-[#0c183b] rounded-lg text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800/80">
                                        {activeArchive.notes || 'Tidak ada catatan.'}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                                    <button
                                        onClick={() => {
                                            if (activeArchive?.googleDriveDownloadLink) {
                                                window.open(activeArchive.googleDriveDownloadLink, '_blank');
                                            } else {
                                                window.open(googleDriveFolderUrl, '_blank');
                                            }
                                        }}
                                        className="w-full py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download dari Drive</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (activeArchive?.googleDriveViewLink) {
                                                window.open(activeArchive.googleDriveViewLink, '_blank');
                                            } else {
                                                window.open(googleDriveFolderUrl, '_blank');
                                            }
                                        }}
                                        className="w-full py-2.5 bg-white dark:bg-[#0e1d47] hover:bg-slate-50 dark:hover:bg-[#122352] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#243e80] rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Buka di Google Drive</span>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteArchive(activeArchive)}
                                        className="w-full py-2.5 bg-white dark:bg-[#0e1d47] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Hapus Arsip</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-8 text-center text-slate-400 text-xs sm:text-sm shadow-xs">
                                <Folder className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                <p>Pilih salah satu arsip dari tabel untuk melihat detailnya.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dedicated Loading Overlay Khusus Upload Arsip dengan Progress Bar & Estimasi MB/KB */}
            <LoadingOverlay fullScreen isShow={isSubmitting}>
                <div className="w-full flex flex-col items-center text-center">
                    {/* Glowing animated header icon */}
                    <div className="relative mb-4 flex items-center justify-center">
                        <div className="absolute w-16 h-16 rounded-full bg-blue-500/25 dark:bg-blue-400/25 blur-lg animate-pulse pointer-events-none" />
                        <div className="relative w-14 h-14 rounded-2xl bg-blue-50 dark:bg-[#132761] border border-blue-100 dark:border-blue-700/60 flex items-center justify-center shadow-md">
                            {uploadStage === 'saving_drive' ? (
                                <Cloud className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-pulse" />
                            ) : (
                                <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-bounce" />
                            )}
                        </div>
                    </div>

                    {/* Judul & Status */}
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {uploadStage === 'saving_drive'
                            ? 'Menyimpan ke Google Drive...'
                            : `Mengunggah Berkas ke Server (${Math.round(uploadProgress || 0)}%)`}
                    </h4>

                    {/* Badge Nama File & Ukuran Total */}
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#122352] border border-slate-200/60 dark:border-[#243e80] text-xs text-slate-700 dark:text-slate-300 max-w-full">
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[240px] font-medium">{selectedFile?.name || uploadName}</span>
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{formatFileSize(uploadTotalBytes)}</span>
                    </div>

                    {/* Progress Bar Dinamis */}
                    <div className="w-full mt-5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-300">
                                {uploadStage === 'saving_drive'
                                    ? 'Tahap 2 dari 2: Mengalirkan ke Google Drive'
                                    : 'Tahap 1 dari 2: Mengunggah dari Perangkat'}
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs sm:text-sm flex items-center gap-1.5">
                                {uploadStage === 'saving_drive' ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    `${Math.round(uploadProgress || 0)}%`
                                )}
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-[#152759] h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/70 dark:border-slate-800 shadow-inner">
                            <div
                                className={`h-full rounded-full transition-all duration-200 ease-out shadow-xs ${
                                    uploadStage === 'saving_drive'
                                        ? 'w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-pulse'
                                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500'
                                }`}
                                style={uploadStage !== 'saving_drive' ? { width: `${Math.min(100, Math.max(0, uploadProgress || 0))}%` } : {}}
                            />
                        </div>
                    </div>

                    {/* Grid Metrik Estimasi (Terkirim, Kecepatan, Sisa Waktu) */}
                    <div className="grid grid-cols-3 gap-2 w-full mt-4">
                        <div className="bg-slate-50 dark:bg-[#101f4a] p-2.5 rounded-lg border border-slate-100 dark:border-[#1e346e]/60 text-center">
                            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 dark:text-slate-400 mb-0.5">
                                <HardDrive className="w-3 h-3" />
                                <span>Terkirim</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                                {formatFileSize(uploadLoadedBytes)}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#101f4a] p-2.5 rounded-lg border border-slate-100 dark:border-[#1e346e]/60 text-center">
                            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 dark:text-slate-400 mb-0.5">
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span>Kecepatan</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                                {uploadStage === 'saving_drive' ? 'Cloud Sync' : (uploadSpeed || '-')}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#101f4a] p-2.5 rounded-lg border border-slate-100 dark:border-[#1e346e]/60 text-center">
                            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 dark:text-slate-400 mb-0.5">
                                <Clock className="w-3 h-3 text-blue-500" />
                                <span>Status</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                                {uploadStage === 'saving_drive' ? 'Memproses' : (uploadEta || '-')}
                            </p>
                        </div>
                    </div>

                    {/* Deskripsi & Peringatan Ramah */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed max-w-sm">
                        {uploadStage === 'saving_drive'
                            ? 'File 100% diterima dari komputer Anda! Server sedang mengalirkan dan memverifikasi penyimpanan ke Google Drive WorkTrack.'
                            : 'Mohon tunggu, berkas sedang ditransfer ke server. Harap jangan menutup jendela atau menyegarkan halaman.'}
                    </p>
                </div>
            </LoadingOverlay>

            {/* Upload Modal (Standard Modal Component) */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => !isSubmitting && setIsUploadModalOpen(false)}
                title="Simpan Arsip ke Google Drive"
                description="File disimpan di cloud folder Google Drive, metadata tersimpan di SQLite."
                icon={Cloud}
                maxWidth="xl"
            >
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                    {!isGoogleDriveConnected && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <span>
                                Status Google Drive saat ini <strong>Disconnected</strong>. Pastikan integrasi Google Drive aktif di menu <Link href="/settings" className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-200">Settings &gt; Integrations</Link>.
                            </span>
                        </div>
                    )}

                    {/* 1. Pilih Proyek Relasi (Auto-fill) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Pilih dari Proyek (Auto-fill)
                        </label>
                        <CustomSelect
                            value={selectedProjectId}
                            onChange={handleSelectProject}
                            options={projectOptions}
                            placeholder="-- Pilih Proyek (Opsional) --"
                            searchable={true}
                            searchPlaceholder="Cari proyek..."
                            buttonClassName="!py-2 !px-3 !text-xs sm:!text-sm"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                            Memilih proyek akan otomatis mengisi Nama Arsip, Nama Proyek, dan Deskripsi. Anda tetap bisa mengedit atau mengisinya secara manual.
                        </p>
                    </div>

                    {/* 2. Grid: Nama Arsip & Nama Proyek */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nama Arsip <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Company Website v2"
                                value={uploadName}
                                onChange={(e) => setUploadName(e.target.value)}
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nama Project
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: WorkTrack System"
                                value={uploadProjectName}
                                onChange={(e) => setUploadProjectName(e.target.value)}
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* 3. Kategori */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Kategori
                        </label>
                        <CustomSelect
                            value={uploadCategory}
                            onChange={(val) => setUploadCategory(val)}
                            options={categoryOptions}
                            placeholder="Pilih Kategori"
                            buttonClassName="!py-2 !px-3 !text-xs sm:!text-sm"
                        />
                    </div>

                    {/* 4. Deskripsi Singkat */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Tuliskan keterangan isi arsip..."
                            value={uploadDesc}
                            onChange={(e) => setUploadDesc(e.target.value)}
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* 5. Catatan Tambahan (Notes) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Catatan Tambahan (Notes)
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Versi final sebelum rilis production"
                            value={uploadNotes}
                            onChange={(e) => setUploadNotes(e.target.value)}
                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* 6. Real File Input Dropzone */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Pilih File untuk Diunggah ke Google Drive
                        </label>
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg cursor-pointer bg-[#f8fafc] dark:bg-[#0c183b] transition-all">
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setSelectedFile(e.target.files[0]);
                                        if (!uploadName) {
                                            setUploadName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                                        }
                                    }
                                }}
                            />
                            <Upload className="w-6 h-6 text-blue-500 mb-1.5" />
                            {selectedFile ? (
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap dikirim ke Google Drive
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                        Klik untuk memilih file dari komputer Anda
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Mendukung ZIP, TAR, SQL, PDF, DOCX, dll
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setIsUploadModalOpen(false)}
                            className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-md text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-75 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Mengunggah ke Drive...</span>
                                </>
                            ) : (
                                <>
                                    <Cloud className="w-4 h-4" />
                                    <span>Simpan ke Google Drive</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Loading Overlay saat proses Hapus Arsip */}
            <LoadingOverlay
                fullScreen
                isShow={isDeleting}
                message="Menghapus Berkas Arsip..."
                description="Sedang menghapus berkas dari Google Drive dan database..."
            />

            {/* Modal: Konfirmasi Hapus Arsip */}
            <Modal
                isOpen={!!archiveToDelete}
                onClose={() => !isDeleting && setArchiveToDelete(null)}
                title="Hapus Arsip"
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
                                Apakah Anda yakin ingin menghapus arsip ini?
                            </h4>
                            <p className="text-xs text-rose-700/90 dark:text-rose-300/80 leading-relaxed">
                                Berkas{' '}
                                <strong className="font-semibold text-rose-950 dark:text-rose-100">
                                    "{archiveToDelete?.name}"
                                </strong>{' '}
                                akan dihapus secara permanen dari penyimpanan Google Drive dan database sistem.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1b2b5a]">
                        <button
                            type="button"
                            onClick={() => setArchiveToDelete(null)}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Arsip</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

ArchivePage.layout = (page) => <DashboardLayout activePage="Archive">{page}</DashboardLayout>;

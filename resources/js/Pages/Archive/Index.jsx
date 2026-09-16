import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
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
} from 'lucide-react';

export default function ArchivePage({ initialArchives = [], googleDriveFolderUrl = 'https://drive.google.com/drive/folders/1LZwvt7UvPM1OOcIr366mnpmY5ITT--69', flash = {} }) {
    const [selectedTab, setSelectedTab] = useState('All'); // All, Projects, Backups, Others
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(() => initialArchives.length > 0 ? initialArchives[0].id : 1);
    const [checkedIds, setCheckedIds] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadName, setUploadName] = useState('');
    const [uploadProjectName, setUploadProjectName] = useState('');
    const [uploadCategory, setUploadCategory] = useState('Project');
    const [uploadDesc, setUploadDesc] = useState('');
    const [uploadNotes, setUploadNotes] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState(flash?.message || null);

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
            setToastMessage(flash.message);
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
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

    // Delete active archive
    // Delete active archive with real SQLite & Google Drive deletion
    const handleDeleteArchive = (id) => {
        if (!confirm(`Yakin ingin menghapus arsip "${activeArchive?.name || 'ini'}"? File akan dihapus dari Google Drive & database.`)) {
            return;
        }

        router.delete(`/archive/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                const remaining = archives.filter((a) => a.id !== id);
                setArchives(remaining);
                if (remaining.length > 0) {
                    setSelectedId(remaining[0].id);
                }
            },
        });
    };

    // Real upload submit to Google Drive and SQLite
    const handleUploadSubmit = (e) => {
        e.preventDefault();
        if (!uploadName.trim()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', uploadName);
        formData.append('projectName', uploadProjectName);
        formData.append('category', uploadCategory);
        formData.append('description', uploadDesc);
        formData.append('notes', uploadNotes);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        router.post('/archive', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsUploadModalOpen(false);
                setUploadName('');
                setUploadProjectName('');
                setUploadDesc('');
                setUploadNotes('');
                setSelectedFile(null);
            },
            onError: (err) => {
                setIsSubmitting(false);
                alert('Gagal mengunggah arsip ke Google Drive: ' + (Object.values(err)[0] || 'Terjadi kesalahan.'));
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
                                onClick={() => setIsUploadModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all shrink-0"
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
                                                                onClick={() => alert(`Mengunduh ${item.name}...`)}
                                                                className="p-1 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
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
                                                                title="More"
                                                                className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                                                            >
                                                                <MoreHorizontal className="w-3.5 h-3.5" />
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
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {activeArchive.storageLocation}
                                            </span>
                                            {activeArchive.storageConnected && (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                                                    Connected
                                                </span>
                                            )}
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
                                        onClick={() => handleDeleteArchive(activeArchive.id)}
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

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-600 text-white shadow-lg text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Upload Modal (Upload directly to Google Drive folder) */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>Simpan Arsip ke Google Drive</span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
                                        Google Drive
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    File disimpan di cloud folder Google Drive, metadata tersimpan di SQLite.
                                </p>
                            </div>
                            <button
                                onClick={() => !isSubmitting && setIsUploadModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="space-y-3.5">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        value={uploadCategory}
                                        onChange={(e) => setUploadCategory(e.target.value)}
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="Project">Project</option>
                                        <option value="Backup">Backup</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Folder Tujuan
                                    </label>
                                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-100 dark:bg-[#0c183b] border border-slate-200/80 dark:border-[#1e346e] text-xs text-slate-600 dark:text-slate-300">
                                        <Cloud className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                        <span className="truncate">Folder: 1LZwvt7...--69</span>
                                    </div>
                                </div>
                            </div>

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

                            {/* Real File Input Dropzone */}
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

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                    </div>
                </div>
            )}
        </>
    );
}

ArchivePage.layout = (page) => <DashboardLayout activePage="Archive">{page}</DashboardLayout>;

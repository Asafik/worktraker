import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Plus,
    Search,
    ChevronDown,
    FileText,
    Settings,
    Users,
    Image as ImageIcon,
    AlertCircle,
    Target,
    BookOpen,
    Lightbulb,
    MoreHorizontal,
    Trash2,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link2,
    Code,
    Quote,
    Maximize2,
    Check,
} from 'lucide-react';

export default function Notes() {
    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [selectedNoteId, setSelectedNoteId] = useState(1);
    const [isSavedNotice, setIsSavedNotice] = useState(false);

    // Initial Notes database matching screenshot mockup
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'Ide Fitur WorkTrack',
            category: 'Idea',
            categoryBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            icon: FileText,
            iconColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
            excerpt: 'Beberapa ide fitur untuk pengembangan selanj...',
            date: '16 Sep 2025',
            updatedText: 'Last updated 16 Sep 2025 at 09:42',
            checklist: {
                github: [
                    { id: 'gh-1', text: 'Connect akun GitHub di Settings', checked: false },
                    { id: 'gh-2', text: 'Pilih repository per project', checked: false },
                    { id: 'gh-3', text: 'Tampilkan commit activity (hanya milik sendiri)', checked: false },
                    { id: 'gh-4', text: 'Timeline otomatis di detail project', checked: false },
                ],
                portfolio: [
                    { id: 'pf-1', text: 'Export ke PDF', checked: false },
                    { id: 'pf-2', text: 'Export ke HTML (static site)', checked: false },
                    { id: 'pf-3', text: 'Custom template', checked: false },
                    { id: 'pf-4', text: 'Pilih project mana yang ditampilkan', checked: false },
                ],
                theme: [
                    { id: 'th-1', text: 'Sudah implementasi basic toggle', checked: true },
                    { id: 'th-2', text: 'Tambahkan pilihan auto (follow system)', checked: true },
                ],
                stats: [
                    { id: 'st-1', text: 'Grafik kontribusi mingguan', checked: false },
                    { id: 'st-2', text: 'Total commit dari GitHub', checked: false },
                    { id: 'st-3', text: 'Heatmap aktivitas', checked: false },
                ],
                other: [
                    { id: 'ot-1', text: 'Reminder & notification', checked: false },
                    { id: 'ot-2', text: 'Tag untuk notes', checked: false },
                    { id: 'ot-3', text: 'Archive project', checked: false },
                    { id: 'ot-4', text: 'Multi-language (Indonesia / English)', checked: false },
                ],
            },
            tip: 'Fokus dulu fitur inti, sisanya untuk versi selanjutnya.',
        },
        {
            id: 2,
            title: 'Setup Development Environment',
            category: 'Technical',
            categoryBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40',
            icon: Settings,
            iconColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
            excerpt: 'Langkah-langkah setup project Laravel...',
            date: '15 Sep 2025',
            updatedText: 'Last updated 15 Sep 2025 at 14:20',
        },
        {
            id: 3,
            title: 'Catatan Meeting',
            category: 'Meeting',
            categoryBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40',
            icon: Users,
            iconColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
            excerpt: 'Hasil diskusi dengan klien terkait fitur baru...',
            date: '14 Sep 2025',
            updatedText: 'Last updated 14 Sep 2025 at 11:15',
        },
        {
            id: 4,
            title: 'UI/UX Reference',
            category: 'Design',
            categoryBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40',
            icon: ImageIcon,
            iconColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
            excerpt: 'Referensi desain untuk dashboard dan layout...',
            date: '12 Sep 2025',
            updatedText: 'Last updated 12 Sep 2025 at 16:45',
        },
        {
            id: 5,
            title: 'Error & Solution',
            category: 'Troubleshooting',
            categoryBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40',
            icon: AlertCircle,
            iconColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
            excerpt: 'Daftar error yang pernah terjadi dan solusinya...',
            date: '10 Sep 2025',
            updatedText: 'Last updated 10 Sep 2025 at 10:30',
        },
        {
            id: 6,
            title: 'Rencana Karir',
            category: 'Personal',
            categoryBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
            icon: Target,
            iconColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
            excerpt: 'Target dan rencana pengembangan diri...',
            date: '08 Sep 2025',
            updatedText: 'Last updated 08 Sep 2025 at 08:00',
        },
        {
            id: 7,
            title: 'Belajar Laravel 13',
            category: 'Learning',
            categoryBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            icon: BookOpen,
            iconColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
            excerpt: 'Catatan materi yang perlu dipelajari...',
            date: '05 Sep 2025',
            updatedText: 'Last updated 05 Sep 2025 at 19:10',
        },
        {
            id: 8,
            title: 'Ide Project Pribadi',
            category: 'Idea',
            categoryBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            icon: Lightbulb,
            iconColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400',
            excerpt: 'Beberapa ide project untuk portofolio...',
            date: '03 Sep 2025',
            updatedText: 'Last updated 03 Sep 2025 at 13:25',
        },
    ]);

    // Active Note State
    const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

    // Toggle checklist item in active note
    const toggleCheckItem = (sectionKey, itemId) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) => {
                if (note.id !== selectedNoteId || !note.checklist) return note;
                const updatedSection = note.checklist[sectionKey].map((item) =>
                    item.id === itemId ? { ...item, checked: !item.checked } : item
                );
                return {
                    ...note,
                    checklist: {
                        ...note.checklist,
                        [sectionKey]: updatedSection,
                    },
                };
            })
        );
    };

    // Filter notes
    const filteredNotes = notes.filter((note) => {
        const matchesSearch =
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            categoryFilter === 'All' || note.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const handleSaveNote = () => {
        setIsSavedNotice(true);
        setTimeout(() => setIsSavedNotice(false), 2500);
    };

    const handleDeleteNote = (id) => {
        if (notes.length <= 1) {
            alert('Minimal harus ada 1 catatan!');
            return;
        }
        if (confirm('Yakin ingin menghapus catatan ini?')) {
            const remaining = notes.filter((n) => n.id !== id);
            setNotes(remaining);
            if (selectedNoteId === id) {
                setSelectedNoteId(remaining[0].id);
            }
        }
    };

    const handleAddNewNote = () => {
        const newId = Date.now();
        const newNote = {
            id: newId,
            title: 'Catatan Baru Tanpa Judul',
            category: 'Idea',
            categoryBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            icon: FileText,
            iconColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
            excerpt: 'Tuliskan ide atau dokumentasi baru di sini...',
            date: 'Hari ini',
            updatedText: 'Last updated Baru saja',
            checklist: {
                github: [{ id: `item-1`, text: 'Tulis rencana baru di sini', checked: false }],
            },
            tip: 'Catatan baru siap diedit.',
        };
        setNotes([newNote, ...notes]);
        setSelectedNoteId(newId);
    };

    return (
        <>
            <Head title="Notes - WorkTrack" />

            {/* Top Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Notes
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Capture ideas, documentation, and anything important.
                    </p>
                </div>

                <button
                    onClick={handleAddNewNote}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>New Note</span>
                </button>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="worktrack-notes-layout">
                {/* Left Column: Notes List & Filter */}
                <div className="worktrack-notes-list space-y-3.5 w-full">
                    {/* Filter & Search Bar */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-[#0e1d47] border border-slate-200/90 dark:border-[#1e346e] rounded-md pl-9 pr-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="appearance-none bg-white dark:bg-[#0e1d47] border border-slate-200/90 dark:border-[#1e346e] text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-7 py-2 cursor-pointer focus:outline-none focus:border-blue-500 shadow-xs"
                            >
                                <option value="All">All Categories</option>
                                <option value="Idea">Idea</option>
                                <option value="Technical">Technical</option>
                                <option value="Meeting">Meeting</option>
                                <option value="Design">Design</option>
                                <option value="Troubleshooting">Troubleshooting</option>
                                <option value="Personal">Personal</option>
                                <option value="Learning">Learning</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    {/* Notes List Container */}
                    <div className="space-y-2.5">
                        {filteredNotes.map((note) => {
                            const NoteIcon = note.icon;
                            const isSelected = note.id === selectedNoteId;

                            return (
                                <div
                                    key={note.id}
                                    onClick={() => setSelectedNoteId(note.id)}
                                    className={`bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 border transition-all cursor-pointer shadow-xs group ${
                                        isSelected
                                            ? 'border-blue-500/80 dark:border-blue-500/80 bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-blue-500/20'
                                            : 'border-slate-200/80 dark:border-[#1e346e] hover:border-slate-300 dark:hover:border-[#2b4486]'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div
                                            className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${note.iconColor}`}
                                        >
                                            <NoteIcon className="w-4.5 h-4.5" />
                                        </div>

                                        {/* Text Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-1">
                                                <h3
                                                    className={`text-sm font-bold truncate transition-colors ${
                                                        isSelected
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                    }`}
                                                >
                                                    {note.title}
                                                </h3>
                                                <span className="text-xs text-slate-400 dark:text-slate-400 shrink-0 font-medium ml-1">
                                                    {note.date}
                                                </span>
                                            </div>

                                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                                {note.excerpt}
                                            </p>

                                            {/* Badge */}
                                            <div className="mt-2.5">
                                                <span
                                                    className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md ${note.categoryBg}`}
                                                >
                                                    {note.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredNotes.length === 0 && (
                            <div className="p-6 text-center text-sm text-slate-400 bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e]">
                                Tidak ada catatan yang cocok dengan pencarian.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Note Detail / Rich Text Editor */}
                <div className="worktrack-notes-editor w-full">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col min-h-[580px] overflow-hidden">
                        {/* Note Top Header */}
                        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${activeNote.iconColor}`}
                                >
                                    <activeNote.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                            {activeNote.title}
                                        </h2>
                                        <span
                                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${activeNote.categoryBg}`}
                                        >
                                            {activeNote.category}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                                        {activeNote.updatedText}
                                    </p>
                                </div>
                            </div>

                            {/* Header Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-[#243e80] rounded-md transition-colors">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteNote(activeNote.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Rich Text Toolbar */}
                        <div className="px-4 sm:px-6 py-2.5 bg-[#f8fafc] dark:bg-[#0c183b] border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
                            <div className="flex flex-wrap items-center gap-1.5">
                                {/* Paragraph Dropdown */}
                                <div className="relative">
                                    <select className="appearance-none bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none">
                                        <option>Paragraph</option>
                                        <option>Heading 1</option>
                                        <option>Heading 2</option>
                                        <option>Heading 3</option>
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1.5" />

                                {/* Text Formats */}
                                <button
                                    title="Bold"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <Bold className="w-4 h-4" />
                                </button>
                                <button
                                    title="Italic"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <Italic className="w-4 h-4" />
                                </button>
                                <button
                                    title="Underline"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <UnderlineIcon className="w-4 h-4" />
                                </button>

                                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1.5" />

                                {/* Lists */}
                                <button
                                    title="Bullet List"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    title="Numbered List"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <ListOrdered className="w-4 h-4" />
                                </button>

                                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1.5" />

                                {/* Inserts */}
                                <button
                                    title="Insert Link"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <Link2 className="w-4 h-4" />
                                </button>
                                <button
                                    title="Insert Image"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                <button
                                    title="Insert Code"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <Code className="w-4 h-4" />
                                </button>
                                <button
                                    title="Insert Quote"
                                    className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-700 dark:text-slate-200"
                                >
                                    <Quote className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Fullscreen Button */}
                            <button
                                title="Expand"
                                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Note Body Area */}
                        <div className="p-5 sm:p-6 flex-1 space-y-5 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed overflow-y-auto max-h-[540px]">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                    {activeNote.title}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                    {activeNote.checklist
                                        ? 'Beberapa ide fitur yang bisa dikembangkan untuk versi selanjutnya:'
                                        : activeNote.excerpt}
                                </p>
                            </div>

                            {/* Interactive Checklist Sections if active note has them */}
                            {activeNote.checklist ? (
                                <div className="space-y-4">
                                    {/* 1. Integrasi GitHub */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                            1. Integrasi GitHub
                                        </h4>
                                        <div className="space-y-2 pl-1">
                                            {activeNote.checklist.github.map((item) => (
                                                <label
                                                    key={item.id}
                                                    onClick={() => toggleCheckItem('github', item.id)}
                                                    className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 cursor-pointer group py-0.5"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                                            item.checked
                                                                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                                                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-500 bg-white dark:bg-[#122352]'
                                                        }`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                                    </div>
                                                    <span className={item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                                        {item.text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Export Portfolio */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                            2. Export Portfolio
                                        </h4>
                                        <div className="space-y-2 pl-1">
                                            {activeNote.checklist.portfolio.map((item) => (
                                                <label
                                                    key={item.id}
                                                    onClick={() => toggleCheckItem('portfolio', item.id)}
                                                    className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 cursor-pointer group py-0.5"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                                            item.checked
                                                                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                                                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-500 bg-white dark:bg-[#122352]'
                                                        }`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                                    </div>
                                                    <span className={item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                                        {item.text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3. Dark/Light Mode */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                            3. Dark/Light Mode
                                        </h4>
                                        <div className="space-y-2 pl-1">
                                            {activeNote.checklist.theme.map((item) => (
                                                <label
                                                    key={item.id}
                                                    onClick={() => toggleCheckItem('theme', item.id)}
                                                    className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 cursor-pointer group py-0.5"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                                            item.checked
                                                                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                                                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-500 bg-white dark:bg-[#122352]'
                                                        }`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                                    </div>
                                                    <span className={item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                                        {item.text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 4. Statistik Lebih Detail */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                            4. Statistik Lebih Detail
                                        </h4>
                                        <div className="space-y-2 pl-1">
                                            {activeNote.checklist.stats.map((item) => (
                                                <label
                                                    key={item.id}
                                                    onClick={() => toggleCheckItem('stats', item.id)}
                                                    className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 cursor-pointer group py-0.5"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                                            item.checked
                                                                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                                                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-500 bg-white dark:bg-[#122352]'
                                                        }`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                                    </div>
                                                    <span className={item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                                        {item.text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 5. Fitur Lainnya */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                            5. Fitur Lainnya
                                        </h4>
                                        <div className="space-y-2 pl-1">
                                            {activeNote.checklist.other.map((item) => (
                                                <label
                                                    key={item.id}
                                                    onClick={() => toggleCheckItem('other', item.id)}
                                                    className="flex items-center gap-3 text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 cursor-pointer group py-0.5"
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                                            item.checked
                                                                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                                                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-500 bg-white dark:bg-[#122352]'
                                                        }`}
                                                    >
                                                        {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                                    </div>
                                                    <span className={item.checked ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                                        {item.text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tip Callout at bottom */}
                                    {activeNote.tip && (
                                        <div className="pt-3 flex items-center gap-2.5 text-sm italic text-slate-600 dark:text-slate-300 font-medium">
                                            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                                            <span>{activeNote.tip}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                        Dokumentasi detail mengenai <strong>{activeNote.title}</strong>. Anda dapat
                                        menambahkan poin-poin penting, ringkasan riset, dan panduan langkah kerja di
                                        sini.
                                    </p>
                                    <div className="p-3.5 bg-slate-50 dark:bg-[#0c183b] rounded-md border border-slate-200/60 dark:border-[#1e346e] text-sm text-slate-500 dark:text-slate-400">
                                        Tekan tombol <strong>Update Note</strong> setelah menyelesaikan pengeditan.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Status & Action */}
                        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0c183b]/60 flex items-center justify-between gap-3">
                            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {isSavedNotice ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5" /> Berhasil disimpan!
                                    </span>
                                ) : (
                                    'Saved 2 minutes ago'
                                )}
                            </span>

                            <button
                                onClick={handleSaveNote}
                                className="px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                            >
                                Update Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Notes.layout = (page) => <DashboardLayout activePage="Notes">{page}</DashboardLayout>;

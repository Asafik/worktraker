import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Home,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Plus,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    MoreHorizontal,
    Check,
    ArrowRight,
    X,
    Filter,
    Bell,
    BellRing,
    RefreshCw,
    ExternalLink,
    Smartphone,
    Sparkles,
    Settings as SettingsIcon,
} from 'lucide-react';

const GoogleCalendarIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#4285F4" />
        <rect x="3" y="4" width="18" height="5.5" fill="#1A73E8" rx="2" />
        <circle cx="7" cy="6.8" r="1" fill="white" />
        <circle cx="17" cy="6.8" r="1" fill="white" />
        <text x="12" y="17" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
    </svg>
);

export default function CalendarPage() {
    const [viewMode, setViewMode] = useState('Month'); // Month, Week, Day
    const [selectedMonth, setSelectedMonth] = useState('September 2025');
    const [quickAddTab, setQuickAddTab] = useState('Task');
    const [quickAddTitle, setQuickAddTitle] = useState('');
    const [quickAddDate, setQuickAddDate] = useState('16/09/2025');
    const [quickAddTime, setQuickAddTime] = useState('10:00');
    const [quickAddProject, setQuickAddProject] = useState('Company Website');
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState('Task');
    const [newEventDate, setNewEventDate] = useState('2025-09-16');
    const [newEventTime, setNewEventTime] = useState('14:00');

    // Google Calendar & Morning Notification States
    const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [morningReminderTime, setMorningReminderTime] = useState('07:00');
    const [isMorningAlertActive, setIsMorningAlertActive] = useState(true);
    const [syncWithGoogleCalendar, setSyncWithGoogleCalendar] = useState(true);

    const handleSyncGoogleCalendar = () => {
        setIsSyncingCalendar(true);
        setTimeout(() => {
            setIsSyncingCalendar(false);
            setToastMessage('Jadwal & notifikasi pengingat pagi berhasil disinkronkan ke Google Calendar!');
            setTimeout(() => setToastMessage(null), 4000);
        }, 1200);
    };

    // Today's Agenda Checklist State
    const [todayAgenda, setTodayAgenda] = useState([
        {
            id: 1,
            title: 'Dashboard Development',
            time: '10:00 - 12:00',
            tag: 'Company Website',
            tagColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            completed: false,
        },
        {
            id: 2,
            title: 'Update Notes',
            time: '15:00 - 16:00',
            tag: 'Personal',
            tagColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
            completed: false,
        },
        {
            id: 3,
            title: 'Read documentation',
            time: '16:00 - 17:00',
            tag: 'API Integration',
            tagColor: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40',
            completed: false,
        },
    ]);

    const toggleAgendaItem = (id) => {
        setTodayAgenda(
            todayAgenda.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!quickAddTitle.trim()) return;

        const newItem = {
            id: Date.now(),
            title: quickAddTitle,
            time: `${quickAddTime} - ${(parseInt(quickAddTime.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
            tag: quickAddProject || 'General',
            tagColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            completed: false,
        };

        setTodayAgenda([...todayAgenda, newItem]);
        setQuickAddTitle('');
    };

    // Calendar grid data (September 2025: starts on Monday Sept 1st, ended Sept 30th on Tuesday)
    // 35 days matching the screenshot:
    // Prev month: 25, 26, 27, 28, 29, 30, 31 (grayed)
    // Sept: 1 to 30
    // Next month: 1, 2, 3, 4, 5 (grayed)
    const calendarDays = [
        // Row 1: Prev month
        { day: 25, isCurrentMonth: false },
        { day: 26, isCurrentMonth: false },
        { day: 27, isCurrentMonth: false },
        { day: 28, isCurrentMonth: false },
        { day: 29, isCurrentMonth: false },
        { day: 30, isCurrentMonth: false },
        { day: 31, isCurrentMonth: false },

        // Row 2: 1 - 7
        { day: 1, isCurrentMonth: true },
        {
            day: 2,
            isCurrentMonth: true,
            events: [
                {
                    time: '10:00',
                    title: 'Planning App',
                    dot: 'bg-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40',
                },
            ],
        },
        {
            day: 3,
            isCurrentMonth: true,
            events: [
                {
                    time: '14:00',
                    title: 'UI Design',
                    dot: 'bg-rose-500',
                    bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40',
                },
            ],
        },
        { day: 4, isCurrentMonth: true },
        {
            day: 5,
            isCurrentMonth: true,
            events: [
                {
                    time: '09:00',
                    title: 'Daily Review',
                    dot: 'bg-emerald-500',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40',
                },
            ],
        },
        { day: 6, isCurrentMonth: true },
        { day: 7, isCurrentMonth: true },

        // Row 3: 8 - 14
        { day: 8, isCurrentMonth: true },
        {
            day: 9,
            isCurrentMonth: true,
            events: [
                {
                    time: '13:00',
                    title: 'API Integration',
                    dot: 'bg-purple-500',
                    bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40',
                },
            ],
        },
        {
            day: 10,
            isCurrentMonth: true,
            events: [
                {
                    time: '10:00',
                    title: 'Meeting',
                    dot: 'bg-amber-500',
                    bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40',
                },
            ],
        },
        { day: 11, isCurrentMonth: true },
        {
            day: 12,
            isCurrentMonth: true,
            events: [
                {
                    time: '15:00',
                    title: 'Fix Bug',
                    dot: 'bg-rose-500',
                    bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40',
                },
            ],
        },
        { day: 13, isCurrentMonth: true },
        { day: 14, isCurrentMonth: true },

        // Row 4: 15 - 21
        {
            day: 15,
            isCurrentMonth: true,
            events: [
                {
                    time: '09:00',
                    title: 'Write Docs',
                    dot: 'bg-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40',
                },
            ],
        },
        {
            day: 16,
            isCurrentMonth: true,
            isToday: true,
            events: [
                {
                    time: '10:00',
                    title: 'Dashboard',
                    dot: 'bg-emerald-500',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40',
                },
                {
                    time: '15:00',
                    title: 'Update Notes',
                    dot: 'bg-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40',
                },
            ],
        },
        { day: 17, isCurrentMonth: true },
        {
            day: 18,
            isCurrentMonth: true,
            events: [
                {
                    time: '14:00',
                    title: 'Testing',
                    dot: 'bg-purple-500',
                    bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40',
                },
            ],
        },
        { day: 19, isCurrentMonth: true },
        { day: 20, isCurrentMonth: true },
        { day: 21, isCurrentMonth: true },

        // Row 5: 22 - 28
        { day: 22, isCurrentMonth: true },
        {
            day: 23,
            isCurrentMonth: true,
            events: [
                {
                    time: '10:00',
                    title: 'Client Review',
                    dot: 'bg-amber-500',
                    bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40',
                },
            ],
        },
        {
            day: 24,
            isCurrentMonth: true,
            events: [
                {
                    time: '13:00',
                    title: 'Deployment',
                    dot: 'bg-rose-500',
                    bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40',
                },
            ],
        },
        { day: 25, isCurrentMonth: true },
        {
            day: 26,
            isCurrentMonth: true,
            events: [
                {
                    time: '09:00',
                    title: 'Planning',
                    dot: 'bg-blue-500',
                    bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40',
                },
            ],
        },
        { day: 27, isCurrentMonth: true },
        { day: 28, isCurrentMonth: true },

        // Row 6: 29 - 30 + next month
        {
            day: 29,
            isCurrentMonth: true,
            events: [
                {
                    time: '10:00',
                    title: 'Portfolio',
                    dot: 'bg-emerald-500',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40',
                },
            ],
        },
        { day: 30, isCurrentMonth: true },
        { day: 1, isCurrentMonth: false },
        { day: 2, isCurrentMonth: false },
        { day: 3, isCurrentMonth: false },
        { day: 4, isCurrentMonth: false },
        { day: 5, isCurrentMonth: false },
    ];

    // Mini calendar days
    const miniCalendarDays = [
        { day: '', empty: true },
        { day: '', empty: true },
        { day: '', empty: true },
        { day: '', empty: true },
        { day: '', empty: true },
        { day: '', empty: true },
        { day: '', empty: true },
        { day: 1 },
        { day: 2, hasEvent: true },
        { day: 3 },
        { day: 4, hasEvent: true },
        { day: 5 },
        { day: 6 },
        { day: 7, hasEvent: true },
        { day: 8, hasEvent: true },
        { day: 9 },
        { day: 10 },
        { day: 11 },
        { day: 12 },
        { day: 13 },
        { day: 14 },
        { day: 15 },
        { day: 16, isToday: true },
        { day: 17 },
        { day: 18 },
        { day: 19 },
        { day: 20 },
        { day: 21 },
        { day: 22 },
        { day: 23 },
        { day: 24 },
        { day: 25 },
        { day: 26 },
        { day: 27 },
        { day: 28 },
        { day: 29 },
        { day: 30 },
        { day: 1, isNextMonth: true },
        { day: 2, isNextMonth: true },
        { day: 3, isNextMonth: true },
        { day: 4, isNextMonth: true },
        { day: 5, isNextMonth: true },
    ];

    // Upcoming list
    const upcomingList = [
        {
            id: 1,
            title: 'Dashboard Development',
            time: 'Today, 10:00 - 12:00',
            type: 'Project',
            project: 'Company Website',
            dot: 'bg-blue-500',
        },
        {
            id: 2,
            title: 'Update Notes',
            time: 'Today, 15:00 - 16:00',
            type: 'Note',
            project: 'Personal',
            dot: 'bg-blue-500',
        },
        {
            id: 3,
            title: 'Testing & QA',
            time: '18 Sep 2025, 14:00 - 16:00',
            type: 'Task',
            project: 'Mobile App',
            dot: 'bg-purple-500',
        },
        {
            id: 4,
            title: 'Client Review',
            time: '23 Sep 2025, 10:00 - 11:00',
            type: 'Meeting',
            project: 'Company Website',
            dot: 'bg-amber-500',
        },
        {
            id: 5,
            title: 'Planning Next Sprint',
            time: '26 Sep 2025, 09:00 - 10:00',
            type: 'Task',
            project: 'Personal',
            dot: 'bg-blue-500',
        },
    ];

    // Event Types Legend
    const eventTypes = [
        { name: 'Task', dot: 'bg-blue-500' },
        { name: 'Note', dot: 'bg-purple-500' },
        { name: 'Project', dot: 'bg-emerald-500' },
        { name: 'Deadline', dot: 'bg-rose-500' },
        { name: 'Meeting', dot: 'bg-amber-500' },
        { name: 'Personal', dot: 'bg-slate-500' },
    ];

    return (
        <>
            <Head title="Calendar - WorkTrack" />

            <div className="space-y-6">
                {/* 1. Page Header & Action Controls */}
                <div className="space-y-4">
                    {/* Top Row: Breadcrumbs on Left, + Add Event on Far Right */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <Home className="w-3.5 h-3.5 text-slate-400" />
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300 font-medium">Calendar</span>
                        </div>

                        {/* Top-Right: + Add Event Button */}
                        <button
                            onClick={() => setIsAddEventOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                        >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Add Event</span>
                        </button>
                    </div>

                    {/* Second Row: Title & Subtitle (Left), Calendar Controls (Right) */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Calendar
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Plan your work, keep track of deadlines, and stay productive.
                            </p>
                        </div>

                        {/* Calendar Controls Toolbar */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Today button */}
                            <button
                                onClick={() => setSelectedMonth('September 2025')}
                                className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0e1d47] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs"
                            >
                                Today
                            </button>

                            {/* Prev Arrow Button */}
                            <button className="p-2 rounded-md border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0e1d47] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs">
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Next Arrow Button */}
                            <button className="p-2 rounded-md border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0e1d47] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs">
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Month Select */}
                            <div className="relative">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="appearance-none bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none shadow-xs"
                                >
                                    <option value="September 2025">September 2025</option>
                                    <option value="October 2025">October 2025</option>
                                    <option value="November 2025">November 2025</option>
                                    <option value="December 2025">December 2025</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* View Switcher: Month / Week / Day */}
                            <div className="inline-flex rounded-md bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] p-0.5 shadow-xs">
                                {['Month', 'Week', 'Day'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`px-3.5 py-1 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                                            viewMode === mode
                                                ? 'bg-[#2563eb] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xl border border-emerald-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Google Calendar Morning Notification & Sync Banner */}
                <div className="bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/70 dark:from-[#0b1b42] dark:via-[#0e1d47] dark:to-[#112456] rounded-lg border border-blue-200/80 dark:border-blue-900/60 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-11 h-11 rounded-lg bg-white dark:bg-[#132659] border border-blue-100 dark:border-blue-900/80 flex items-center justify-center shrink-0 shadow-2xs">
                            <GoogleCalendarIcon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    Google Calendar Connected
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    ronismk7@gmail.com
                                </span>
                                {isMorningAlertActive ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                                        <BellRing className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                        Notifikasi Pagi {morningReminderTime} WIB Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                        Notifikasi Nonaktif
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Setiap pagi pukul <strong className="font-semibold text-slate-900 dark:text-white">{morningReminderTime} WIB</strong>, rangkuman tugas, deadline proyek, dan agenda harian otomatis dikirimkan ke Google Calendar & HP kamu.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                            onClick={handleSyncGoogleCalendar}
                            disabled={isSyncingCalendar}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#192f6d] transition-colors shadow-2xs disabled:opacity-60"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isSyncingCalendar ? 'animate-spin' : ''}`} />
                            <span>{isSyncingCalendar ? 'Menyinkronkan...' : 'Sync Calendar'}</span>
                        </button>
                        <a
                            href="https://calendar.google.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                            <span>Buka Kalender</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* 2. Main Calendar Content (2-Column Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (8 cols): Main Month Grid + Agenda & Quick Add */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Monthly Calendar View */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs overflow-hidden">
                            {/* Days of week header */}
                            <div
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                                className="worktrack-calendar-grid divide-x divide-slate-200/80 dark:divide-[#1e346e] border-b border-slate-200/80 dark:border-[#1e346e] bg-slate-50/70 dark:bg-[#0c183b]/70 text-center py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300"
                            >
                                <div>Mon</div>
                                <div>Tue</div>
                                <div>Wed</div>
                                <div>Thu</div>
                                <div>Fri</div>
                                <div>Sat</div>
                                <div>Sun</div>
                            </div>

                            {/* Calendar Days Matrix (5 weeks / 35 cells) */}
                            <div
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                                className="worktrack-calendar-grid divide-x divide-y divide-slate-100 dark:divide-slate-800/80"
                            >
                                {calendarDays.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`min-h-[86px] sm:min-h-[96px] p-2 flex flex-col justify-between transition-colors hover:bg-slate-50/50 dark:hover:bg-[#122352]/30 ${
                                            !item.isCurrentMonth
                                                ? 'bg-slate-50/30 dark:bg-[#091433]/30'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            {item.isToday ? (
                                                <span className="w-6 h-6 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                                    {item.day}
                                                </span>
                                            ) : (
                                                <span
                                                    className={`text-xs font-bold ${
                                                        item.isCurrentMonth
                                                            ? 'text-slate-800 dark:text-slate-200'
                                                            : 'text-slate-300 dark:text-slate-600'
                                                    }`}
                                                >
                                                    {item.day}
                                                </span>
                                            )}
                                        </div>

                                        {/* Events pill inside calendar day cell */}
                                        <div className="space-y-1 mt-1">
                                            {item.events?.map((ev, evIdx) => (
                                                <div
                                                    key={evIdx}
                                                    className={`px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1.5 truncate shadow-2xs transition-transform hover:scale-[1.02] cursor-pointer ${ev.bg}`}
                                                    title={`${ev.time} ${ev.title}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${ev.dot}`}
                                                    />
                                                    <span className="shrink-0 font-semibold">{ev.time}</span>
                                                    <span className="truncate">{ev.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Today's Agenda & Quick Add */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Today's Agenda Card */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                <CalendarIcon className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                Today's Agenda
                                            </h3>
                                        </div>
                                        <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                                            Tuesday, 16 September 2025
                                        </span>
                                    </div>

                                    {/* Agenda Items list */}
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-1">
                                        {todayAgenda.map((item) => (
                                            <div
                                                key={item.id}
                                                className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        onClick={() => toggleAgendaItem(item.id)}
                                                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                                                            item.completed
                                                                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                                                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#122352] group-hover:border-blue-500'
                                                        }`}
                                                    >
                                                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                                                    </div>
                                                    <span
                                                        className={`font-semibold truncate transition-colors ${
                                                            item.completed
                                                                ? 'line-through text-slate-400 dark:text-slate-500'
                                                                : 'text-slate-800 dark:text-slate-200'
                                                        }`}
                                                    >
                                                        {item.title}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                                                        {item.time}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-0.5 rounded-md ${item.tagColor}`}
                                                    >
                                                        {item.tag}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setQuickAddTitle('Tugas Baru Hari Ini');
                                    }}
                                    className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Add Task for Today</span>
                                </button>
                            </div>

                            {/* Right: Quick Add Card */}
                            <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Add</h3>
                                </div>

                                {/* Segmented Tabs */}
                                <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md text-xs sm:text-sm font-medium">
                                    {['Task', 'Event', 'Note'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setQuickAddTab(tab)}
                                            className={`flex-1 py-1 text-center rounded transition-all ${
                                                quickAddTab === tab
                                                    ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                                                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Quick Add Form */}
                                <form onSubmit={handleQuickAdd} className="space-y-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Task title..."
                                            value={quickAddTitle}
                                            onChange={(e) => setQuickAddTitle(e.target.value)}
                                            className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                value={quickAddDate}
                                                onChange={(e) => setQuickAddDate(e.target.value)}
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-8 pr-7 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                            />
                                            <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                            <CalendarIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                                        </div>

                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                value={quickAddTime}
                                                onChange={(e) => setQuickAddTime(e.target.value)}
                                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-8 pr-7 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                            />
                                            <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                            <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={quickAddProject}
                                            onChange={(e) => setQuickAddProject(e.target.value)}
                                            className="w-full appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-3 pr-8 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="Company Website">Company Website</option>
                                            <option value="Mobile App">Mobile App</option>
                                            <option value="API Integration">API Integration</option>
                                            <option value="UI/UX Enhancement">UI/UX Enhancement</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                                    >
                                        Add Task
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (4 cols): Mini Calendar + Upcoming + Event Types */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Mini Calendar Widget */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    September 2025
                                </h3>
                                <div className="flex items-center gap-1">
                                    <button className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-colors">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Mini Calendar Matrix */}
                            <div>
                                <div
                                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                                    className="worktrack-calendar-grid text-center text-[11px] font-semibold text-slate-400 pb-2"
                                >
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>

                                <div
                                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                                    className="worktrack-calendar-grid text-center gap-y-2 text-xs"
                                >
                                    {miniCalendarDays.map((mDay, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-center py-1">
                                            {mDay.isToday ? (
                                                <span className="w-6 h-6 rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                                                    {mDay.day}
                                                </span>
                                            ) : (
                                                <span
                                                    className={`font-medium ${
                                                        mDay.empty || mDay.isNextMonth
                                                            ? 'text-slate-300 dark:text-slate-600'
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {mDay.day}
                                                </span>
                                            )}
                                            {mDay.hasEvent && !mDay.isToday && (
                                                <span className="w-1 h-1 rounded-full bg-blue-500 mt-0.5" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upcoming (Next 7 Days) */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    Upcoming (Next 7 Days)
                                </h3>
                                <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                                    <span>View All</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="space-y-3.5">
                                {upcomingList.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-3 text-xs sm:text-sm group hover:bg-slate-50/60 dark:hover:bg-[#122352]/30 p-1.5 -mx-1.5 rounded-md transition-colors"
                                    >
                                        <div className="flex items-start gap-2.5 min-w-0">
                                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                    {item.time}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="block text-xs text-slate-400 font-medium">
                                                {item.type}
                                            </span>
                                            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                {item.project}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Event Types Legend */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                                Event Types
                            </h3>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                {eventTypes.map((type, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${type.dot}`} />
                                        <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {type.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Google Calendar & Notifikasi HP Card */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
                                        <GoogleCalendarIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                        Notifikasi HP & Kalender
                                    </h3>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Aktif
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                {/* Setting 1: Jam Notifikasi Pagi */}
                                <div className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 dark:bg-[#122352]/50 border border-slate-100 dark:border-[#1e346e]/80">
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <Bell className="w-3.5 h-3.5 text-blue-500" />
                                            Alarm Notifikasi Pagi
                                        </span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Pengingat agenda harian ke HP
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={morningReminderTime}
                                            onChange={(e) => {
                                                setMorningReminderTime(e.target.value);
                                                setToastMessage(`Waktu alarm pagi diubah ke ${e.target.value} WIB`);
                                                setTimeout(() => setToastMessage(null), 3000);
                                            }}
                                            className="px-2 py-1 rounded bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Setting 2: Checklist Fitur Notifikasi */}
                                <div className="space-y-2 pt-1 text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] shrink-0" />
                                        <span>Rangkuman agenda harian jam {morningReminderTime} WIB</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] shrink-0" />
                                        <span>Pengingat deadline 15 menit & 1 hari sebelumnya</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] shrink-0" />
                                        <span>Target akun: <strong className="text-slate-800 dark:text-slate-200">ronismk7@gmail.com</strong></span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/settings"
                                        className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded-md border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] text-xs font-medium transition-colors"
                                    >
                                        <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Kelola di Pengaturan</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Add Event */}
            {isAddEventOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                Tambah Event Baru
                            </h3>
                            <button
                                onClick={() => setIsAddEventOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Judul Event
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Sprint Review, Meeting Client..."
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tipe Event
                                    </label>
                                    <select
                                        value={newEventType}
                                        onChange={(e) => setNewEventType(e.target.value)}
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="Task">Task</option>
                                        <option value="Note">Note</option>
                                        <option value="Project">Project</option>
                                        <option value="Deadline">Deadline</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Personal">Personal</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Waktu
                                    </label>
                                    <input
                                        type="time"
                                        value={newEventTime}
                                        onChange={(e) => setNewEventTime(e.target.value)}
                                        className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                    >
                                    </input>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Google Calendar Sync Checkbox */}
                            <div className="pt-1">
                                <label className="flex items-center gap-2.5 p-2 rounded-md bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={syncWithGoogleCalendar}
                                        onChange={(e) => setSyncWithGoogleCalendar(e.target.checked)}
                                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                                        <GoogleCalendarIcon className="w-3.5 h-3.5 shrink-0" />
                                        <span>Sinkronkan ke Google Calendar (Notifikasi HP)</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setIsAddEventOpen(false)}
                                className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-md text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    if (!newEventTitle) return;
                                    setTodayAgenda([
                                        ...todayAgenda,
                                        {
                                            id: Date.now(),
                                            title: newEventTitle,
                                            time: newEventTime,
                                            tag: newEventType,
                                            tagColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
                                            completed: false,
                                        },
                                    ]);
                                    setIsAddEventOpen(false);
                                    setToastMessage(
                                        syncWithGoogleCalendar
                                            ? `Event "${newEventTitle}" tersimpan & disinkronkan ke Google Calendar HP kamu!`
                                            : `Event "${newEventTitle}" berhasil ditambahkan!`
                                    );
                                    setTimeout(() => setToastMessage(null), 4000);
                                    setNewEventTitle('');
                                }}
                                className="px-4 py-2 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                            >
                                Simpan Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

CalendarPage.layout = (page) => <DashboardLayout activePage="Calendar">{page}</DashboardLayout>;

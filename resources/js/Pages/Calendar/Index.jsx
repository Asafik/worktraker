import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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

const monthNamesList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const generateCalendarDays = (monthYearStr) => {
    const parts = monthYearStr.split(' ');
    const mName = parts[0];
    const year = parseInt(parts[1], 10);
    const monthIdx = monthNamesList.indexOf(mName);

    const firstDay = new Date(year, monthIdx, 1);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, monthIdx, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const prevMonthIdx = monthIdx === 0 ? 11 : monthIdx - 1;
        const prevYear = monthIdx === 0 ? year - 1 : year;
        const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({
            day: d,
            isCurrentMonth: false,
            dateStr,
            isSunday: false,
            events: [],
        });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, monthIdx, d);
        const dayOfWeek = (dateObj.getDay() + 6) % 7;
        const isSunday = dayOfWeek === 6;
        const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        const isSept2026 = year === 2026 && monthIdx === 8;
        const isToday = isSept2026 && d === 17;
        const isRelaxMode = isSept2026 && d === 4;

        days.push({
            day: d,
            isCurrentMonth: true,
            dateStr,
            isToday,
            isRelaxMode,
            isSunday,
            events: [],
        });
    }

    // Next month padding to fill 35 or 42 grid cells
    const totalCells = days.length > 35 ? 42 : 35;
    const nextDaysNeeded = totalCells - days.length;
    for (let d = 1; d <= nextDaysNeeded; d++) {
        const nextMonthIdx = monthIdx === 11 ? 0 : monthIdx + 1;
        const nextYear = monthIdx === 11 ? year + 1 : year;
        const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dateObj = new Date(nextYear, nextMonthIdx, d);
        const dayOfWeek = (dateObj.getDay() + 6) % 7;
        days.push({
            day: d,
            isCurrentMonth: false,
            dateStr,
            isSunday: dayOfWeek === 6,
            events: [],
        });
    }

    return days;
};

const openGoogleCalendarTemplate = ({ title, date, time, durationMinutes = 60, description = '' }) => {
    try {
        const parts = (date || '2026-09-17').split('-');
        const year = parseInt(parts[0], 10) || 2026;
        const month = parseInt(parts[1], 10) || 9;
        const day = parseInt(parts[2], 10) || 17;

        const timeParts = (time || '09:00').split(':');
        const hours = parseInt(timeParts[0], 10) || 9;
        const minutes = parseInt(timeParts[1], 10) || 0;

        const pad = (n) => String(n).padStart(2, '0');
        const startStr = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;

        let endHours = hours + Math.floor(durationMinutes / 60);
        let endMinutes = minutes + (durationMinutes % 60);
        if (endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60);
            endMinutes = endMinutes % 60;
        }
        let endDay = day;
        if (endHours >= 24) {
            endHours = endHours % 24;
            endDay += 1;
        }
        const endStr = `${year}${pad(month)}${pad(endDay)}T${pad(endHours)}${pad(endMinutes)}00`;

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            dates: `${startStr}/${endStr}`,
            details: description || 'Dibuat melalui WorkTrack',
        });

        const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
        console.error('Error generating Google Calendar URL', err);
    }
};

export default function CalendarPage({
    googleEvents = [],
    isCalendarConnected = true,
    calendarEmail = 'ronismk7@gmail.com',
}) {
    const [viewMode, setViewMode] = useState('Month'); // Month, Week, Day
    const [selectedMonth, setSelectedMonth] = useState('September 2026');
    const [quickAddTab, setQuickAddTab] = useState('Task');
    const [quickAddTitle, setQuickAddTitle] = useState('');
    const [quickAddDate, setQuickAddDate] = useState('17/09/2026');
    const [quickAddTime, setQuickAddTime] = useState('07:30');
    const [quickAddProject, setQuickAddProject] = useState('Tugas Saya');
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState('Task');
    const [newEventDate, setNewEventDate] = useState('2026-09-17');
    const [newEventTime, setNewEventTime] = useState('07:30');

    // Google Calendar & Morning Notification States
    const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [morningReminderTime, setMorningReminderTime] = useState('07:30');
    const [isMorningAlertActive, setIsMorningAlertActive] = useState(true);
    const [syncWithGoogleCalendar, setSyncWithGoogleCalendar] = useState(true);

    // Selected Day Click Modal State
    const [selectedDayModal, setSelectedDayModal] = useState(null);
    const [modalTaskTitle, setModalTaskTitle] = useState('');
    const [modalTaskTime, setModalTaskTime] = useState('07:30');

    // User-created events stored in state mapped by dateStr
    const [localEvents, setLocalEvents] = useState({});

    const handleSyncGoogleCalendar = () => {
        setIsSyncingCalendar(true);
        router.post(
            '/calendar/sync',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSyncingCalendar(false);
                    setLocalEvents({});
                    setToastMessage('Google Calendar synchronized successfully!');
                    setTimeout(() => setToastMessage(null), 4000);
                },
                onError: () => {
                    setIsSyncingCalendar(false);
                    setToastMessage('Failed to sync Google Calendar.');
                    setTimeout(() => setToastMessage(null), 4000);
                },
            }
        );
    };

    const handlePrevMonth = () => {
        const parts = selectedMonth.split(' ');
        const mName = parts[0];
        let y = parseInt(parts[1], 10);
        let idx = monthNamesList.indexOf(mName) - 1;
        if (idx < 0) {
            idx = 11;
            y -= 1;
        }
        setSelectedMonth(`${monthNamesList[idx]} ${y}`);
    };

    const handleNextMonth = () => {
        const parts = selectedMonth.split(' ');
        const mName = parts[0];
        let y = parseInt(parts[1], 10);
        let idx = monthNamesList.indexOf(mName) + 1;
        if (idx > 11) {
            idx = 0;
            y += 1;
        }
        setSelectedMonth(`${monthNamesList[idx]} ${y}`);
    };

    // Calendar grid data computed with real Google Calendar events and local events
    const calendarDays = React.useMemo(() => {
        const baseDays = generateCalendarDays(selectedMonth);
        return baseDays.map((cell) => {
            const cellGoogleEvents = googleEvents.filter((e) => e.date === cell.dateStr);
            const cellLocalEvents = localEvents[cell.dateStr] || [];
            return {
                ...cell,
                events: [...cellGoogleEvents, ...cellLocalEvents],
            };
        });
    }, [selectedMonth, googleEvents, localEvents]);

    // Mini calendar days with dot indicator if has events
    const miniCalendarDays = React.useMemo(() => {
        const baseDays = generateCalendarDays(selectedMonth);
        return baseDays.map((cell) => {
            const hasEvent =
                googleEvents.some((e) => e.date === cell.dateStr) ||
                (localEvents[cell.dateStr] && localEvents[cell.dateStr].length > 0);
            return {
                ...cell,
                hasEvent,
            };
        });
    }, [selectedMonth, googleEvents, localEvents]);

    const handleDayClick = (item, idx) => {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dayName = dayNames[idx % 7];
        const specificEvents = item.events || [];

        setSelectedDayModal({
            ...item,
            idx,
            dayName,
            dateFormatted: `${dayName}, ${item.day} ${item.isCurrentMonth ? selectedMonth : item.dateStr}`,
            events: specificEvents,
        });
    };

    // Today's Agenda Checklist State
    const [todayAgenda, setTodayAgenda] = useState(() => {
        return googleEvents
            .filter((e) => e.date === '2026-09-17')
            .map((e) => ({
                id: e.id,
                title: e.title,
                time: e.time,
                tag: e.type || 'Google Calendar',
                tagColor: e.bg || 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
                completed: false,
            }));
    });

    useEffect(() => {
        const todayEvs = googleEvents
            .filter((e) => e.date === '2026-09-17')
            .map((e) => ({
                id: e.id,
                title: e.title,
                time: e.time,
                tag: e.type || 'Google Calendar',
                tagColor: e.bg || 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
                completed: false,
            }));
        setTodayAgenda(todayEvs);
    }, [googleEvents]);

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
            tag: quickAddProject || 'Tugas Saya',
            tagColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
            completed: false,
        };

        setTodayAgenda([...todayAgenda, newItem]);
        setQuickAddTitle('');
        setToastMessage(`Tugas "${quickAddTitle}" ditambahkan & disinkronkan!`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleAddModalTask = (e) => {
        e.preventDefault();
        if (!modalTaskTitle.trim() || !selectedDayModal) return;

        const newTask = {
            id: Date.now(),
            time: modalTaskTime,
            title: modalTaskTitle,
            fullTitle: modalTaskTitle,
            dot: 'bg-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40',
            type: 'Task',
        };

        const targetDate = selectedDayModal.dateStr;
        setLocalEvents((prev) => ({
            ...prev,
            [targetDate]: [...(prev[targetDate] || []), newTask],
        }));

        setSelectedDayModal((prev) => ({
            ...prev,
            events: [...(prev.events || []), newTask],
        }));

        if (syncWithGoogleCalendar) {
            openGoogleCalendarTemplate({
                title: modalTaskTitle,
                date: targetDate,
                time: modalTaskTime,
                description: `Created via WorkTrack for ${selectedDayModal.dateFormatted}`,
            });
            setToastMessage(`Task "${modalTaskTitle}" saved & opened in Google Calendar! Click Save in the new tab.`);
        } else {
            setToastMessage(`Task "${modalTaskTitle}" added successfully!`);
        }
        setTimeout(() => setToastMessage(null), 5000);
        setModalTaskTitle('');
    };

    // Upcoming list generated dynamically from real Google Calendar events
    const upcomingList = (
        googleEvents.filter((e) => e.date >= '2026-09-17').length > 0
            ? googleEvents.filter((e) => e.date >= '2026-09-17')
            : googleEvents
    )
        .slice(0, 5)
        .map((e) => ({
            id: e.id,
            title: e.title,
            time: `${e.date} • ${e.time}`,
            type: e.type || 'Google Calendar',
            project: e.location || 'Google Calendar',
            dot: e.dot || 'bg-blue-500',
        }));

    // Event Types Legend
    const eventTypes = [
        { name: 'My Tasks (Google)', dot: 'bg-blue-500' },
        { name: 'National Holiday', dot: 'bg-rose-500' },
        { name: 'Flexible Office Hours', dot: 'bg-rose-500' },
        { name: 'Project', dot: 'bg-emerald-500' },
        { name: 'Deadline', dot: 'bg-rose-500' },
        { name: 'Meeting', dot: 'bg-amber-500' },
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
                                onClick={() => setSelectedMonth('September 2026')}
                                className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0e1d47] text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs"
                            >
                                Today
                            </button>

                            {/* Prev Arrow Button */}
                            <button
                                onClick={handlePrevMonth}
                                title="Previous Month"
                                className="p-2 rounded-md border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0e1d47] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Next Arrow Button */}
                            <button
                                onClick={handleNextMonth}
                                title="Next Month"
                                className="p-2 rounded-md border border-slate-200 dark:border-[#243e80] bg-white dark:bg-[#0e1d47] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors shadow-xs cursor-pointer"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Month Select */}
                            <div className="relative">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="appearance-none bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none shadow-xs"
                                >
                                    <option value="May 2022">May 2022</option>
                                    <option value="December 2023">December 2023</option>
                                    <option value="February 2024">February 2024</option>
                                    <option value="March 2024">March 2024</option>
                                    <option value="September 2026">September 2026</option>
                                    <option value="October 2026">October 2026</option>
                                    <option value="November 2026">November 2026</option>
                                    <option value="December 2026">December 2026</option>
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
                                <div className="text-rose-600 dark:text-rose-400 font-bold">Sun</div>
                            </div>

                            {/* Calendar Days Matrix (5 weeks / 35 cells) */}
                            <div
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                                className="worktrack-calendar-grid divide-x divide-y divide-slate-100 dark:divide-slate-800/80"
                            >
                                {calendarDays.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleDayClick(item, idx)}
                                        className={`min-h-[86px] sm:min-h-[96px] p-2 flex flex-col justify-between transition-all cursor-pointer group hover:bg-blue-50/40 dark:hover:bg-[#122352]/50 hover:ring-1.5 hover:ring-blue-500/40 ${
                                            !item.isCurrentMonth
                                                ? 'bg-slate-50/30 dark:bg-[#091433]/30'
                                                : item.isSunday || item.isRelaxMode || item.isHoliday
                                                ? 'bg-rose-50/20 dark:bg-rose-950/10'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-1">
                                            {item.isToday ? (
                                                <span className="w-6 h-6 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                                                    {item.day}
                                                </span>
                                            ) : (
                                                <span
                                                    className={`text-xs font-bold ${
                                                        item.isSunday || item.isHoliday || item.isRelaxMode
                                                            ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                                                            : item.isCurrentMonth
                                                            ? 'text-slate-800 dark:text-slate-200'
                                                            : 'text-slate-300 dark:text-slate-600'
                                                    }`}
                                                >
                                                    {item.day}
                                                </span>
                                            )}

                                            {item.isHoliday && item.holidayName && (
                                                <span
                                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 shadow-2xs truncate max-w-[125px]"
                                                    title={item.holidayName}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                                    <span className="truncate">{item.holidayName}</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Relax Mode Notice if national holiday */}
                                        {item.isRelaxMode && (
                                            <div className="mt-1 flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                                <span className="truncate">Flexible Hours • Office Day</span>
                                            </div>
                                        )}

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
                                            Thursday, 17 September 2026
                                        </span>
                                    </div>

                                    {/* Agenda Items list */}
                                    {todayAgenda.length > 0 ? (
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
                                    ) : (
                                        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                                            No tasks scheduled for today. Use Quick Add or click any date to add a task.
                                        </div>
                                    )}
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
                                    September 2026
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
                                    <span className="text-rose-600 dark:text-rose-400 font-bold">Sun</span>
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
                                                            : mDay.isSunday || mDay.isHoliday || mDay.isRelaxMode
                                                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                                                            : 'text-slate-700 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {mDay.day}
                                                </span>
                                            )}
                                            {mDay.hasEvent && !mDay.isToday && (
                                                <span className={`w-1 h-1 rounded-full mt-0.5 ${mDay.isHoliday ? 'bg-rose-500' : 'bg-blue-500'}`} />
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

                            {upcomingList.length > 0 ? (
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
                            ) : (
                                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                                    No upcoming events.
                                </div>
                            )}
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
                                        Device & Calendar Alerts
                                    </h3>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                {/* Setting 1: Jam Notifikasi Pagi */}
                                <div className="flex items-center justify-between p-2.5 rounded-md bg-slate-50 dark:bg-[#122352]/50 border border-slate-100 dark:border-[#1e346e]/80">
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <Bell className="w-3.5 h-3.5 text-blue-500" />
                                            Daily Morning Reminder
                                        </span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Agenda summary sent to device
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={morningReminderTime}
                                            onChange={(e) => {
                                                setMorningReminderTime(e.target.value);
                                                setToastMessage(`Daily morning reminder updated to ${e.target.value}`);
                                                setTimeout(() => setToastMessage(null), 3000);
                                            }}
                                            className="px-2 py-1 rounded bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#243e80] text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Setting: Mode Jam Santai saat Tanggal Merah */}
                                <div className="flex items-center justify-between p-2.5 rounded-md bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            Flexible Hours (Holiday Office Day)
                                        </span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Office work with flexible rhythm
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
                                        Active
                                    </span>
                                </div>

                                {/* Setting 2: Checklist Fitur Notifikasi */}
                                <div className="space-y-2 pt-1 text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] shrink-0" />
                                        <span>Daily morning agenda routine at {morningReminderTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] shrink-0" />
                                        <span>15 min & 1 day advance deadline alerts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5] shrink-0" />
                                        <span>Sync account: <strong className="text-slate-800 dark:text-slate-200">{calendarEmail || 'ronismk7@gmail.com'}</strong></span>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <button
                                        type="button"
                                        onClick={handleSyncGoogleCalendar}
                                        disabled={isSyncingCalendar}
                                        className="w-full py-2 px-3 flex items-center justify-center gap-2 rounded-md bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#2563eb] dark:text-blue-300 text-xs font-semibold border border-blue-200/80 dark:border-blue-900/40 transition-colors disabled:opacity-60 cursor-pointer shadow-2xs"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCalendar ? 'animate-spin' : ''}`} />
                                        <span>{isSyncingCalendar ? 'Syncing Google Calendar...' : 'Sync Google Calendar Now'}</span>
                                    </button>

                                    <Link
                                        href="/settings"
                                        className="w-full py-1.5 flex items-center justify-center gap-1.5 rounded-md border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] text-xs font-medium transition-colors"
                                    >
                                        <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Manage in Settings</span>
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
                                    const newTask = {
                                        id: Date.now(),
                                        title: newEventTitle,
                                        time: newEventTime,
                                        tag: newEventType,
                                        tagColor: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40',
                                        completed: false,
                                    };

                                    setLocalEvents((prev) => ({
                                        ...prev,
                                        [newEventDate]: [
                                            ...(prev[newEventDate] || []),
                                            {
                                                id: newTask.id,
                                                time: newEventTime,
                                                title: newEventTitle,
                                                fullTitle: newEventTitle,
                                                dot: 'bg-blue-500',
                                                bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40',
                                                type: newEventType,
                                            },
                                        ],
                                    }));

                                    if (newEventDate === '2026-09-17') {
                                        setTodayAgenda((prev) => [...prev, newTask]);
                                    }

                                    if (syncWithGoogleCalendar) {
                                        openGoogleCalendarTemplate({
                                            title: newEventTitle,
                                            date: newEventDate,
                                            time: newEventTime,
                                            description: `Category: ${newEventType} - Created via WorkTrack`,
                                        });
                                        setToastMessage(`Event "${newEventTitle}" tersimpan & Google Calendar telah dibuka! Silakan klik Save.`);
                                    } else {
                                        setToastMessage(`Event "${newEventTitle}" berhasil ditambahkan!`);
                                    }

                                    setIsAddEventOpen(false);
                                    setTimeout(() => setToastMessage(null), 5000);
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

            {/* Modal: Detail Tanggal & Agenda (Saat Tanggal Kalender Diklik) */}
            {selectedDayModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        {selectedDayModal.dateFormatted}
                                    </h3>
                                    {selectedDayModal.isToday && (
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#2563eb] text-white">
                                            Today
                                        </span>
                                    )}
                                    {selectedDayModal.isHoliday && selectedDayModal.holidayName && (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                            <span>{selectedDayModal.holidayName}</span>
                                        </span>
                                    )}
                                    {selectedDayModal.isSunday && (
                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                                            Weekend
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {selectedDayModal.isRelaxMode
                                        ? 'Flexible work rhythm & office hours.'
                                        : selectedDayModal.isSunday
                                        ? 'Weekend. No scheduled office hours.'
                                        : 'Regular workday with Google Calendar sync.'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedDayModal(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mode Banner */}
                        {selectedDayModal.isRelaxMode ? (
                            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300">
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                <div>
                                    <span className="font-bold text-rose-800 dark:text-rose-200">Flexible Hours Mode</span>
                                    <p className="text-rose-700/90 dark:text-rose-300/80 mt-0.5">
                                        Office day with relaxed and flexible pace.
                                    </p>
                                </div>
                            </div>
                        ) : selectedDayModal.isSunday ? (
                            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300">
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                <span>Weekend. No mandatory work agenda.</span>
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3 text-xs text-blue-700 dark:text-blue-300">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                <span>Regular workday. Google Calendar morning reminder set for {morningReminderTime} AM.</span>
                            </div>
                        )}

                        {/* Event / Agenda List */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                    Events & Tasks ({selectedDayModal.events?.length || 0})
                                </h4>
                                <span className="text-[11px] text-slate-400">
                                    Google Calendar Synced
                                </span>
                            </div>

                            {selectedDayModal.events && selectedDayModal.events.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedDayModal.events.map((ev, i) => (
                                        <div
                                            key={i}
                                            className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#122352]/30 flex items-center justify-between gap-3 text-xs sm:text-sm"
                                        >
                                            <div className="flex items-start gap-2.5 min-w-0">
                                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ev.dot || 'bg-blue-500'}`} />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                                                        {ev.fullTitle || ev.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
                                                        <span className="flex items-center gap-1 font-medium">
                                                            <Clock className="w-3 h-3 text-slate-400" />
                                                            {ev.time}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                                            {ev.type || 'Google Calendar'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => openGoogleCalendarTemplate({
                                                        title: ev.fullTitle || ev.title,
                                                        date: selectedDayModal.dateStr,
                                                        time: ev.time?.includes(':') ? ev.time.split(' ')[0] : '09:00',
                                                        description: ev.description || '',
                                                    })}
                                                    title="Open in Google Calendar"
                                                    className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60">
                                                    Synced
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                                    No scheduled events for this date. Add a new task below!
                                </div>
                            )}
                        </div>

                        {/* Quick Add Form in Modal */}
                        <form onSubmit={handleAddModalTask} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                + Add Task for This Day
                            </h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter new task or meeting title..."
                                    value={modalTaskTitle}
                                    onChange={(e) => setModalTaskTitle(e.target.value)}
                                    className="flex-1 bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="time"
                                    value={modalTaskTime}
                                    onChange={(e) => setModalTaskTime(e.target.value)}
                                    className="w-28 bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-2 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={syncWithGoogleCalendar}
                                        onChange={(e) => setSyncWithGoogleCalendar(e.target.checked)}
                                        className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300"
                                    />
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <GoogleCalendarIcon className="w-3.5 h-3.5 shrink-0" />
                                        <span>Sync & Open in Google Calendar</span>
                                    </span>
                                </label>
                                <button
                                    type="submit"
                                    disabled={!modalTaskTitle.trim()}
                                    className="px-4 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                                >
                                    Save Task
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setSelectedDayModal(null)}
                                className="px-4 py-2 border border-slate-200 dark:border-[#243e80] rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

CalendarPage.layout = (page) => <DashboardLayout activePage="Calendar">{page}</DashboardLayout>;

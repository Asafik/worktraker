import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Folder,
    CheckCircle2,
    Clock,
    BarChart2,
    ArrowUp,
    Calendar as CalendarIcon,
    ArrowRight,
    Monitor,
    Database,
    Smartphone,
    Globe,
    FileText,
    CheckSquare,
    Lightbulb,
    MessageSquare,
    BookOpen,
    Plus,
    Sparkles,
} from 'lucide-react';

export default function Dashboard({
    greeting = {},
    stats = {},
    chart_days = [],
    task_distribution = {},
    recent_projects = [],
    upcoming_tasks = [],
    recent_notes = [],
}) {
    // Local interactive tasks state with optimistic toggle
    const [localTasks, setLocalTasks] = useState(upcoming_tasks || []);

    useEffect(() => {
        setLocalTasks(upcoming_tasks || []);
    }, [upcoming_tasks]);

    // Async GitHub commit dates state with skeleton loading
    const [githubCommitDates, setGithubCommitDates] = useState({});
    const [loadingCommits, setLoadingCommits] = useState(true);

    useEffect(() => {
        if (!recent_projects || recent_projects.length === 0) return;

        // Find projects that need GitHub commit date (no due_date but have github_repo_name)
        const needsCommitDate = recent_projects.filter(
            (p) => !p.due_date && p.github_repo_name
        );

        if (needsCommitDate.length === 0) return;

        setLoadingCommits(true);
        const params = new URLSearchParams();
        needsCommitDate.forEach((p) => params.append('project_ids[]', p.id));

        fetch(`/dashboard/github-commit-dates?${params.toString()}`)
            .then((res) => (res.ok ? res.json() : {}))
            .then((data) => {
                setGithubCommitDates((prev) => ({ ...prev, ...data }));
            })
            .catch(() => {})
            .finally(() => {
                setLoadingCommits(false);
            });
    }, [recent_projects]);

    const handleToggleTask = (e, taskId) => {
        e.preventDefault();
        e.stopPropagation();

        setLocalTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
        );

        router.post(
            `/tasks/${taskId}/toggle`,
            {},
            {
                preserveScroll: true,
                onError: () => {
                    setLocalTasks(upcoming_tasks || []);
                },
            }
        );
    };

    // Calculate dynamic coordinates for Productivity Overview Area Chart
    const computedPoints = useMemo(() => {
        const rawDays =
            chart_days && chart_days.length > 0
                ? chart_days
                : [
                      { day: 'Mon', val: 0, date: '15 Sep' },
                      { day: 'Tue', val: 0, date: '16 Sep' },
                      { day: 'Wed', val: 0, date: '17 Sep' },
                      { day: 'Thu', val: 0, date: '18 Sep' },
                      { day: 'Fri', val: 0, date: '19 Sep' },
                      { day: 'Sat', val: 0, date: '20 Sep' },
                      { day: 'Sun', val: 0, date: '21 Sep' },
                  ];

        const maxVal = Math.max(...rawDays.map((d) => d.val || 0), 4);
        const yTop = 45;
        const yBottom = 165;
        const yRange = yBottom - yTop;

        return rawDays.map((d, i) => {
            const x = 20 + i * 55;
            const val = d.val || 0;
            const y = yBottom - (val / maxVal) * yRange;
            return {
                ...d,
                x,
                y,
            };
        });
    }, [chart_days]);

    const [activePoint, setActivePoint] = useState(null);

    useEffect(() => {
        if (computedPoints.length > 0) {
            // Default to today or the last day point
            const todayPoint = computedPoints.find((p) => p.is_today) || computedPoints[computedPoints.length - 1];
            setActivePoint(todayPoint);
        }
    }, [computedPoints]);

    // Build smooth bezier curves for chart
    const { linePath, areaPath } = useMemo(() => {
        if (!computedPoints || computedPoints.length === 0) {
            return { linePath: '', areaPath: '' };
        }

        let path = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
        for (let i = 1; i < computedPoints.length; i++) {
            const prev = computedPoints[i - 1];
            const curr = computedPoints[i];
            const cx = prev.x + (curr.x - prev.x) / 2;
            path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
        }

        const area = `${path} L ${computedPoints[computedPoints.length - 1].x} 185 L ${computedPoints[0].x} 185 Z`;
        return { linePath: path, areaPath: area };
    }, [computedPoints]);

    // Donut chart calculations
    const donutData = useMemo(() => {
        const total = task_distribution?.total || 0;
        const completed = task_distribution?.completed || 0;
        const inProgress = task_distribution?.in_progress || 0;
        const todo = task_distribution?.todo || 0;

        const circumference = 238.76; // 2 * PI * 38
        if (total === 0) {
            return {
                total: 0,
                completed: 0,
                inProgress: 0,
                todo: 0,
                cDash: 0,
                cOffset: 0,
                ipDash: 0,
                ipOffset: 0,
                tDash: 0,
                tOffset: 0,
            };
        }

        const cRatio = completed / total;
        const ipRatio = inProgress / total;
        const tRatio = todo / total;

        const cDash = cRatio * circumference;
        const ipDash = ipRatio * circumference;
        const tDash = tRatio * circumference;

        return {
            total,
            completed,
            inProgress,
            todo,
            cDash,
            cOffset: 0,
            ipDash,
            ipOffset: -cDash,
            tDash,
            tOffset: -(cDash + ipDash),
        };
    }, [task_distribution]);

    // Helper to get category icon
    const getProjectCategoryIcon = (category = '') => {
        const cat = category.toLowerCase();
        if (cat.includes('web') || cat.includes('frontend') || cat.includes('site')) {
            return <Monitor className="w-4 h-4" />;
        }
        if (cat.includes('mobile') || cat.includes('app') || cat.includes('android')) {
            return <Smartphone className="w-4 h-4" />;
        }
        if (cat.includes('backend') || cat.includes('database') || cat.includes('api')) {
            return <Database className="w-4 h-4" />;
        }
        return <Globe className="w-4 h-4" />;
    };

    // Helper to get note category icon
    const getNoteCategoryIcon = (category = '') => {
        const cat = category.toLowerCase();
        if (cat.includes('idea') || cat.includes('ide')) {
            return <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
        }
        if (cat.includes('revisi') || cat.includes('revision') || cat.includes('feedback')) {
            return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
        }
        if (cat.includes('meet') || cat.includes('diskusi') || cat.includes('rapat')) {
            return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
        }
        return <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    };

    return (
        <>
            <Head title="Dashboard - WorkTrack" />

            {/* 1. Hero Greeting Section */}
            <div className="relative pt-2 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between min-h-[130px]">
                {/* Background Illustration */}
                <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-48 top-1/2 -translate-y-1/2 pointer-events-none opacity-90 hidden sm:block">
                    <img
                        src="/images/avatar1.png"
                        alt="WorkTrack Illustration"
                        className="h-32 md:h-36 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:opacity-80"
                    />
                </div>

                {/* Left Content */}
                <div className="relative z-10 space-y-1 max-w-md">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {greeting?.date || 'Sunday, 20 September 2026'}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {greeting?.time || 'Good day'}, {greeting?.name || 'Developer'}!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                        Keep all your projects, tasks, and notes synchronized in one place.
                    </p>
                </div>

                {/* Right Motivational Quote */}
                <div className="relative z-10 mt-4 md:mt-0 text-right hidden lg:block">
                    <blockquote className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 italic max-w-xs ml-auto leading-relaxed">
                        &ldquo;{greeting?.quote || 'A little progress each day adds up to big results.'}&rdquo;
                    </blockquote>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                        &mdash; {greeting?.quote_from || 'WorkTrack'}
                    </p>
                </div>
            </div>

            {/* 2. Top 4 Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Total Projects */}
                <Link
                    href="/projects"
                    className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                            <Folder className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Projects</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            {stats?.total_projects ?? 0}
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>
                                {stats?.projects_in_progress ?? 0} active in progress
                            </span>
                        </p>
                    </div>
                </Link>

                {/* Card 2: Tasks Completed */}
                <Link
                    href="/tasks"
                    className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                            <CheckCircle2 className="w-5 h-5 fill-emerald-600/20" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tasks Completed</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            {stats?.tasks_completed ?? 0}
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>
                                {stats?.tasks_completion_rate ?? 0}% completed ({stats?.tasks_completed ?? 0}/{stats?.total_tasks ?? 0})
                            </span>
                        </p>
                    </div>
                </Link>

                {/* Card 3: Coming Soon */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700/60 transition-colors group">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-5 h-5 fill-purple-600/20" />
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/70 dark:border-purple-900/60">
                            Soon
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">New Feature</p>
                        <h3 className="text-[24px] sm:text-[26px] font-bold text-slate-900 dark:text-white mt-0.5">
                            Coming Soon
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1.5 flex items-center gap-1">
                            <span>In active development</span>
                        </p>
                    </div>
                </div>

                {/* Card 4: Total Notes */}
                <Link
                    href="/notes"
                    className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700/60 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                            <FileText className="w-5 h-5 fill-amber-600/20" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Notes</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            {stats?.total_notes ?? 0}
                        </h3>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>{stats?.notes_this_month ?? 0} notes this month</span>
                        </p>
                    </div>
                </Link>
            </div>

            {/* 3. Middle Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Productivity Overview (Area Chart) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Productivity Overview
                            </h3>
                        </div>

                        {/* Filter Tag */}
                        <div className="inline-flex items-center gap-1.5 bg-[#f8fafc] dark:bg-[#10204c] border border-slate-200 dark:border-[#1f3468] text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Last 7 days</span>
                        </div>
                    </div>

                    {/* Chart Canvas */}
                    <div className="relative pt-6 pb-2 w-full">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 dark:text-slate-500 pl-6 pr-2 pt-6 pb-8">
                            {[10, 8, 6, 4, 2, 0].map((val, idx) => (
                                <div key={idx} className="flex items-center w-full">
                                    <span className="w-4 text-right pr-2">{val}</span>
                                    <div className="flex-1 border-b border-dashed border-slate-100 dark:border-[#17254d]"></div>
                                </div>
                            ))}
                        </div>

                        {/* SVG Area & Smooth Curve */}
                        <div className="ml-6 relative h-48 w-[calc(100%-24px)]">
                            <svg
                                viewBox="0 0 380 200"
                                preserveAspectRatio="none"
                                className="w-full h-full overflow-visible"
                            >
                                <defs>
                                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Shaded Area under Curve */}
                                {areaPath && <path d={areaPath} fill="url(#curveGradient)" />}

                                {/* Smooth Blue Line */}
                                {linePath && (
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                )}

                                {/* Interactive Data Points */}
                                {computedPoints.map((pt, idx) => (
                                    <g key={idx} className="cursor-pointer" onClick={() => setActivePoint(pt)}>
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={activePoint?.day === pt.day ? 5.5 : 3.5}
                                            className={`${
                                                activePoint?.day === pt.day
                                                    ? 'fill-blue-500 stroke-white dark:stroke-[#0c183b] stroke-[2.5px]'
                                                    : 'fill-blue-500 hover:fill-blue-400'
                                            } transition-all`}
                                        />
                                    </g>
                                ))}
                            </svg>

                            {/* Active Point Hover Tooltip */}
                            {activePoint && (
                                <div
                                    className="absolute -top-3 z-20 pointer-events-none transform -translate-x-1/2 transition-all duration-150"
                                    style={{ left: `${(activePoint.x / 380) * 100}%` }}
                                >
                                    <div className="bg-[#0f172a] text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl text-center space-y-0.5 border border-slate-700/50">
                                        <div className="font-bold text-white whitespace-nowrap">
                                            {activePoint.val} tasks completed
                                        </div>
                                        <div className="text-[10px] text-slate-400 whitespace-nowrap">
                                            {activePoint.date}
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-[#0f172a] transform rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50"></div>
                                </div>
                            )}
                        </div>

                        {/* X-Axis Days Labels */}
                        <div className="flex justify-between pl-8 pr-2 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {computedPoints.map((pt) => (
                                <span
                                    key={pt.day}
                                    onClick={() => setActivePoint(pt)}
                                    className={`cursor-pointer hover:text-blue-500 transition-colors ${
                                        activePoint?.day === pt.day
                                            ? 'font-bold text-blue-500 dark:text-blue-400'
                                            : ''
                                    }`}
                                >
                                    {pt.day}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task Status (Donut Chart) */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Task Status
                            </h3>
                        </div>
                        <Link
                            href="/tasks"
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            <span>Manage</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Donut Chart + Legend */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10 py-5 my-auto">
                        {/* Donut Graphic */}
                        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    className="stroke-slate-100 dark:stroke-[#152756]"
                                    strokeWidth="11"
                                />

                                {donutData.total > 0 && (
                                    <>
                                        {/* Completed */}
                                        {donutData.cDash > 0 && (
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="38"
                                                fill="transparent"
                                                stroke="#2563eb"
                                                strokeWidth="11"
                                                strokeDasharray={`${donutData.cDash} 238.76`}
                                                strokeDashoffset={donutData.cOffset}
                                                strokeLinecap="round"
                                            />
                                        )}
                                        {/* In Progress */}
                                        {donutData.ipDash > 0 && (
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="38"
                                                fill="transparent"
                                                stroke="#60a5fa"
                                                strokeWidth="11"
                                                strokeDasharray={`${donutData.ipDash} 238.76`}
                                                strokeDashoffset={donutData.ipOffset}
                                                strokeLinecap="round"
                                            />
                                        )}
                                        {/* To Do / Pending */}
                                        {donutData.tDash > 0 && (
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="38"
                                                fill="transparent"
                                                stroke="#bfdbfe"
                                                strokeWidth="11"
                                                strokeDasharray={`${donutData.tDash} 238.76`}
                                                strokeDashoffset={donutData.tOffset}
                                                strokeLinecap="round"
                                            />
                                        )}
                                    </>
                                )}
                            </svg>

                            {/* Center Numbers */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                                    {donutData.total}
                                </span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                    Tasks
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3.5 text-xs sm:text-sm w-full sm:w-auto min-w-[145px]">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#2563eb] shrink-0"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                                        Completed
                                    </span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    {donutData.completed}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#60a5fa] shrink-0"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                                        In Progress
                                    </span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    {donutData.inProgress}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#bfdbfe] shrink-0"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                                        To Do
                                    </span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                    {donutData.todo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Bottom Row 3-Columns Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Column 1: Recent Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <Folder className="w-5 h-5 text-slate-700 dark:text-slate-300 fill-slate-700/20" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Recent Projects
                                </h3>
                            </div>
                            <Link
                                href="/projects"
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Projects List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {recent_projects && recent_projects.length > 0 ? (
                                recent_projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.slug || project.id}`}
                                        className="py-3.5 flex items-center justify-between group hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 px-1 rounded-md transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {project.images && project.images.length > 0 ? (
                                                <img
                                                    src={project.images[0]}
                                                    alt={project.name}
                                                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-[#1e346e] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                    {getProjectCategoryIcon(project.category)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                    {project.name}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                                                    {project.company_name || project.category || 'General'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            <span
                                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                                                    project.status === 'In Progress'
                                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50'
                                                        : project.status === 'Completed'
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50'
                                                        : project.status === 'On Hold'
                                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
                                                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50'
                                                }`}
                                            >
                                                {project.status || 'Active'}
                                            </span>
                                            {project.due_date ? (
                                                <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">
                                                    {project.due_date}
                                                </p>
                                            ) : project.github_repo_name ? (
                                                loadingCommits && !githubCommitDates[project.id] ? (
                                                    <div className="mt-1.5 flex justify-end">
                                                        <div className="w-16 h-2.5 bg-slate-200 dark:bg-slate-700/80 animate-pulse rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 flex items-center justify-end gap-1">
                                                        <span>
                                                            {githubCommitDates[project.id] || project.start_date || project.created_at}
                                                        </span>
                                                    </p>
                                                )
                                            ) : (
                                                <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">
                                                    {project.start_date || project.created_at}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                                    <Folder className="w-8 h-8 mx-auto stroke-[1.5] mb-2 opacity-60" />
                                    <p className="text-xs font-medium">No projects yet.</p>
                                    <Link
                                        href="/projects/create"
                                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 inline-flex items-center gap-1 hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add New Project</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Upcoming Tasks */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Upcoming Tasks
                                </h3>
                            </div>
                            <Link
                                href="/tasks"
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Interactive Tasks List with Direct Toggle */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {localTasks && localTasks.length > 0 ? (
                                localTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={(e) => handleToggleTask(e, task.id)}
                                        className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 px-1 rounded-md transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {task.done ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            ) : (
                                                <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 group-hover:border-blue-500 shrink-0 transition-colors"></div>
                                            )}
                                            <div className="min-w-0">
                                                <span
                                                    className={`text-xs sm:text-sm font-medium block truncate transition-colors ${
                                                        task.done
                                                            ? 'line-through text-slate-400 dark:text-slate-500'
                                                            : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                    }`}
                                                >
                                                    {task.title}
                                                </span>
                                                {task.project_name && (
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-400 block truncate">
                                                        {task.project_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <span
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                                    task.priority === 'High' || task.priority === 'Urgent'
                                                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                                                        : task.priority === 'Medium'
                                                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                }`}
                                            >
                                                {task.priority || 'Normal'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                                    <CheckSquare className="w-8 h-8 mx-auto stroke-[1.5] mb-2 opacity-60" />
                                    <p className="text-xs font-medium">All tasks completed!</p>
                                    <Link
                                        href="/tasks"
                                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 inline-flex items-center gap-1 hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Open Tasks Page</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 3: Notes */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Notes
                                </h3>
                            </div>
                            <Link
                                href="/notes"
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Notes List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {recent_notes && recent_notes.length > 0 ? (
                                recent_notes.map((note) => (
                                    <Link
                                        key={note.id}
                                        href="/notes"
                                        className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 p-1 rounded-md transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 mt-0.5">
                                            {getNoteCategoryIcon(note.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                                                    {note.title}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-400 shrink-0 ml-2">
                                                    {note.date}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                {note.excerpt || 'Click to view note details...'}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                                    <FileText className="w-8 h-8 mx-auto stroke-[1.5] mb-2 opacity-60" />
                                    <p className="text-xs font-medium">No notes yet.</p>
                                    <Link
                                        href="/notes"
                                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 inline-flex items-center gap-1 hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Create New Note</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <DashboardLayout activePage="Dashboard">{page}</DashboardLayout>;

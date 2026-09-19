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



    // Calculate dynamic coordinates for Productivity Overview Area Chart
    const {
        computedPoints,
        yAxisLabels,
        linePath,
        areaPath,
        totalTasksThisWeek,
        padTop,
        padBottom,
        usableHeight,
    } = useMemo(() => {
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

        const peak = Math.max(...rawDays.map((d) => d.val || 0), 1);
        const step = peak <= 4 ? 1 : Math.ceil(peak / 4);
        const yMax = step * 4;

        const yAxisLabels = [
            { val: yMax, ratio: 0 },
            { val: step * 3, ratio: 0.25 },
            { val: step * 2, ratio: 0.5 },
            { val: step, ratio: 0.75 },
            { val: 0, ratio: 1.0 },
        ];

        // Coordinate space: width 1000, height 200
        const padLeft = 32;
        const padRight = 32;
        const padTop = 18;
        const padBottom = 168;
        const usableWidth = 1000 - padLeft - padRight;
        const usableHeight = padBottom - padTop;

        const n = rawDays.length;
        const xStep = n > 1 ? usableWidth / (n - 1) : 0;

        const points = rawDays.map((d, i) => {
            const val = d.val || 0;
            const x = padLeft + i * xStep;
            const y = padBottom - (val / yMax) * usableHeight;
            const xPct = (x / 1000) * 100;
            const yPct = (y / 200) * 100;
            return {
                ...d,
                x,
                y,
                xPct,
                yPct,
                val,
            };
        });

        // Generate smooth Bezier curve
        let path = '';
        if (points.length > 0) {
            path = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const cx1 = prev.x + (curr.x - prev.x) * 0.45;
                const cx2 = prev.x + (curr.x - prev.x) * 0.55;
                path += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`;
            }
        }

        const area =
            points.length > 0
                ? `${path} L ${points[points.length - 1].x} ${padBottom} L ${points[0].x} ${padBottom} Z`
                : '';

        const totalTasksThisWeek = rawDays.reduce((acc, curr) => acc + (curr.val || 0), 0);

        return {
            computedPoints: points,
            yAxisLabels,
            linePath: path,
            areaPath: area,
            totalTasksThisWeek,
            padTop,
            padBottom,
            usableHeight,
        };
    }, [chart_days]);

    const [activePoint, setActivePoint] = useState(null);

    useEffect(() => {
        if (computedPoints.length > 0) {
            // Default to today or the last day point
            const todayPoint = computedPoints.find((p) => p.is_today) || computedPoints[computedPoints.length - 1];
            setActivePoint(todayPoint);
        }
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

    // Helper to get task priority badge styling (100% consistent with Tasks page)
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
        <>
            <Head title="Dashboard - WorkTrack" />

            {/* 1. Hero Greeting Section */}
            <div className="relative pt-0.5 sm:pt-2 pb-0 sm:pb-3 flex flex-col md:flex-row items-start md:items-center justify-between sm:min-h-[110px] md:min-h-[130px]">
                {/* Background Illustration */}
                <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-48 top-1/2 -translate-y-1/2 pointer-events-none opacity-90 hidden sm:block">
                    <img
                        src="/images/avatar1.png"
                        alt="WorkTrack Illustration"
                        className="h-32 md:h-36 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:opacity-80"
                    />
                </div>

                {/* Left Content */}
                <div className="relative z-10 space-y-0.5 sm:space-y-1 max-w-md">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        {greeting?.date || 'Sunday, 20 September 2026'}
                    </p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
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
            {/* 2. Top 4 Metric Stat Cards (Responsive 2-cols on mobile like Projects/Tasks) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {/* Card 1: Total Projects */}
                <Link
                    href="/projects"
                    className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                            <Folder className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600/20" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Total Projects</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            {stats?.total_projects ?? 0}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1 sm:mt-1.5 truncate">
                            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate">
                                {stats?.projects_in_progress ?? 0} active in progress
                            </span>
                        </p>
                    </div>
                </Link>

                {/* Card 2: Tasks Completed */}
                <Link
                    href="/tasks"
                    className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-600/20" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Tasks Completed</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            {stats?.tasks_completed ?? 0}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1 sm:mt-1.5 truncate">
                            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate">
                                {stats?.tasks_completion_rate ?? 0}% ({stats?.tasks_completed ?? 0}/{stats?.total_tasks ?? 0})
                            </span>
                        </p>
                    </div>
                </Link>

                {/* Card 3: Coming Soon */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700/60 transition-colors group">
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-purple-600/20" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/70 dark:border-purple-900/60">
                            Soon
                        </span>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">New Feature</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            Coming Soon
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 sm:mt-1.5 truncate">
                            <span>In active development</span>
                        </p>
                    </div>
                </div>

                {/* Card 4: Total Notes */}
                <Link
                    href="/notes"
                    className="bg-white dark:bg-[#0e1d47] rounded-lg p-3.5 sm:p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700/60 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-600/20" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                    <div className="mt-3 sm:mt-4">
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">Total Notes</p>
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">
                            {stats?.total_notes ?? 0}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-1 sm:mt-1.5 truncate">
                            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate">{stats?.notes_this_month ?? 0} notes this month</span>
                        </p>
                    </div>
                </Link>
            </div>

            {/* 3. Middle Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Productivity Overview (Area Chart) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0e1d47] rounded-xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <BarChart2 className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                        Productivity Overview
                                    </h3>
                                    {totalTasksThisWeek > 0 && (
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                            {totalTasksThisWeek} completed
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Completed tasks activity across the past 7 days
                                </p>
                            </div>
                        </div>

                        {/* Filter Tag */}
                        <div className="inline-flex items-center gap-1.5 bg-[#f8fafc] dark:bg-[#10204c] border border-slate-200 dark:border-[#1f3468] text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md self-start sm:self-auto">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Last 7 days</span>
                        </div>
                    </div>

                    {/* Chart Canvas: Full bleed edge-to-edge */}
                    <div className="relative pt-6 pb-2 w-full -mx-5 sm:-mx-6">
                        {/* Active Point Smart Tooltip (Dynamic Light & Dark Mode) */}
                        {activePoint && (
                            <div
                                className="absolute -top-1 pointer-events-none transition-all duration-150 transform -translate-x-1/2 z-20"
                                style={{
                                    left: `${Math.min(
                                        Math.max(activePoint.xPct, 12),
                                        88
                                    )}%`,
                                }}
                            >
                                <div className="bg-white/95 dark:bg-[#0a1533]/95 backdrop-blur-md text-slate-900 dark:text-white text-[11px] rounded-lg px-3 py-1.5 shadow-lg shadow-slate-200/70 dark:shadow-2xl border border-slate-200/90 dark:border-[#1e346e] text-center space-y-0.5 whitespace-nowrap">
                                    <div className="font-bold flex items-center justify-center gap-1.5 text-slate-900 dark:text-white">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                                        <span>
                                            {activePoint.val}{' '}
                                            {activePoint.val === 1 ? 'task' : 'tasks'} completed
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                        {activePoint.date}
                                    </div>
                                </div>
                                <div className="w-2.5 h-2.5 bg-white/95 dark:bg-[#0a1533]/95 transform rotate-45 mx-auto -mt-1 border-r border-b border-slate-200/90 dark:border-[#1e346e]"></div>
                            </div>
                        )}

                        {/* Edge-to-Edge SVG Surface */}
                        <div className="relative w-full h-48 sm:h-56">
                            <svg
                                viewBox="0 0 1000 200"
                                preserveAspectRatio="none"
                                className="w-full h-full select-none"
                            >
                                <defs>
                                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                                        <stop offset="70%" stopColor="#2563eb" stopOpacity="0.05" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                                    </linearGradient>
                                    <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="130%">
                                        <feDropShadow
                                            dx="0"
                                            dy="3"
                                            stdDeviation="3"
                                            floodColor="#2563eb"
                                            floodOpacity="0.25"
                                        />
                                    </filter>
                                </defs>

                                {/* Horizontal Grid lines (100% full width of card) & Floating Y-Axis Labels */}
                                {yAxisLabels.map((item, idx) => {
                                    const yPos = padTop + item.ratio * usableHeight;
                                    return (
                                        <g key={idx}>
                                            <text
                                                x="24"
                                                y={yPos - 5}
                                                className="text-[10px] font-semibold fill-slate-400 dark:fill-slate-500 select-none"
                                            >
                                                {item.val}
                                            </text>
                                            <line
                                                x1="0"
                                                y1={yPos}
                                                x2="1000"
                                                y2={yPos}
                                                stroke="currentColor"
                                                strokeDasharray="4 4"
                                                className="text-slate-100 dark:text-[#182a57]"
                                                strokeWidth="1"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Shaded Gradient Area under Curve */}
                                {areaPath && <path d={areaPath} fill="url(#curveGradient)" />}

                                {/* Smooth Bezier Curve with Non-Scaling Stroke */}
                                {linePath && (
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke="#2563eb"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#lineGlow)"
                                        vectorEffect="non-scaling-stroke"
                                        className="dark:stroke-[#3b82f6]"
                                    />
                                )}
                            </svg>

                            {/* HTML Layer: Vertical Guide Line & Perfect Circles (immune to SVG aspect ratio distortion) */}
                            <div className="absolute inset-0 pointer-events-none">
                                {activePoint && (
                                    <div
                                        className="absolute top-3 bottom-5 border-l border-dashed border-blue-500 dark:border-blue-400 opacity-70 transition-all duration-150"
                                        style={{ left: `${activePoint.xPct}%` }}
                                    />
                                )}

                                {computedPoints.map((pt, idx) => {
                                    const isActive = activePoint?.day === pt.day;
                                    return (
                                        <React.Fragment key={idx}>
                                            {/* Circular Data Point */}
                                            <div
                                                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 flex items-center justify-center pointer-events-none"
                                                style={{ left: `${pt.xPct}%`, top: `${pt.yPct}%` }}
                                            >
                                                {isActive && (
                                                    <span className="absolute w-6 h-6 rounded-full bg-blue-500/20 dark:bg-blue-400/25 animate-ping" />
                                                )}
                                                <span
                                                    className={`rounded-full transition-all ${
                                                        isActive
                                                            ? 'w-3.5 h-3.5 bg-blue-600 dark:bg-blue-500 ring-4 ring-white dark:ring-[#0e1d47] shadow-sm'
                                                            : 'w-2.5 h-2.5 bg-blue-500 dark:bg-blue-400'
                                                    }`}
                                                />
                                            </div>

                                            {/* Column Hover Hit-Box */}
                                            <div
                                                onClick={() => setActivePoint(pt)}
                                                onMouseEnter={() => setActivePoint(pt)}
                                                style={{
                                                    left: `${Math.max(0, pt.xPct - 7)}%`,
                                                    width: '14%',
                                                }}
                                                className="absolute top-0 bottom-0 pointer-events-auto cursor-pointer"
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Synchronized Day Labels (in HTML for crisp unskewed typography) */}
                        <div className="relative w-full h-5 mt-2 px-1">
                            {computedPoints.map((pt, idx) => {
                                const isActive = activePoint?.day === pt.day;
                                const alignClass =
                                    idx === 0
                                        ? 'left-[3.2%] text-left'
                                        : idx === computedPoints.length - 1
                                        ? 'left-[96.8%] -translate-x-full text-right'
                                        : '-translate-x-1/2 text-center';
                                return (
                                    <button
                                        key={pt.day}
                                        type="button"
                                        onClick={() => setActivePoint(pt)}
                                        style={{ left: `${pt.xPct}%` }}
                                        className={`absolute top-0 text-xs transition-colors cursor-pointer select-none ${alignClass} ${
                                            isActive
                                                ? 'font-bold text-blue-600 dark:text-blue-400'
                                                : 'font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                        }`}
                                    >
                                        {pt.day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Task Status (Donut Chart) */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 sm:p-5 lg:p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
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

            {/* 4. Bottom Row 3-Columns Section (Responsive 1-col on mobile, 2-col on tablet, 3-col on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Column 1: Recent Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 sm:p-5 lg:p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
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
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 sm:p-5 lg:p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
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

                        {/* Upcoming Tasks List (Read-only on Dashboard - managed exclusively on Tasks page) */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {localTasks && localTasks.length > 0 ? (
                                localTasks.map((task) => (
                                    <Link
                                        key={task.id}
                                        href="/tasks"
                                        className="py-3.5 flex items-center justify-between group hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 px-1 rounded-md transition-colors"
                                        title="Buka halaman Tasks untuk mengelola atau menyelesaikan tugas"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-xs sm:text-sm font-medium block truncate text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityConfig(task.priority)}`}>
                                                {task.priority || 'Normal'}
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                        </div>
                                    </Link>
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
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 sm:p-5 lg:p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between md:col-span-2 lg:col-span-1">
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

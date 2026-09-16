import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    Folder,
    CheckCircle2,
    Clock,
    BarChart2,
    MoreHorizontal,
    ArrowUp,
    Calendar as CalendarIcon,
    ChevronDown,
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
} from 'lucide-react';

export default function Dashboard() {
    // Tasks checklist state
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Finish UI Dashboard', tag: 'Today', tagType: 'danger', done: false },
        { id: 2, title: 'Meeting with client', tag: 'Tomorrow', tagType: 'info', done: false },
        { id: 3, title: 'Update documentation', tag: '15 Sep', tagType: 'default', done: false },
        { id: 4, title: 'Fix responsive layout', tag: '16 Sep', tagType: 'default', done: false },
        { id: 5, title: 'Prepare presentation', tag: '17 Sep', tagType: 'default', done: false },
    ]);

    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
        );
    };

    // Productivity Chart points (Mon to Sun)
    const chartDays = [
        { day: 'Mon', val: 2, x: 20, y: 155 },
        { day: 'Tue', val: 5, x: 75, y: 105 },
        { day: 'Wed', val: 6.8, x: 130, y: 75 },
        { day: 'Thu', val: 4.3, x: 185, y: 118 },
        { day: 'Fri', val: 5.7, x: 240, y: 92 },
        { day: 'Sat', val: 6.9, x: 295, y: 72 },
        { day: 'Sun', val: 8, x: 350, y: 55, active: true },
    ];

    const [activePoint, setActivePoint] = useState(chartDays[6]);

    return (
        <>
            <Head title="Dashboard - WorkTrack" />

            {/* 1. Hero Greeting Section (Flat on background, not a card) */}
            <div className="relative pt-2 pb-4 flex flex-col md:flex-row items-start md:items-center justify-between min-h-[140px]">
                {/* Background Mountain Illustration */}
                <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-52 top-1/2 -translate-y-1/2 pointer-events-none opacity-95 hidden sm:block">
                    <img
                        src="/images/avatar1.png"
                        alt="Mountain Traveler Illustration"
                        className="h-36 md:h-40 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:opacity-80"
                    />
                </div>

                {/* Left Content */}
                <div className="relative z-10 space-y-1 max-w-md">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                        Sunday, 14 September 2025
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Good evening, Rabirts!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                        Keep going, great things take time.
                    </p>
                </div>

                {/* Right Motivational Quote */}
                <div className="relative z-10 mt-4 md:mt-0 text-right hidden lg:block">
                    <blockquote className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 italic max-w-xs ml-auto leading-relaxed">
                        &ldquo;A little progress each day adds up to big results.&rdquo;
                    </blockquote>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">&mdash; Unknown</p>
                </div>
            </div>

            {/* 2. Top 4 Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Total Projects */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Folder className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Projects</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">12</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>2 this month</span>
                        </p>
                    </div>
                </div>

                {/* Card 2: Tasks Completed */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <CheckCircle2 className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tasks Completed</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">28</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>12% from last month</span>
                        </p>
                    </div>
                </div>

                {/* Card 3: Hours Worked */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Clock className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hours Worked</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">86h</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>8% from last month</span>
                        </p>
                    </div>
                </div>

                {/* Card 4: Total Notes */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <BarChart2 className="w-5 h-5 fill-blue-600/20" />
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Notes</p>
                        <h3 className="text-[28px] font-bold text-slate-900 dark:text-white mt-0.5">54</h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                            <ArrowUp className="w-3.5 h-3.5" />
                            <span>5 this month</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Middle Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Productivity Overview (Area Chart) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Productivity Overview</h3>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="inline-flex items-center gap-1.5 bg-[#f8fafc] dark:bg-[#10204c] border border-slate-200 dark:border-[#1f3468] text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Last 7 days</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                                <path
                                    d="M 20 155 Q 50 120, 75 105 T 130 75 T 185 118 T 240 92 T 295 72 T 350 55 L 350 190 L 20 190 Z"
                                    fill="url(#curveGradient)"
                                />

                                {/* Smooth Blue Line */}
                                <path
                                    d="M 20 155 Q 50 120, 75 105 T 130 75 T 185 118 T 240 92 T 295 72 T 350 55"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />

                                {/* Interactive Data Points */}
                                {chartDays.map((pt, idx) => (
                                    <g key={idx} className="cursor-pointer" onClick={() => setActivePoint(pt)}>
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={activePoint.day === pt.day ? 5 : 3.5}
                                            className={`${
                                                activePoint.day === pt.day
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
                                    className="absolute -top-3 z-20 pointer-events-none transform -translate-x-1/2"
                                    style={{ left: `${(activePoint.x / 380) * 100}%` }}
                                >
                                    <div className="bg-[#0f172a] text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl text-center space-y-0.5 border border-slate-700/50">
                                        <div className="font-bold text-white whitespace-nowrap">{activePoint.val} tasks</div>
                                        <div className="text-[10px] text-slate-400 whitespace-nowrap">14 Sep 2025</div>
                                    </div>
                                    <div className="w-2 h-2 bg-[#0f172a] transform rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50"></div>
                                </div>
                            )}
                        </div>

                        {/* X-Axis Days Labels */}
                        <div className="flex justify-between pl-8 pr-2 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {chartDays.map((pt) => (
                                <span
                                    key={pt.day}
                                    onClick={() => setActivePoint(pt)}
                                    className={`cursor-pointer hover:text-blue-500 transition-colors ${
                                        activePoint.day === pt.day ? 'font-bold text-blue-500 dark:text-blue-400' : ''
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
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Task Status</h3>
                        </div>
                        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
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
                                {/* Pending (3/36 = 8.3%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    stroke="#bfdbfe"
                                    strokeWidth="11"
                                    strokeDasharray="238.76"
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                />
                                {/* In Progress (5/36 = 13.8%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    stroke="#60a5fa"
                                    strokeWidth="11"
                                    strokeDasharray="238.76"
                                    strokeDashoffset="30"
                                    strokeLinecap="round"
                                />
                                {/* Completed (28/36 = 77.7%) */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    stroke="#2563eb"
                                    strokeWidth="11"
                                    strokeDasharray="238.76"
                                    strokeDashoffset="80"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Center Numbers */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">36</span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Tasks</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3.5 text-xs sm:text-sm w-full sm:w-auto min-w-[145px]">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#2563eb] shrink-0"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Completed</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">28</span>
                            </div>

                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#60a5fa] shrink-0"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">In Progress</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">5</span>
                            </div>

                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#bfdbfe] shrink-0"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Pending</span>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white text-sm">3</span>
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
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Projects</h3>
                            </div>
                            <Link href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Projects List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {/* Project 1 */}
                            <div className="py-3.5 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <Monitor className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Company Website
                                        </h4>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-400">Frontend Development</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                        In Progress
                                    </span>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">12 Sep 2025</p>
                                </div>
                            </div>

                            {/* Project 2 */}
                            <div className="py-3.5 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                        <Database className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            CRM System
                                        </h4>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-400">UI/UX Design</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                                        In Progress
                                    </span>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">10 Sep 2025</p>
                                </div>
                            </div>

                            {/* Project 3 */}
                            <div className="py-3.5 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Mobile App (Internal)
                                        </h4>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-400">Planning &amp; Research</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
                                        Planning
                                    </span>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">08 Sep 2025</p>
                                </div>
                            </div>

                            {/* Project 4 */}
                            <div className="py-3.5 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            Portfolio Website
                                        </h4>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-400">Design &amp; Development</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                                        Completed
                                    </span>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">05 Sep 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Upcoming Tasks */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Tasks</h3>
                            </div>
                            <Link href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Interactive Tasks List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className="py-3.5 flex items-center justify-between cursor-pointer group hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 px-1 rounded-md transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {task.done ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 group-hover:border-blue-500 shrink-0"></div>
                                        )}
                                        <span
                                            className={`text-xs sm:text-sm font-medium transition-colors ${
                                                task.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                            {task.title}
                                        </span>
                                    </div>

                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                            task.priority === 'High'
                                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                                                : task.priority === 'Medium'
                                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                        }`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 3: Notes */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-6 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Notes</h3>
                            </div>
                            <Link href="#" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Notes List */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {/* Note 1 */}
                            <div className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 p-1 rounded-md transition-colors">
                                <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                                            Client Feedback
                                        </h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-400">12 Sep</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Beberapa revisi pada halaman dashboard...
                                    </p>
                                </div>
                            </div>

                            {/* Note 2 */}
                            <div className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 p-1 rounded-md transition-colors">
                                <div className="w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Lightbulb className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                                            Ideas
                                        </h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-400">10 Sep</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Tambahkan fitur dark mode dan multi language
                                    </p>
                                </div>
                            </div>

                            {/* Note 3 */}
                            <div className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 p-1 rounded-md transition-colors">
                                <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                                            Meeting Note
                                        </h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-400">08 Sep</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Diskusi fitur baru untuk Q4
                                    </p>
                                </div>
                            </div>

                            {/* Note 4 */}
                            <div className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#10204c]/60 p-1 rounded-md transition-colors">
                                <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                                            Personal
                                        </h4>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-400">05 Sep</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Belajar Laravel 13 dan optimasi database
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <DashboardLayout activePage="Dashboard">{page}</DashboardLayout>;


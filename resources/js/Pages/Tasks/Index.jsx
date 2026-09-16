import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import {
    CheckSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Plus,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Home,
    Monitor,
    Smartphone,
    LayoutDashboard,
    Link2,
    Calendar as CalendarIcon,
    BarChart2,
    FileText,
    ArrowUp,
    ArrowRight,
    Play,
    User,
} from 'lucide-react';

export default function Tasks() {
    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [projectFilter, setProjectFilter] = useState('All');
    const [sortFilter, setSortFilter] = useState('Due Date');

    // Selected tasks state
    const [selectedTasks, setSelectedTasks] = useState([1, 2]);

    // Tasks database (matching screenshot mock)
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Design landing page',
            description: 'Create new landing page for main website',
            project: 'Company Website',
            projectIcon: Monitor,
            projectColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
            priority: 'High',
            status: 'In Progress',
            dueDate: '16 Sep 2025',
            dueSubtext: '2 days left',
            isOverdue: false,
        },
        {
            id: 2,
            title: 'Fix login bug',
            description: 'Resolve issue with user authentication',
            project: 'Mobile App',
            projectIcon: Smartphone,
            projectColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
            priority: 'High',
            status: 'In Progress',
            dueDate: '16 Sep 2025',
            dueSubtext: '2 days left',
            isOverdue: false,
        },
        {
            id: 3,
            title: 'Setup database',
            description: 'Initial database structure and migration',
            project: 'Admin Dashboard',
            projectIcon: LayoutDashboard,
            projectColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
            priority: 'Medium',
            status: 'Completed',
            dueDate: '12 Sep 2025',
            dueSubtext: '',
            isOverdue: false,
        },
        {
            id: 4,
            title: 'Write API documentation',
            description: 'Create API docs for backend services',
            project: 'API Integration',
            projectIcon: Link2,
            projectColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
            priority: 'Medium',
            status: 'In Progress',
            dueDate: '18 Sep 2025',
            dueSubtext: '4 days left',
            isOverdue: false,
        },
        {
            id: 5,
            title: 'UI/UX improvements',
            description: 'Improve dashboard user experience',
            project: 'Admin Dashboard',
            projectIcon: LayoutDashboard,
            projectColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
            priority: 'Low',
            status: 'Not Started',
            dueDate: '20 Sep 2025',
            dueSubtext: '6 days left',
            isOverdue: false,
        },
        {
            id: 6,
            title: 'Testing & QA',
            description: 'Perform testing on new features',
            project: 'Mobile App',
            projectIcon: Smartphone,
            projectColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
            priority: 'High',
            status: 'On Hold',
            dueDate: '14 Sep 2025',
            dueSubtext: 'Overdue',
            isOverdue: true,
        },
        {
            id: 7,
            title: 'Deploy to production',
            description: 'Deploy latest version to production',
            project: 'Company Website',
            projectIcon: Monitor,
            projectColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
            priority: 'High',
            status: 'Not Started',
            dueDate: '25 Sep 2025',
            dueSubtext: '11 days left',
            isOverdue: false,
        },
        {
            id: 8,
            title: 'Research new features',
            description: 'Research and plan for next phase',
            project: 'Personal',
            projectIcon: FileText,
            projectColor: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
            priority: 'Low',
            status: 'Completed',
            dueDate: '10 Sep 2025',
            dueSubtext: '',
            isOverdue: false,
        },
    ]);

    // Today tasks in right widget
    const [todayTasks, setTodayTasks] = useState([
        { id: 101, title: 'Design landing page', project: 'Company Website', priority: 'High', done: false },
        { id: 102, title: 'Fix login bug', project: 'Mobile App', priority: 'High', done: false },
        { id: 103, title: 'Review UI design', project: 'Admin Dashboard', priority: 'Medium', done: false },
    ]);

    // Toggle today task
    const toggleTodayTask = (id) => {
        setTodayTasks((prev) =>
            prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
        );
    };

    // Toggle single task select checkbox
    const toggleTaskSelect = (id) => {
        setSelectedTasks((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectedTasks.length === filteredTasks.length) {
            setSelectedTasks([]);
        } else {
            setSelectedTasks(filteredTasks.map((t) => t.id));
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        const matchesProject = projectFilter === 'All' || task.project === projectFilter;
        return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });

    // Calendar cells matching the UI mockup in media_1789528221777.png
    // Row 1: Mon (empty), Tue 1, Wed 2 (dot), Thu 3, Fri 4 (dot), Sat 5 (faded), Sun 7 (dot)
    // Row 2: Mon 7 (dot), Tue 8 (dot), Wed 9, Thu 10, Fri 11, Sat 12, Sun 14
    // Row 3: Mon 14, Tue 16 (active blue circle), Wed 16, Thu 17, Fri 18, Sat 19, Sun 20
    // Row 4: Mon 21, Tue 22 (dot), Wed 23, Thu 24, Fri 25, Sat 26, Sun 27
    // Row 5: Mon 28, Tue 29, Wed 30, Thu 1 (faded), Fri 2 (faded), Sat 3 (faded), Sun 4 (faded)
    const calendarCells = [
        { day: null },
        { day: 1 },
        { day: 2, hasDot: true },
        { day: 3 },
        { day: 4, hasDot: true },
        { day: 5, isFaded: true },
        { day: 7, hasDot: true },

        { day: 7, hasDot: true },
        { day: 8, hasDot: true },
        { day: 9 },
        { day: 10 },
        { day: 11 },
        { day: 12 },
        { day: 14 },

        { day: 14 },
        { day: 16, isActive: true },
        { day: 16 },
        { day: 17 },
        { day: 18 },
        { day: 19 },
        { day: 20 },

        { day: 21 },
        { day: 22, hasDot: true },
        { day: 23 },
        { day: 24 },
        { day: 25 },
        { day: 26 },
        { day: 27 },

        { day: 28 },
        { day: 29 },
        { day: 30 },
        { day: 1, isFaded: true },
        { day: 2, isFaded: true },
        { day: 3, isFaded: true },
        { day: 4, isFaded: true },
    ];

    return (
        <>
            <Head title="Tasks - WorkTrack" />

            {/* Main 2-Column Responsive Layout (Left: Header, Stats, Table; Right: Calendar, Quick Stats, Activity) */}
            <div className="worktrack-layout-2col pt-1">
                {/* Left Area (Takes remaining width) */}
                <div className="worktrack-layout-main space-y-5">
                    {/* 1. Header & Breadcrumbs */}
                    <div className="space-y-1">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 font-medium">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                                <Home className="w-3.5 h-3.5" />
                            </Link>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300">Tasks</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Tasks
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Organize your work, stay focused, and get things done.
                        </p>
                    </div>

                    {/* 2. Top 4 Metric Stat Cards (Inside Left Column) */}
                    <div className="worktrack-stats-4col">
                        {/* Card 1: All Tasks */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <CheckSquare className="w-4 h-4 fill-blue-600/20" />
                                </div>
                                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">All Tasks</p>
                                <h3 className="text-[26px] font-bold text-slate-900 dark:text-white mt-0.5 leading-tight">24</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>6 this month</span>
                                </p>
                            </div>
                        </div>

                        {/* Card 2: In Progress */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Play className="w-3.5 h-3.5 fill-blue-600" />
                                </div>
                                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Progress</p>
                                <h3 className="text-[26px] font-bold text-slate-900 dark:text-white mt-0.5 leading-tight">8</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>2 this month</span>
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Completed */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4 fill-emerald-600/20" />
                                </div>
                                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed</p>
                                <h3 className="text-[26px] font-bold text-slate-900 dark:text-white mt-0.5 leading-tight">12</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>4 this month</span>
                                </p>
                            </div>
                        </div>

                        {/* Card 4: Overdue */}
                        <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-4 border border-slate-200/80 dark:border-[#1e346e] shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#2b4486] transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="w-9 h-9 rounded-md bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                    <Clock className="w-4 h-4 fill-rose-600/20" />
                                </div>
                                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overdue</p>
                                <h3 className="text-[26px] font-bold text-slate-900 dark:text-white mt-0.5 leading-tight">4</h3>
                                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 mt-1">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>1 this month</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Tasks Table & Filters Card */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs overflow-hidden transition-colors">
                    {/* Filter & Search Bar */}
                    <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Dropdown Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* All Status */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                                >
                                    <option value="All">All Status</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* All Priority */}
                            <div className="relative">
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                                >
                                    <option value="All">All Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* All Projects */}
                            <div className="relative">
                                <select
                                    value={projectFilter}
                                    onChange={(e) => setProjectFilter(e.target.value)}
                                    className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                                >
                                    <option value="All">All Projects</option>
                                    <option value="Company Website">Company Website</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="Admin Dashboard">Admin Dashboard</option>
                                    <option value="API Integration">API Integration</option>
                                    <option value="Personal">Personal</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortFilter}
                                    onChange={(e) => setSortFilter(e.target.value)}
                                    className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-xs font-medium text-slate-700 dark:text-slate-200 rounded-md pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Due Date">Sort: Due Date</option>
                                    <option value="Priority">Sort: Priority</option>
                                    <option value="Status">Sort: Status</option>
                                    <option value="Title">Sort: Title</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-[#f8fafc] dark:bg-[#0c183b] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                                <tr>
                                    <th className="py-3 px-4 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="py-3 px-4">Task Title</th>
                                    <th className="py-3 px-4">Project</th>
                                    <th className="py-3 px-4">Priority</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Due Date</th>
                                    <th className="py-3 px-4 w-12 text-center">
                                        <MoreHorizontal className="w-4 h-4 mx-auto text-slate-400" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredTasks.map((item) => {
                                    const Icon = item.projectIcon;
                                    const isChecked = selectedTasks.includes(item.id);
                                    return (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/70 dark:hover:bg-[#122352]/40 transition-colors group"
                                        >
                                            {/* Checkbox */}
                                            <td className="py-3.5 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleTaskSelect(item.id)}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>

                                            {/* Task Title & Description */}
                                            <td className="py-3.5 px-4">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Project */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.projectColor}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="font-medium text-xs text-slate-700 dark:text-slate-200">
                                                        {item.project}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Priority Badge */}
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                                                        item.priority === 'High'
                                                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                                                            : item.priority === 'Medium'
                                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                                                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50'
                                                    }`}
                                                >
                                                    {item.priority}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                                                        item.status === 'In Progress'
                                                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50'
                                                            : item.status === 'Completed'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                                                            : item.status === 'On Hold'
                                                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>

                                            {/* Due Date */}
                                            <td className="py-3.5 px-4">
                                                <div>
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                                        {item.dueDate}
                                                    </span>
                                                    {item.dueSubtext && (
                                                        <p
                                                            className={`text-[11px] font-medium mt-0.5 ${
                                                                item.isOverdue
                                                                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {item.dueSubtext}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-center">
                                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Pagination */}
                    <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <div>
                            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">1</span> to{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{filteredTasks.length}</span> of{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{tasks.length}</span> tasks
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-md bg-[#2952e3] text-white font-semibold flex items-center justify-center shadow-xs">
                                1
                            </button>
                            <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors font-medium">
                                2
                            </button>
                            <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors font-medium">
                                3
                            </button>
                            <button className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Calendar Widget, Quick Stats, Recent Activity */}
            <div className="worktrack-layout-sidebar space-y-5">
                {/* 1. Calendar Card (Unified card matching screenshot mockup) */}
                <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs">
                    {/* Card Top Header: Calendar Title + Add Task Button */}
                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 dark:text-slate-100" />
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Calendar</h3>
                        </div>

                        <button
                            onClick={() => alert('Fitur tambah task baru siap dikembangkan di tahap database!')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add Task</span>
                        </button>
                    </div>

                    {/* Month Header: September 2025 < > */}
                    <div className="flex items-center justify-between pb-3 pt-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">September 2025</h4>
                        <div className="flex items-center gap-1 text-slate-400">
                            <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors">
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors">
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Weekday Names (7 columns) */}
                    <div
                        className="text-center text-[10px] font-semibold text-slate-400 dark:text-slate-400 pb-2"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                    >
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>

                    {/* Calendar Grid (7 columns with dots and active 16) */}
                    <div
                        className="gap-y-1 text-center text-xs"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                    >
                        {calendarCells.map((cell, idx) => {
                            if (!cell.day) {
                                return <div key={idx} className="h-7" />;
                            }
                            return (
                                <div key={idx} className="flex flex-col items-center justify-center py-0.5">
                                    <button
                                        className={`w-7 h-7 flex items-center justify-center text-xs transition-all ${
                                            cell.isActive
                                                ? 'rounded-full bg-[#2563eb] text-white font-bold shadow-md shadow-blue-500/30'
                                                : cell.isFaded
                                                ? 'text-slate-300 dark:text-slate-600 font-medium'
                                                : 'rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                                        }`}
                                    >
                                        {cell.day}
                                    </button>
                                    {cell.hasDot ? (
                                        <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5"></span>
                                    ) : (
                                        <span className="w-1 h-1 mt-0.5"></span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Today Section */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer">
                                Today
                            </h5>
                            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center justify-center">
                                3
                            </span>
                        </div>

                        {/* Today Tasks List */}
                        <div className="space-y-2.5">
                            {todayTasks.map((t) => (
                                <div
                                    key={t.id}
                                    onClick={() => toggleTodayTask(t.id)}
                                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50/80 dark:hover:bg-[#122352]/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={t.done}
                                            onChange={() => {}}
                                            className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <div className="truncate">
                                            <h6
                                                className={`text-xs font-semibold truncate transition-colors ${
                                                    t.done
                                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                                        : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                }`}
                                            >
                                                {t.title}
                                            </h6>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                                {t.project}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                                            t.priority === 'High'
                                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50'
                                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50'
                                        }`}
                                    >
                                        {t.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                    {/* 2. Quick Stats Card */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs">
                        <div className="flex items-center justify-between pb-4">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Quick Stats</h4>
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] text-[11px] font-medium text-slate-700 dark:text-slate-200 rounded-md pl-2 pr-6 py-1 cursor-pointer focus:outline-none">
                                    <option>This Week</option>
                                    <option>This Month</option>
                                    <option>All Time</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Progress Breakdown Bars */}
                        <div className="space-y-3.5">
                            {/* Completed: 12 (60%) */}
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 w-28 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Completed</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs w-6 text-right">
                                    12
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-[60%]"></div>
                                </div>
                                <span className="text-[11px] text-slate-400 w-8 text-right">60%</span>
                            </div>

                            {/* In Progress: 8 (40%) */}
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 w-28 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-[#2952e3]"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">In Progress</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs w-6 text-right">
                                    8
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#2952e3] rounded-full w-[40%]"></div>
                                </div>
                                <span className="text-[11px] text-slate-400 w-8 text-right">40%</span>
                            </div>

                            {/* Not Started: 5 (25%) */}
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 w-28 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Not Started</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs w-6 text-right">
                                    5
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 rounded-full w-[25%]"></div>
                                </div>
                                <span className="text-[11px] text-slate-400 w-8 text-right">25%</span>
                            </div>

                            {/* On Hold: 3 (15%) */}
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 w-28 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">On Hold</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs w-6 text-right">
                                    3
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full w-[15%]"></div>
                                </div>
                                <span className="text-[11px] text-slate-400 w-8 text-right">15%</span>
                            </div>

                            {/* Overdue: 4 (20%) */}
                            <div className="flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 w-28 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Overdue</span>
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs w-6 text-right">
                                    4
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 rounded-full w-[20%]"></div>
                                </div>
                                <span className="text-[11px] text-slate-400 w-8 text-right">20%</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Recent Activity Card */}
                    <div className="bg-white dark:bg-[#0e1d47] rounded-lg p-5 border border-slate-200/80 dark:border-[#1e346e] shadow-xs">
                        <div className="flex items-center justify-between pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Recent Activity</h4>
                            </div>
                            <Link href="#" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                                <span>View All</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Activities List */}
                        <div className="space-y-3 pt-1">
                            {/* Activity 1 */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                                            Completed task
                                        </h5>
                                        <span className="text-[10px] text-slate-400 shrink-0">2 hours ago</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Setup database
                                    </p>
                                </div>
                            </div>

                            {/* Activity 2 */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                                            Updated task
                                        </h5>
                                        <span className="text-[10px] text-slate-400 shrink-0">5 hours ago</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Design landing page
                                    </p>
                                </div>
                            </div>

                            {/* Activity 3 */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Plus className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                                            Created task
                                        </h5>
                                        <span className="text-[10px] text-slate-400 shrink-0">1 day ago</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        Research new features
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

Tasks.layout = (page) => <DashboardLayout activePage="Tasks">{page}</DashboardLayout>;

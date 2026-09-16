import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle2, 
    Layers, 
    Kanban, 
    Users, 
    Zap, 
    ArrowRight, 
    Clock, 
    Plus,
    LayoutDashboard,
    ShieldCheck
} from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // Interactive state to demonstrate React is active and working
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Inisialisasi Laravel 13 + React', status: 'Done', priority: 'High' },
        { id: 2, title: 'Setup Inertia.js & Tailwind CSS v4', status: 'Done', priority: 'Urgent' },
        { id: 3, title: 'Bangun Sistem Autentikasi Custom', status: 'In Progress', priority: 'High' },
        { id: 4, title: 'Module Project & Kanban Board', status: 'Todo', priority: 'Medium' },
    ]);

    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        setTasks([
            ...tasks,
            {
                id: Date.now(),
                title: newTaskTitle,
                status: 'Todo',
                priority: 'Medium',
            },
        ]);
        setNewTaskTitle('');
    };

    const toggleStatus = (id) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    const nextStatus = 
                        task.status === 'Todo' ? 'In Progress' :
                        task.status === 'In Progress' ? 'Done' : 'Todo';
                    return { ...task, status: nextStatus };
                }
                return task;
            })
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
            <Head title="WorkTrack - Project & Task Manager" />

            {/* Top Navbar */}
            <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                WorkTrack
                            </span>
                            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                v1.0
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            onClick={() => alert('Fitur Auth sedang dipersiapkan untuk langkah selanjutnya!')}
                        >
                            Masuk
                        </button>
                        <button 
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/25 transition-all duration-200 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                            onClick={() => alert('Fitur Register siap dibangun di tahap berikutnya!')}
                        >
                            Daftar Akun
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        React + Inertia + Tailwind v4 Aktif & Berjalan Lancar
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                        Kelola Proyek & Tugas dengan{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Cepat & Presisi
                        </span>
                    </h1>

                    <p className="text-slate-400 text-base sm:text-lg">
                        Dibangun dari nol dengan arsitektur bersih tanpa paket bloated. Siap untuk custom authentication, manajemen proyek, dan papan Kanban.
                    </p>
                </div>

                {/* Interactive React Verification Card */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                                    <Kanban className="w-4 h-4" />
                                    <span>Interactive React Test Preview</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mt-1">Live Task Tracker State</h2>
                                <p className="text-xs text-slate-400">Klik status untuk mengubah state secara realtime</p>
                            </div>

                            {/* Add Task Quick Form */}
                            <form onSubmit={handleAddTask} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tambah task baru..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="bg-slate-950 border border-slate-700 text-sm rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all w-48 sm:w-64"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah</span>
                                </button>
                            </form>
                        </div>

                        {/* Task List */}
                        <div className="divide-y divide-slate-800/60 mt-4">
                            {tasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    className="py-3.5 flex items-center justify-between group hover:bg-slate-800/30 px-3 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => toggleStatus(task.id)}
                                            className="text-slate-500 hover:text-indigo-400 transition-colors"
                                        >
                                            <CheckCircle2 
                                                className={`w-5 h-5 ${
                                                    task.status === 'Done' ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'
                                                }`} 
                                            />
                                        </button>
                                        <span className={`text-sm font-medium ${
                                            task.status === 'Done' ? 'line-through text-slate-500' : 'text-slate-200'
                                        }`}>
                                            {task.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                            task.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                            task.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                            {task.priority}
                                        </span>

                                        <button
                                            onClick={() => toggleStatus(task.id)}
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all ${
                                                task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                task.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                                'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}
                                        >
                                            {task.status}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/40 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                            <Kanban className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-2">Kanban Board Interaktif</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Organisir alur kerja tim dengan drag-and-drop kolom status dari Todo hingga Done.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/40 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-2">Custom Auth dari Nol</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Sistem otentikasi kustom yang ramping, aman, dan mudah dimodifikasi tanpa starter kit berlebih.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 hover:border-indigo-500/40 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-2">Performa Cepat</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Single Page Application (SPA) responsif didukung Inertia.js dan rendering Tailwind CSS v4.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
                <p>WorkTrack &bull; Laravel {laravelVersion || '13'} + React 19 + Inertia.js + Tailwind CSS</p>
            </footer>
        </div>
    );
}

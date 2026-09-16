import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Folder,
    Check,
    FileText,
    Calendar as CalendarIcon,
    BarChart3,
    Archive as ArchiveIcon,
} from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeNode, setActiveNode] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // For presentation and development: smooth transition to dashboard
        setTimeout(() => {
            router.visit('/dashboard');
        }, 400);
    };

    return (
        <div className="min-h-screen w-full bg-[#f8fbfe] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans text-slate-800 relative overflow-hidden selection:bg-blue-600 selection:text-white">
            <Head title="Sign In - WorkTrack" />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-300/10 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle Dot Matrix Pattern in Upper Right */}
            <div
                className="absolute top-8 right-12 w-64 h-64 opacity-35 pointer-events-none hidden md:block"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                    backgroundSize: '16px 16px',
                }}
            />

            {/* Main Full Width Wrapper */}
            <div className="w-full max-w-[1520px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* ========================================================== */}
                {/* LEFT: LOGIN CARD                                           */}
                {/* ========================================================== */}
                <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-start">
                    <div className="w-full max-w-[450px] bg-white rounded-2xl p-7 sm:p-9 shadow-xl shadow-slate-200/60 border border-slate-100/90 relative">
                        {/* Top Header inside Card */}
                        <div className="flex items-center justify-between">
                            {/* Brand Logo */}
                            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                                    <span className="text-white font-black text-sm tracking-tighter">
                                        W
                                    </span>
                                </div>
                                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                                    WorkTrack
                                </span>
                            </Link>

                            {/* Welcome Back Note */}
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-800">
                                    Welcome Back
                                </p>
                                <p className="text-[11px] text-slate-400 font-medium">
                                    Glad to see you again!
                                </p>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="mt-8 sm:mt-10 space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                Sign In to{' '}
                                <span className="block mt-0.5">
                                    Work<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Track</span>
                                </span>
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
                                Manage your projects, tasks, and productivity in one place. Let's get things done!
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                            {/* Email Address */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white hover:border-slate-300"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 block">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white hover:border-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Checkbox & Forgot Password */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-xs font-medium text-slate-600">
                                        Remember me
                                    </span>
                                </label>

                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-gradient-to-r from-[#3b66ff] via-[#3b82f6] to-[#4f46e5] hover:from-[#3256ee] hover:to-[#4338ca] text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-75"
                                >
                                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Sign Up prompt */}
                        <div className="text-center mt-6">
                            <span className="text-xs text-slate-500">
                                Don't have an account?{' '}
                            </span>
                            <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Create one
                            </a>
                        </div>
                    </div>
                </div>

                {/* ========================================================== */}
                {/* RIGHT: CONNECTED ECOSYSTEM DIAGRAM                         */}
                {/* ========================================================== */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center py-6 sm:py-10">
                    {/* Header: One Place, Bigger Progress */}
                    <div className="text-center space-y-2 mb-8 sm:mb-12">
                        <span className="text-[11px] sm:text-xs font-bold text-indigo-600 tracking-widest uppercase inline-block">
                            ONE PLACE, BIGGER PROGRESS
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Your Work,{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Connected
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Bring your projects, tasks, notes, and files together.
                            <br className="hidden sm:inline" />
                            With GitHub and Google Drive, everything you need is right here.
                        </p>
                    </div>

                    {/* Interactive Ecosystem Canvas */}
                    <div className="relative w-full max-w-[820px] h-[480px] sm:h-[520px] select-none">
                        {/* Radar / Concentric Rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[380px] h-[340px] sm:h-[380px] rounded-full border border-blue-200/40 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[270px] h-[240px] sm:h-[270px] rounded-full border border-indigo-200/50 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[170px] h-[150px] sm:h-[170px] rounded-full border border-blue-300/60 pointer-events-none" />

                        {/* SVG Connection Lines */}
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none z-10"
                            viewBox="0 0 820 520"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="grad-projects" x1="220" y1="70" x2="410" y2="245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#3b82f6" />
                                    <stop offset="1" stopColor="#60a5fa" />
                                </linearGradient>
                                <linearGradient id="grad-tasks" x1="220" y1="185" x2="410" y2="245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#10b981" />
                                    <stop offset="1" stopColor="#06b6d4" />
                                </linearGradient>
                                <linearGradient id="grad-notes" x1="220" y1="300" x2="410" y2="255" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#8b5cf6" />
                                    <stop offset="1" stopColor="#6366f1" />
                                </linearGradient>
                                <linearGradient id="grad-github" x1="240" y1="410" x2="410" y2="270" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#475569" />
                                    <stop offset="1" stopColor="#3b82f6" />
                                </linearGradient>
                                <linearGradient id="grad-calendar" x1="600" y1="70" x2="410" y2="245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ec4899" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                                <linearGradient id="grad-portfolio" x1="600" y1="185" x2="410" y2="245" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#f59e0b" />
                                    <stop offset="1" stopColor="#ec4899" />
                                </linearGradient>
                                <linearGradient id="grad-archive" x1="600" y1="300" x2="410" y2="255" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#06b6d4" />
                                </linearGradient>
                                <linearGradient id="grad-drive" x1="580" y1="410" x2="410" y2="270" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#10b981" />
                                    <stop offset="1" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>

                            {/* Left Splines */}
                            {/* 1. Projects (Top Left) */}
                            <path d="M 230 70 C 310 70, 340 180, 410 240" stroke="url(#grad-projects)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="280" cy="74" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />

                            {/* 2. Tasks (Mid Left) */}
                            <path d="M 230 185 C 310 185, 345 225, 410 248" stroke="url(#grad-tasks)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="275" cy="188" r="5" fill="#14b8a6" stroke="#ffffff" strokeWidth="2" />

                            {/* 3. Notes (Lower Left) */}
                            <path d="M 230 300 C 310 300, 345 275, 410 262" stroke="url(#grad-notes)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="275" cy="298" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />

                            {/* 4. GitHub (Bottom Left) */}
                            <path d="M 250 410 C 320 410, 350 340, 410 272" stroke="url(#grad-github)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="320" cy="380" r="5" fill="#64748b" stroke="#ffffff" strokeWidth="2" />

                            {/* Right Splines */}
                            {/* 5. Calendar (Top Right) */}
                            <path d="M 590 70 C 510 70, 480 180, 410 240" stroke="url(#grad-calendar)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="540" cy="74" r="5" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />

                            {/* 6. Portfolio (Mid Right) */}
                            <path d="M 590 185 C 510 185, 475 225, 410 248" stroke="url(#grad-portfolio)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="545" cy="188" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

                            {/* 7. Archive (Lower Right) */}
                            <path d="M 590 300 C 510 300, 475 275, 410 262" stroke="url(#grad-archive)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="545" cy="298" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />

                            {/* 8. Google Drive (Bottom Right) */}
                            <path d="M 570 410 C 500 410, 470 340, 410 272" stroke="url(#grad-drive)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="500" cy="380" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                        </svg>

                        {/* ==================================================== */}
                        {/* CENTER APP ICON                                      */}
                        {/* ==================================================== */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#2563eb] via-[#3b82f6] to-[#60a5fa] shadow-2xl shadow-blue-500/40 border-2 border-white flex items-center justify-center relative group hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <span className="text-white font-black text-3xl sm:text-4xl tracking-tighter drop-shadow-sm select-none">
                                    W
                                </span>
                            </div>
                            <span className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight mt-2.5">
                                WorkTrack
                            </span>
                        </div>

                        {/* ==================================================== */}
                        {/* 8 CONNECTED NODE CARDS (Exact Layout & Typography)  */}
                        {/* ==================================================== */}
                        {/* 1. Projects (Top Left) */}
                        <div
                            onMouseEnter={() => setActiveNode('projects')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[40px] left-[10px] sm:left-[30px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer ${
                                activeNode === 'projects' ? 'scale-103 border-blue-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Folder className="w-5 h-5 fill-blue-500/20" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Projects
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Plan and organize
                                </p>
                            </div>
                        </div>

                        {/* 2. Tasks (Middle Left) */}
                        <div
                            onMouseEnter={() => setActiveNode('tasks')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[160px] left-[10px] sm:left-[30px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer ${
                                activeNode === 'tasks' ? 'scale-103 border-emerald-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs shadow-emerald-500/20">
                                <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Tasks
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Get things done
                                </p>
                            </div>
                        </div>

                        {/* 3. Notes (Lower Left) */}
                        <div
                            onMouseEnter={() => setActiveNode('notes')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[275px] left-[10px] sm:left-[30px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer ${
                                activeNode === 'notes' ? 'scale-103 border-purple-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 fill-indigo-500/20" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Notes
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Capture your ideas
                                </p>
                            </div>
                        </div>

                        {/* 4. GitHub (Bottom Left) */}
                        <div
                            onMouseEnter={() => setActiveNode('github')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[385px] left-[30px] sm:left-[70px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-50 sm:w-56 cursor-pointer ${
                                activeNode === 'github' ? 'scale-103 border-slate-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-950 text-white flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    GitHub
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Sync your repositories
                                </p>
                            </div>
                        </div>

                        {/* 5. Calendar (Top Right) */}
                        <div
                            onMouseEnter={() => setActiveNode('calendar')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[40px] right-[10px] sm:right-[30px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer ${
                                activeNode === 'calendar' ? 'scale-103 border-rose-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Calendar
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Manage your schedule
                                </p>
                            </div>
                        </div>

                        {/* 6. Portfolio (Middle Right) */}
                        <div
                            onMouseEnter={() => setActiveNode('portfolio')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[160px] right-[10px] sm:right-[30px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer ${
                                activeNode === 'portfolio' ? 'scale-103 border-amber-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Portfolio
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Track your progress
                                </p>
                            </div>
                        </div>

                        {/* 7. Archive (Lower Right) */}
                        <div
                            onMouseEnter={() => setActiveNode('archive')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[275px] right-[10px] sm:right-[30px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer ${
                                activeNode === 'archive' ? 'scale-103 border-purple-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <ArchiveIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Archive
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Keep everything safe
                                </p>
                            </div>
                        </div>

                        {/* 8. Google Drive (Bottom Right) */}
                        <div
                            onMouseEnter={() => setActiveNode('drive')}
                            onMouseLeave={() => setActiveNode(null)}
                            className={`absolute top-[385px] right-[30px] sm:right-[70px] z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 w-50 sm:w-56 cursor-pointer ${
                                activeNode === 'drive' ? 'scale-103 border-emerald-400' : ''
                            }`}
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M7.74 3.5h8.52l4.98 8.64H12.72L7.74 3.5z" fill="#FFC107" />
                                    <path d="M12.72 12.14l-4.98 8.64H2.76l4.98-8.64h4.98z" fill="#0066DA" />
                                    <path d="M21.24 12.14l-4.98 8.64H7.74l4.98-8.64h8.52z" fill="#00AC47" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    Google Drive
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                    Access your files
                                </p>
                            </div>
                        </div>

                        {/* Handwritten "Small Steps Big Progress" in Caveat cursive */}
                        <div className="absolute bottom-[20px] left-[42%] -translate-x-1/2 z-20 text-center -rotate-6 pointer-events-none select-none">
                            <p className="font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-indigo-500/85 leading-tight tracking-wide">
                                Small Steps
                                <br />
                                <span className="ml-4 text-indigo-600/90">Big Progress</span>
                            </p>
                            {/* Hand-drawn underline squiggle */}
                            <svg className="w-24 h-4 mx-auto mt-0.5 text-indigo-400/80" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M 5 12 Q 30 6, 55 12 T 95 10" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

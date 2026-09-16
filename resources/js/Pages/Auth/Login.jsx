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
    Plus,
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

        // Smooth transition to dashboard
        setTimeout(() => {
            router.visit('/dashboard');
        }, 400);
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans text-slate-800 bg-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
            <Head title="Sign In - WorkTrack" />

            {/* ========================================================== */}
            {/* LEFT SIDE: CLEAN LIGHT SIGN IN PANEL (Seamless Full White) */}
            {/* ========================================================== */}
            <div className="w-full lg:w-[36%] xl:w-[32%] 2xl:w-[30%] bg-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 relative z-20 min-h-screen shrink-0">
                {/* Brand Logo Header */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <img
                            src="/images/logo.png"
                            alt="WorkTrack Logo"
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform"
                        />
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                            WorkTrack
                        </span>
                    </Link>
                </div>

                {/* Form Container (Directly on Canvas, No Card Wrapper) */}
                <div className="max-w-[380px] w-full mx-auto my-auto py-6">
                    {/* Welcome Badge */}
                    <div className="inline-block mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                            Welcome Back
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Sign In to{' '}
                        <span className="block mt-0.5">
                            Work<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Track</span>
                        </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2.5">
                        Manage your projects, tasks, and productivity in one place. Let's get things done!
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4.5">
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

                        {/* Remember me & Forgot Password */}
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

                        {/* Sign In CTA */}
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

                    {/* Don't have an account */}
                    <div className="text-center mt-7">
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

                {/* Left Bottom Footer */}
                <div className="text-left text-[11px] text-slate-400">
                    © 2026 WorkTrack. All rights reserved.
                </div>
            </div>

            {/* ========================================================== */}
            {/* RIGHT SIDE: SLEEK DARK MODE ECOSYSTEM SHOWCASE             */}
            {/* ========================================================== */}
            <div className="hidden lg:flex lg:w-[64%] xl:w-[68%] 2xl:w-[70%] bg-[#060b19] relative overflow-hidden flex-col justify-between p-8 xl:p-12 text-white min-h-screen">
                {/* Ambient Neon Blue & Indigo Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Subtle Matrix Dots */}
                <div
                    className="absolute top-6 right-8 w-60 h-60 opacity-15 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#60a5fa 1.5px, transparent 1.5px)',
                        backgroundSize: '18px 18px',
                    }}
                />

                {/* Top Nav Status on Dark Right */}
                <div className="flex items-center justify-end gap-3 text-xs text-slate-400 select-none z-10">
                    <span className="hover:text-slate-200 transition-colors">Organize</span>
                    <span>·</span>
                    <span className="hover:text-slate-200 transition-colors">Connect</span>
                    <span>·</span>
                    <span className="hover:text-slate-200 transition-colors">Achieve</span>
                    <span className="w-6 h-1 bg-blue-500 rounded-full ml-1" />
                </div>

                {/* Center Ecosystem Canvas (Interactive 10 Connected Nodes) */}
                <div className="relative w-full max-w-[860px] mx-auto h-[480px] xl:h-[510px] my-auto select-none">
                    {/* Concentric Radar Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-blue-500/10 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[310px] h-[310px] rounded-full border border-blue-400/15 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-400/25 pointer-events-none animate-pulse" />

                    {/* SVG Glowing Neon Connection Lines */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        viewBox="0 0 860 500"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Left Gradients */}
                            <linearGradient id="neon-node1" x1="220" y1="45" x2="430" y2="235" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#38bdf8" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="neon-node2" x1="220" y1="135" x2="430" y2="240" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2dd4bf" />
                                <stop offset="1" stopColor="#06b6d4" />
                            </linearGradient>
                            <linearGradient id="neon-node3" x1="220" y1="225" x2="430" y2="250" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#eab308" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="neon-node4" x1="220" y1="315" x2="430" y2="260" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#818cf8" />
                                <stop offset="1" stopColor="#6366f1" />
                            </linearGradient>
                            <linearGradient id="neon-node5" x1="220" y1="405" x2="430" y2="265" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#c084fc" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>

                            {/* Right Gradients */}
                            <linearGradient id="neon-node6" x1="640" y1="45" x2="430" y2="235" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#34d399" />
                                <stop offset="1" stopColor="#06b6d4" />
                            </linearGradient>
                            <linearGradient id="neon-node7" x1="640" y1="135" x2="430" y2="240" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#60a5fa" />
                                <stop offset="1" stopColor="#818cf8" />
                            </linearGradient>
                            <linearGradient id="neon-node8" x1="640" y1="225" x2="430" y2="250" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#38bdf8" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="neon-node9" x1="640" y1="315" x2="430" y2="260" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f472b6" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="neon-node10" x1="640" y1="405" x2="430" y2="265" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2dd4bf" />
                                <stop offset="1" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>

                        {/* Left 5 Connections */}
                        {/* 1. Projects */}
                        <path d="M 230 45 C 320 45, 350 200, 430 235" stroke="url(#neon-node1)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="280" cy="50" r="5" fill="#38bdf8" stroke="#060b19" strokeWidth="2" />

                        {/* 2. Tasks */}
                        <path d="M 230 135 C 320 135, 360 215, 430 242" stroke="url(#neon-node2)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="290" cy="142" r="5" fill="#2dd4bf" stroke="#060b19" strokeWidth="2" />

                        {/* 3. Google Drive */}
                        <path d="M 230 225 C 320 225, 370 245, 430 250" stroke="url(#neon-node3)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="310" cy="232" r="5" fill="#eab308" stroke="#060b19" strokeWidth="2" />

                        {/* 4. GitHub */}
                        <path d="M 230 315 C 320 315, 365 285, 430 258" stroke="url(#neon-node4)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="295" cy="308" r="5" fill="#818cf8" stroke="#060b19" strokeWidth="2" />

                        {/* 5. Notes */}
                        <path d="M 230 405 C 320 405, 350 295, 430 265" stroke="url(#neon-node5)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="285" cy="398" r="5" fill="#c084fc" stroke="#060b19" strokeWidth="2" />

                        {/* Right 5 Connections */}
                        {/* 6. Calendar */}
                        <path d="M 630 45 C 540 45, 510 200, 430 235" stroke="url(#neon-node6)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="580" cy="50" r="5" fill="#34d399" stroke="#060b19" strokeWidth="2" />

                        {/* 7. Portfolio */}
                        <path d="M 630 135 C 540 135, 500 215, 430 242" stroke="url(#neon-node7)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="570" cy="142" r="5" fill="#60a5fa" stroke="#060b19" strokeWidth="2" />

                        {/* 8. Archive */}
                        <path d="M 630 225 C 540 225, 490 245, 430 250" stroke="url(#neon-node8)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="550" cy="232" r="5" fill="#38bdf8" stroke="#060b19" strokeWidth="2" />

                        {/* 9. Mail/Updates */}
                        <path d="M 630 315 C 540 315, 495 285, 430 258" stroke="url(#neon-node9)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="565" cy="308" r="5" fill="#f472b6" stroke="#060b19" strokeWidth="2" />

                        {/* 10. And More */}
                        <path d="M 630 405 C 540 405, 510 295, 430 265" stroke="url(#neon-node10)" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="575" cy="398" r="5" fill="#2dd4bf" stroke="#060b19" strokeWidth="2" />
                    </svg>

                    {/* ==================================================== */}
                    {/* CENTER GLOWING LOGO HUB                              */}
                    {/* ==================================================== */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-b from-[#0e1f4d] via-[#091433] to-[#060c20] border-2 border-blue-400/60 shadow-[0_0_45px_rgba(59,130,246,0.6)] flex flex-col items-center justify-center relative group hover:scale-105 transition-all duration-300 cursor-pointer p-3">
                            {/* Inner Ambient Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 pointer-events-none" />

                            <img
                                src="/images/logo.png"
                                alt="WorkTrack Logo"
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] relative z-10"
                            />
                            <span className="text-[11px] sm:text-xs font-extrabold text-slate-200 tracking-tight mt-1.5 select-none relative z-10">
                                WorkTrack
                            </span>
                        </div>
                    </div>

                    {/* ==================================================== */}
                    {/* 10 CONNECTED NODES (Dark Glassmorphic Style)          */}
                    {/* ==================================================== */}
                    {/* LEFT COLUMN (5 Nodes) */}
                    {/* 1. Projects */}
                    <div
                        onMouseEnter={() => setActiveNode('projects')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[18px] left-[15px] sm:left-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'projects' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Folder className="w-5 h-5 fill-white/20" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                                Projects
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Plan and organize
                            </p>
                        </div>
                    </div>

                    {/* 2. Tasks */}
                    <div
                        onMouseEnter={() => setActiveNode('tasks')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[108px] left-[15px] sm:left-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-emerald-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'tasks' ? 'scale-103 border-emerald-400 shadow-emerald-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                                Tasks
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Get things done
                            </p>
                        </div>
                    </div>

                    {/* 3. Google Drive */}
                    <div
                        onMouseEnter={() => setActiveNode('drive')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[198px] left-[15px] sm:left-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-yellow-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'drive' ? 'scale-103 border-yellow-400 shadow-yellow-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M7.74 3.5h8.52l4.98 8.64H12.72L7.74 3.5z" fill="#FFC107" />
                                <path d="M12.72 12.14l-4.98 8.64H2.76l4.98-8.64h4.98z" fill="#0066DA" />
                                <path d="M21.24 12.14l-4.98 8.64H7.74l4.98-8.64h8.52z" fill="#00AC47" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-yellow-300 transition-colors leading-tight">
                                Google Drive
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Access your files
                            </p>
                        </div>
                    </div>

                    {/* 4. GitHub */}
                    <div
                        onMouseEnter={() => setActiveNode('github')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[288px] left-[15px] sm:left-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-slate-300/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'github' ? 'scale-103 border-slate-300 shadow-slate-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-slate-200 transition-colors leading-tight">
                                GitHub
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Sync your code
                            </p>
                        </div>
                    </div>

                    {/* 5. Notes */}
                    <div
                        onMouseEnter={() => setActiveNode('notes')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[378px] left-[15px] sm:left-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-purple-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'notes' ? 'scale-103 border-purple-400 shadow-purple-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <FileText className="w-5 h-5 fill-white/20" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                                Notes
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                All your notes & ideas
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (5 Nodes) */}
                    {/* 6. Calendar */}
                    <div
                        onMouseEnter={() => setActiveNode('calendar')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[18px] right-[15px] sm:right-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-emerald-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'calendar' ? 'scale-103 border-emerald-400 shadow-emerald-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                                Calendar
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Plan your schedule
                            </p>
                        </div>
                    </div>

                    {/* 7. Portfolio */}
                    <div
                        onMouseEnter={() => setActiveNode('portfolio')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[108px] right-[15px] sm:right-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'portfolio' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                                Portfolio
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Track your progress
                            </p>
                        </div>
                    </div>

                    {/* 8. Archive */}
                    <div
                        onMouseEnter={() => setActiveNode('archive')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[198px] right-[15px] sm:right-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-cyan-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'archive' ? 'scale-103 border-cyan-400 shadow-cyan-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <ArchiveIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                                Archive
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Keep everything safe
                            </p>
                        </div>
                    </div>

                    {/* 9. Mail / Updates */}
                    <div
                        onMouseEnter={() => setActiveNode('mail')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[288px] right-[15px] sm:right-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-rose-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'mail' ? 'scale-103 border-rose-400 shadow-rose-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-300 transition-colors leading-tight">
                                Updates
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Important alerts
                            </p>
                        </div>
                    </div>

                    {/* 10. And More */}
                    <div
                        onMouseEnter={() => setActiveNode('more')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[378px] right-[15px] sm:right-[35px] z-20 bg-[#0d1838]/85 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-cyan-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-48 sm:w-54 cursor-pointer group ${
                            activeNode === 'more' ? 'scale-103 border-cyan-400 shadow-cyan-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
                                And More
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Connect your tools
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Section on Dark Right */}
                <div className="text-center z-10 space-y-3 pt-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Everything Connected,{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                            More Productivity
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                        Integrate your favorite tools, streamline your workflow, and focus on what matters most.
                    </p>

                    {/* Indicator Pills */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <span className="w-5 h-1.5 rounded-full bg-blue-500" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                </div>

                {/* Handwritten signature in bottom right corner */}
                <div className="absolute bottom-6 right-8 text-right -rotate-6 pointer-events-none select-none z-10 hidden xl:block">
                    <p className="font-['Caveat',cursive] text-2xl font-bold text-indigo-400/80 leading-tight">
                        Small Steps
                        <br />
                        <span className="text-blue-300/90">Big Progress</span>
                    </p>
                    <svg className="w-20 h-3 ml-auto mt-0.5 text-blue-400/60" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M 10 12 Q 35 6, 60 12 T 95 10" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

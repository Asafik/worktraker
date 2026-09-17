import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    AlertCircle,
    Folder,
    Check,
    FileText,
    Calendar as CalendarIcon,
    BarChart3,
    Archive as ArchiveIcon,
    Plus,
} from 'lucide-react';
import Checkbox from '@/Components/Checkbox';

export default function Login({ errors = {} }) {
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [activeNode, setActiveNode] = useState(null);

    const mergedErrors = { ...errors, ...formErrors };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({});

        router.post('/login', {
            login: loginInput,
            password: password,
            remember: rememberMe,
        }, {
            onError: (errs) => {
                setFormErrors(errs);
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans text-slate-800 bg-white selection:bg-blue-600 selection:text-white overflow-x-hidden">
            <Head title="Masuk - WorkTrack" />

            {/* ========================================================== */}
            {/* LEFT SIDE: CLEAN LIGHT SIGN IN PANEL (Seamless Full White) */}
            {/* ========================================================== */}
            <div className="w-full lg:w-[40%] xl:w-[36%] 2xl:w-[34%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 relative z-20 min-h-screen shrink-0">
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
                <div className="max-w-[400px] w-full mx-auto my-auto py-6">
                    {/* Welcome Badge */}
                    <div className="inline-block mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                            Selamat Datang
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Masuk ke{' '}
                        <span className="block mt-0.5">
                            Work<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Track</span>
                        </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2.5">
                        Kelola proyek, tugas, dan produktivitas Anda dalam satu tempat.
                    </p>

                    {/* Error Banner */}
                    {mergedErrors.login && (
                        <div className="mt-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2.5 animate-fadeIn">
                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                            <span>{mergedErrors.login}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4.5">
                        {/* Username or Email Address */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 block">
                                Username atau Email
                            </label>
                            <div className="relative">
                                {loginInput.includes('@') ? (
                                    <Mail className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                                ) : (
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                                )}
                                <input
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={loginInput}
                                    onChange={(e) => {
                                        setLoginInput(e.target.value);
                                        if (formErrors.login) {
                                            setFormErrors((prev) => ({ ...prev, login: null }));
                                        }
                                    }}
                                    placeholder="Username atau email@example.com"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all bg-white hover:border-slate-300 ${
                                        mergedErrors.login
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                                    }`}
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
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (formErrors.password) {
                                            setFormErrors((prev) => ({ ...prev, password: null }));
                                        }
                                    }}
                                    placeholder="Masukkan password Anda"
                                    className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all bg-white hover:border-slate-300 ${
                                        mergedErrors.password
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {mergedErrors.password && (
                                <p className="text-xs text-rose-500 font-medium mt-1">
                                    {mergedErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember me & Forgot Password */}
                        <div className="flex items-center justify-between pt-1">
                            <Checkbox
                                checked={rememberMe}
                                onChange={setRememberMe}
                                label="Ingat saya"
                                size="sm"
                            />

                            <a
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Lupa password?
                            </a>
                        </div>

                        {/* Sign In CTA */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-gradient-to-r from-[#3b66ff] via-[#3b82f6] to-[#4f46e5] hover:from-[#3256ee] hover:to-[#4338ca] text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                            >
                                <span>{isLoading ? 'Memproses...' : 'Masuk'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Don't have an account */}
                    <div className="text-center mt-7">
                        <span className="text-xs text-slate-500">
                            Belum memiliki akun?{' '}
                        </span>
                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Daftar sekarang
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
            <div className="hidden lg:flex lg:w-[60%] xl:w-[64%] 2xl:w-[66%] bg-[#060b19] relative overflow-hidden flex-col justify-between p-8 xl:p-12 text-white min-h-screen">
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
                <div className="relative w-full max-w-[1000px] xl:max-w-[1080px] 2xl:max-w-[1140px] mx-auto h-[580px] my-auto select-none">
                    {/* Concentric Radar Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-blue-500/10 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-blue-400/15 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[210px] rounded-full border border-cyan-400/25 pointer-events-none animate-pulse" />

                    {/* SVG Glowing Neon Connection Lines (Thick, Seamlessly Attached to Cards) */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        viewBox="0 0 1000 580"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Ambient Glow Filter for Flowing Photons */}
                            <filter id="photon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Left Gradients */}
                            <linearGradient id="neon-node1" x1="170" y1="43" x2="490" y2="260" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#38bdf8" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="neon-node2" x1="170" y1="163" x2="490" y2="275" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2dd4bf" />
                                <stop offset="1" stopColor="#06b6d4" />
                            </linearGradient>
                            <linearGradient id="neon-node3" x1="170" y1="290" x2="490" y2="290" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#facc15" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="neon-node4" x1="170" y1="418" x2="490" y2="305" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#818cf8" />
                                <stop offset="1" stopColor="#6366f1" />
                            </linearGradient>
                            <linearGradient id="neon-node5" x1="170" y1="538" x2="490" y2="320" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#c084fc" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>

                            {/* Right Gradients */}
                            <linearGradient id="neon-node6" x1="830" y1="43" x2="510" y2="260" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4285f4" />
                                <stop offset="1" stopColor="#38bdf8" />
                            </linearGradient>
                            <linearGradient id="neon-node7" x1="830" y1="163" x2="510" y2="275" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#60a5fa" />
                                <stop offset="1" stopColor="#818cf8" />
                            </linearGradient>
                            <linearGradient id="neon-node8" x1="830" y1="290" x2="510" y2="290" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#38bdf8" />
                                <stop offset="1" stopColor="#3b82f6" />
                            </linearGradient>
                            <linearGradient id="neon-node9" x1="830" y1="418" x2="510" y2="305" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f472b6" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="neon-node10" x1="830" y1="538" x2="510" y2="320" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#2dd4bf" />
                                <stop offset="1" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>

                        {/* ==================================================== */}
                        {/* LEFT 5 CONNECTIONS (Flowing into WorkTrack Hub)      */}
                        {/* ==================================================== */}
                        {/* 1. Projects */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 170 43 C 260 43, 380 230, 490 260"
                                stroke="url(#neon-node1)"
                                strokeWidth={activeNode === 'projects' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'projects' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 170 43 C 260 43, 380 230, 490 260"
                                stroke="url(#neon-node1)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.6s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#38bdf8" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 170 43 C 260 43, 380 230, 490 260" dur="2.6s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 170 43 C 260 43, 380 230, 490 260" dur="2.6s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 2. Tasks */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 170 163 C 250 163, 370 255, 490 275"
                                stroke="url(#neon-node2)"
                                strokeWidth={activeNode === 'tasks' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'tasks' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 170 163 C 250 163, 370 255, 490 275"
                                stroke="url(#neon-node2)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.9s" begin="0.5s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#2dd4bf" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 170 163 C 250 163, 370 255, 490 275" dur="2.9s" begin="0.5s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#2dd4bf" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 170 163 C 250 163, 370 255, 490 275" dur="2.9s" begin="0.5s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 3. Google Drive */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 170 290 C 260 290, 380 290, 490 290"
                                stroke="url(#neon-node3)"
                                strokeWidth={activeNode === 'drive' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'drive' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 170 290 C 260 290, 380 290, 490 290"
                                stroke="url(#neon-node3)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.4s" begin="0.2s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#facc15" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 170 290 C 260 290, 380 290, 490 290" dur="2.4s" begin="0.2s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#facc15" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 170 290 C 260 290, 380 290, 490 290" dur="2.4s" begin="0.2s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 4. GitHub */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 170 418 C 250 418, 370 325, 490 305"
                                stroke="url(#neon-node4)"
                                strokeWidth={activeNode === 'github' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'github' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 170 418 C 250 418, 370 325, 490 305"
                                stroke="url(#neon-node4)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="3.0s" begin="0.7s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#818cf8" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 170 418 C 250 418, 370 325, 490 305" dur="3.0s" begin="0.7s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#818cf8" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 170 418 C 250 418, 370 325, 490 305" dur="3.0s" begin="0.7s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 5. Notes */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 170 538 C 260 538, 380 350, 490 320"
                                stroke="url(#neon-node5)"
                                strokeWidth={activeNode === 'notes' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'notes' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 170 538 C 260 538, 380 350, 490 320"
                                stroke="url(#neon-node5)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.7s" begin="0.3s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#c084fc" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 170 538 C 260 538, 380 350, 490 320" dur="2.7s" begin="0.3s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#c084fc" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 170 538 C 260 538, 380 350, 490 320" dur="2.7s" begin="0.3s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* ==================================================== */}
                        {/* RIGHT 5 CONNECTIONS (Flowing into WorkTrack Hub)     */}
                        {/* ==================================================== */}
                        {/* 6. Calendar */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 830 43 C 740 43, 620 230, 510 260"
                                stroke="url(#neon-node6)"
                                strokeWidth={activeNode === 'calendar' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'calendar' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 830 43 C 740 43, 620 230, 510 260"
                                stroke="url(#neon-node6)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.7s" begin="0.4s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#4285f4" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 830 43 C 740 43, 620 230, 510 260" dur="2.7s" begin="0.4s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#4285f4" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 830 43 C 740 43, 620 230, 510 260" dur="2.7s" begin="0.4s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 7. Portfolio */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 830 163 C 750 163, 630 255, 510 275"
                                stroke="url(#neon-node7)"
                                strokeWidth={activeNode === 'portfolio' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'portfolio' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 830 163 C 750 163, 630 255, 510 275"
                                stroke="url(#neon-node7)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="3.0s" begin="0.8s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#60a5fa" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 830 163 C 750 163, 630 255, 510 275" dur="3.0s" begin="0.8s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 830 163 C 750 163, 630 255, 510 275" dur="3.0s" begin="0.8s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 8. Archive */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 830 290 C 740 290, 620 290, 510 290"
                                stroke="url(#neon-node8)"
                                strokeWidth={activeNode === 'archive' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'archive' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 830 290 C 740 290, 620 290, 510 290"
                                stroke="url(#neon-node8)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.5s" begin="0.1s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#38bdf8" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 830 290 C 740 290, 620 290, 510 290" dur="2.5s" begin="0.1s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 830 290 C 740 290, 620 290, 510 290" dur="2.5s" begin="0.1s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 9. Mail/Updates */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 830 418 C 750 418, 630 325, 510 305"
                                stroke="url(#neon-node9)"
                                strokeWidth={activeNode === 'mail' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'mail' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 830 418 C 750 418, 630 325, 510 305"
                                stroke="url(#neon-node9)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#f472b6" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 830 418 C 750 418, 630 325, 510 305" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#f472b6" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 830 418 C 750 418, 630 325, 510 305" dur="2.8s" begin="0.6s" repeatCount="indefinite" />
                            </circle>
                        </g>

                        {/* 10. And More */}
                        <g>
                            {/* Base Bold Cable */}
                            <path
                                d="M 830 538 C 740 538, 620 350, 510 320"
                                stroke="url(#neon-node10)"
                                strokeWidth={activeNode === 'more' ? '5' : '3.5'}
                                strokeOpacity={activeNode === 'more' ? '1' : '0.65'}
                                strokeLinecap="round"
                            />
                            {/* Animated Pulse Stream */}
                            <path
                                d="M 830 538 C 740 538, 620 350, 510 320"
                                stroke="url(#neon-node10)"
                                strokeWidth="4"
                                strokeDasharray="60 300"
                                strokeLinecap="round"
                            >
                                <animate attributeName="stroke-dashoffset" from="360" to="0" dur="3.1s" begin="0.9s" repeatCount="indefinite" />
                            </path>
                            {/* Traveling Light Photon */}
                            <circle r="7.5" fill="#2dd4bf" opacity="0.5" filter="url(#photon-glow)">
                                <animateMotion path="M 830 538 C 740 538, 620 350, 510 320" dur="3.1s" begin="0.9s" repeatCount="indefinite" />
                            </circle>
                            <circle r="3.5" fill="#ffffff" stroke="#2dd4bf" strokeWidth="2" filter="url(#photon-glow)">
                                <animateMotion path="M 830 538 C 740 538, 620 350, 510 320" dur="3.1s" begin="0.9s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    </svg>

                    {/* ==================================================== */}
                    {/* CENTER GLOWING LOGO HUB                              */}
                    {/* ==================================================== */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-b from-[#0e1f4d] via-[#091433] to-[#060c20] border-2 border-blue-400/60 shadow-[0_0_45px_rgba(59,130,246,0.6)] flex flex-col items-center justify-center relative group hover:scale-105 transition-all duration-300 cursor-pointer p-3">
                            {/* Inner Ambient Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-blue-500/10 pointer-events-none" />

                            <img
                                src="/images/logo.png"
                                alt="WorkTrack Logo"
                                className="w-11 h-11 sm:w-13 sm:h-13 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] relative z-10"
                            />
                            <span className="text-[11px] sm:text-xs font-extrabold text-slate-200 tracking-tight mt-1.5 select-none relative z-10">
                                WorkTrack
                            </span>
                        </div>
                    </div>

                    {/* ==================================================== */}
                    {/* 10 CONNECTED NODES (Solid & Clean Glassmorphism)      */}
                    {/* ==================================================== */}
                    {/* LEFT COLUMN (5 Nodes) */}
                    {/* 1. Projects */}
                    <div
                        onMouseEnter={() => setActiveNode('projects')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[15px] left-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(59,130,246,0.8)] z-30" />
                    </div>

                    {/* 2. Tasks */}
                    <div
                        onMouseEnter={() => setActiveNode('tasks')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[135px] left-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-emerald-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(16,185,129,0.8)] z-30" />
                    </div>

                    {/* 3. Google Drive */}
                    <div
                        onMouseEnter={() => setActiveNode('drive')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[263px] left-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-yellow-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(251,191,36,0.8)] z-30" />
                    </div>

                    {/* 4. GitHub */}
                    <div
                        onMouseEnter={() => setActiveNode('github')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[391px] left-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-slate-300/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(129,140,248,0.8)] z-30" />
                    </div>

                    {/* 5. Notes */}
                    <div
                        onMouseEnter={() => setActiveNode('notes')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[511px] left-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-purple-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(168,85,247,0.8)] z-30" />
                    </div>

                    {/* RIGHT COLUMN (5 Nodes) */}
                    {/* 6. Google Calendar */}
                    <div
                        onMouseEnter={() => setActiveNode('calendar')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[15px] right-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
                            activeNode === 'calendar' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                        }`}
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="17" rx="3" fill="#4285F4" />
                                <rect x="3" y="4" width="18" height="5.5" fill="#1A73E8" rx="2" />
                                <circle cx="7" cy="6.8" r="1" fill="white" />
                                <circle cx="17" cy="6.8" r="1" fill="white" />
                                <text x="12" y="17" fill="white" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-tight truncate">
                                    Google Calendar
                                </h3>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 shrink-0 leading-none">
                                    Connect
                                </span>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                                Sync your schedule
                            </p>
                        </div>
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(66,133,244,0.8)] z-30" />
                    </div>

                    {/* 7. Portfolio */}
                    <div
                        onMouseEnter={() => setActiveNode('portfolio')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[135px] right-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(59,130,246,0.8)] z-30" />
                    </div>

                    {/* 8. Archive */}
                    <div
                        onMouseEnter={() => setActiveNode('archive')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[263px] right-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-cyan-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(6,182,212,0.8)] z-30" />
                    </div>

                    {/* 9. Mail / Updates */}
                    <div
                        onMouseEnter={() => setActiveNode('mail')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[391px] right-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-rose-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(244,63,94,0.8)] z-30" />
                    </div>

                    {/* 10. And More */}
                    <div
                        onMouseEnter={() => setActiveNode('more')}
                        onMouseLeave={() => setActiveNode(null)}
                        className={`absolute top-[511px] right-0 z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-cyan-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[205px] sm:w-[215px] xl:w-[225px] cursor-pointer group ${
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
                        {/* Hardware Cable Port Socket */}
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(45,212,191,0.8)] z-30" />
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

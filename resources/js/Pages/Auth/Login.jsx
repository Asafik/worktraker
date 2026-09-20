import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Checkbox from '@/Components/Checkbox';

const GoogleGeminiIcon = ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
            <linearGradient id="geminiGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B72E8" />
                <stop offset="50%" stopColor="#8AB4F8" />
                <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
        </defs>
        <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" fill="url(#geminiGradLogin)" />
    </svg>
);

export default function Login({ errors = {} }) {
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [activeNode, setActiveNode] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0); // 0: Fitur, 1: Integrasi
    const [isFading, setIsFading] = useState(false);
    const [slideKey, setSlideKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setActiveSlide((prev) => (prev === 0 ? 1 : 0));
                setSlideKey((k) => k + 1);
                setIsFading(false);
            }, 300);
        }, 10000);

        return () => clearInterval(interval);
    }, [slideKey]);

    const switchSlide = (targetIndex) => {
        if (targetIndex === activeSlide || isFading) return;
        setIsFading(true);
        setTimeout(() => {
            setActiveSlide(targetIndex);
            setSlideKey((k) => k + 1);
            setIsFading(false);
        }, 300);
    };

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
                    {/* Welcome & Gemini AI Badges */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                            Selamat Datang
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100/80 shadow-2xs">
                            <GoogleGeminiIcon className="w-3.5 h-3.5" />
                            <span>Gemini AI Ready</span>
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
                        Kelola proyek, tugas, dan produktivitas Anda didukung asisten cerdas Gemini AI.
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
                    <span className={`transition-colors ${activeSlide === 0 ? 'text-blue-400 font-semibold' : 'hover:text-slate-200'}`}>
                        {activeSlide === 0 ? 'Fitur WorkTrack' : 'Integrasi Ekosistem'}
                    </span>
                    <span>·</span>
                    <span className="text-slate-500">
                        {activeSlide === 0 ? '6 Layanan Terpadu' : 'GitHub, Drive, Calendar & Gemini'}
                    </span>
                    <span className="w-6 h-1 bg-blue-500 rounded-full ml-1" />
                </div>

                {/* Center Ecosystem Canvas (Interactive Dual Slide Showcase) */}
                <div className="relative w-full flex items-center justify-center my-auto overflow-hidden">
                    <div
                        className={`relative w-[1000px] h-[540px] select-none origin-center scale-[0.72] sm:scale-[0.80] xl:scale-[0.92] 2xl:scale-100 transition-all duration-400 ease-in-out ${
                            isFading ? 'opacity-0 scale-[0.94]' : 'opacity-100'
                        }`}
                    >
                        {activeSlide === 0 ? (
                            <SlideFeatures
                                key={`features-${slideKey}`}
                                activeNode={activeNode}
                                setActiveNode={setActiveNode}
                            />
                        ) : (
                            <SlideIntegrations
                                key={`integrations-${slideKey}`}
                                activeNode={activeNode}
                                setActiveNode={setActiveNode}
                            />
                        )}
                    </div>
                </div>

                {/* Bottom Footer Section on Dark Right */}
                <div className="text-center z-10 space-y-3 pt-4">
                    <div className="min-h-[64px] flex flex-col justify-center">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight transition-all duration-300">
                            {activeSlide === 0 ? (
                                <>
                                    Semua Pekerjaan,{' '}
                                    <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                                        Satu Tempat
                                    </span>
                                </>
                            ) : (
                                <>
                                    Terhubung dengan{' '}
                                    <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
                                        Alat Kerja Anda
                                    </span>
                                </>
                            )}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mt-1 transition-all duration-300">
                            {activeSlide === 0
                                ? 'Kelola proyek, tugas, catatan, kalender, portofolio, dan arsip tanpa perlu berpindah aplikasi.'
                                : 'Sinkronisasi repositori GitHub, Google Drive, Google Calendar, serta kecerdasan Google Gemini secara terpusat.'}
                        </p>
                    </div>

                    {/* Interactive Slide Indicator Pills */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => switchSlide(0)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeSlide === 0
                                    ? 'w-6 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] cursor-default'
                                    : 'w-2 bg-slate-700 hover:bg-slate-500 cursor-pointer'
                            }`}
                            title="Slide 1: Fitur WorkTrack"
                            aria-label="Slide 1: Fitur WorkTrack"
                        />
                        <button
                            type="button"
                            onClick={() => switchSlide(1)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeSlide === 1
                                    ? 'w-6 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] cursor-default'
                                    : 'w-2 bg-slate-700 hover:bg-slate-500 cursor-pointer'
                            }`}
                            title="Slide 2: Integrasi WorkTrack"
                            aria-label="Slide 2: Integrasi WorkTrack"
                        />
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

function SlideFeatures({ activeNode, setActiveNode }) {
    return (
        <div className="relative w-full h-full">
            {/* Keyframe Animations & Reduced Motion Rules */}
            <style>{`
                @keyframes wtFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .wt-fade-hub {
                    opacity: 0;
                    animation: wtFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
                }
                .wt-fade-f1 { opacity: 0; animation: wtFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.30s forwards; }
                .wt-fade-f2 { opacity: 0; animation: wtFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.18s forwards; }
                .wt-fade-f3 { opacity: 0; animation: wtFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.42s forwards; }
                .wt-fade-f4 { opacity: 0; animation: wtFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.30s forwards; }
                .wt-fade-f5 { opacity: 0; animation: wtFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.18s forwards; }
                .wt-fade-f6 { opacity: 0; animation: wtFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.42s forwards; }

                @media (prefers-reduced-motion: reduce) {
                    .wt-fade-hub,
                    .wt-fade-f1,
                    .wt-fade-f2,
                    .wt-fade-f3,
                    .wt-fade-f4,
                    .wt-fade-f5,
                    .wt-fade-f6 {
                        opacity: 1 !important;
                        animation: none !important;
                    }
                    .wt-mask-path {
                        stroke-dasharray: none !important;
                        stroke-dashoffset: 0 !important;
                    }
                    .wt-mask-path animate {
                        display: none !important;
                    }
                    .wt-particle {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Concentric Radar Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-blue-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-blue-400/15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[210px] rounded-full border border-cyan-400/25 pointer-events-none animate-pulse" />

            {/* SVG Cables (Highway Conduit Style: Outer Pipe + Dashed Center Line + Flowing Bead) */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 1000 540"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="photon-glow-f" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Mask elements to progressively reveal conduits & dashed lines from Cards to Hub */}
                    <mask id="mask-f1" maskUnits="userSpaceOnUse">
                        <path
                            d="M 240 88 C 310 88, 370 240, 460 240"
                            stroke="#ffffff"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray="600"
                            strokeDashoffset="600"
                            className="wt-mask-path"
                        >
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.75s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-f2" maskUnits="userSpaceOnUse">
                        <path
                            d="M 240 270 C 310 270, 380 270, 450 270"
                            stroke="#ffffff"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray="600"
                            strokeDashoffset="600"
                            className="wt-mask-path"
                        >
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.65s" begin="0.60s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-f3" maskUnits="userSpaceOnUse">
                        <path
                            d="M 240 452 C 310 452, 370 300, 460 300"
                            stroke="#ffffff"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray="600"
                            strokeDashoffset="600"
                            className="wt-mask-path"
                        >
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.90s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-f4" maskUnits="userSpaceOnUse">
                        <path
                            d="M 760 88 C 690 88, 630 240, 540 240"
                            stroke="#ffffff"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray="600"
                            strokeDashoffset="600"
                            className="wt-mask-path"
                        >
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.75s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-f5" maskUnits="userSpaceOnUse">
                        <path
                            d="M 760 270 C 690 270, 620 270, 550 270"
                            stroke="#ffffff"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray="600"
                            strokeDashoffset="600"
                            className="wt-mask-path"
                        >
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.65s" begin="0.60s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-f6" maskUnits="userSpaceOnUse">
                        <path
                            d="M 760 452 C 690 452, 630 300, 540 300"
                            stroke="#ffffff"
                            strokeWidth="22"
                            strokeLinecap="round"
                            strokeDasharray="600"
                            strokeDashoffset="600"
                            className="wt-mask-path"
                        >
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.90s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>

                    {/* Vibrant Neon Conduit Gradients */}
                    <linearGradient id="neon-f1" x1="240" y1="88" x2="460" y2="240" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0ea5e9" />
                        <stop offset="1" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="neon-f2" x1="240" y1="270" x2="450" y2="270" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#059669" />
                        <stop offset="1" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="neon-f3" x1="240" y1="452" x2="460" y2="300" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#7c3aed" />
                        <stop offset="1" stopColor="#a855f7" />
                    </linearGradient>

                    <linearGradient id="neon-f4" x1="760" y1="88" x2="540" y2="240" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2563eb" />
                        <stop offset="1" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="neon-f5" x1="760" y1="270" x2="550" y2="270" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4f46e5" />
                        <stop offset="1" stopColor="#818cf8" />
                    </linearGradient>
                    <linearGradient id="neon-f6" x1="760" y1="452" x2="540" y2="300" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0d9488" />
                        <stop offset="1" stopColor="#14b8a6" />
                    </linearGradient>
                </defs>

                {/* 1. Projects (Left Top -> Hub) */}
                <g>
                    <g mask="url(#mask-f1)">
                        <path
                            d="M 240 88 C 310 88, 370 240, 460 240"
                            stroke="url(#neon-f1)"
                            strokeWidth={activeNode === 'projects' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'projects' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 240 88 C 310 88, 370 240, 460 240"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle">
                        <circle r="9" fill="#38bdf8" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 240 88 C 310 88, 370 240, 460 240" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#38bdf8" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 240 88 C 310 88, 370 240, 460 240" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 240 88 C 310 88, 370 240, 460 240" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 2. Tasks (Left Middle -> Hub) */}
                <g>
                    <g mask="url(#mask-f2)">
                        <path
                            d="M 240 270 C 310 270, 380 270, 450 270"
                            stroke="url(#neon-f2)"
                            strokeWidth={activeNode === 'tasks' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'tasks' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 240 270 C 310 270, 380 270, 450 270"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle">
                        <circle r="9" fill="#10b981" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 240 270 C 310 270, 380 270, 450 270" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#34d399" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 240 270 C 310 270, 380 270, 450 270" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 240 270 C 310 270, 380 270, 450 270" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 3. Notes (Left Bottom -> Hub) */}
                <g>
                    <g mask="url(#mask-f3)">
                        <path
                            d="M 240 452 C 310 452, 370 300, 460 300"
                            stroke="url(#neon-f3)"
                            strokeWidth={activeNode === 'notes' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'notes' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 240 452 C 310 452, 370 300, 460 300"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle">
                        <circle r="9" fill="#a855f7" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 240 452 C 310 452, 370 300, 460 300" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#c084fc" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 240 452 C 310 452, 370 300, 460 300" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 240 452 C 310 452, 370 300, 460 300" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 4. Calendar (Right Top -> Hub) */}
                <g>
                    <g mask="url(#mask-f4)">
                        <path
                            d="M 760 88 C 690 88, 630 240, 540 240"
                            stroke="url(#neon-f4)"
                            strokeWidth={activeNode === 'calendar' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'calendar' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 760 88 C 690 88, 630 240, 540 240"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle">
                        <circle r="9" fill="#38bdf8" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 760 88 C 690 88, 630 240, 540 240" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#60a5fa" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 760 88 C 690 88, 630 240, 540 240" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 760 88 C 690 88, 630 240, 540 240" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.5s" begin="1.45s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 5. Portfolio (Right Middle -> Hub) */}
                <g>
                    <g mask="url(#mask-f5)">
                        <path
                            d="M 760 270 C 690 270, 620 270, 550 270"
                            stroke="url(#neon-f5)"
                            strokeWidth={activeNode === 'portfolio' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'portfolio' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 760 270 C 690 270, 620 270, 550 270"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle">
                        <circle r="9" fill="#818cf8" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 760 270 C 690 270, 620 270, 550 270" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#a5b4fc" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 760 270 C 690 270, 620 270, 550 270" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 760 270 C 690 270, 620 270, 550 270" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.25s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 6. Archive (Right Bottom -> Hub) */}
                <g>
                    <g mask="url(#mask-f6)">
                        <path
                            d="M 760 452 C 690 452, 630 300, 540 300"
                            stroke="url(#neon-f6)"
                            strokeWidth={activeNode === 'archive' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'archive' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 760 452 C 690 452, 630 300, 540 300"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle">
                        <circle r="9" fill="#06b6d4" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 760 452 C 690 452, 630 300, 540 300" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#2dd4bf" opacity="0" filter="url(#photon-glow-f)">
                            <animateMotion path="M 760 452 C 690 452, 630 300, 540 300" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 760 452 C 690 452, 630 300, 540 300" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.6s" begin="1.65s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>
            </svg>

            {/* Center WorkTrack Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center wt-fade-hub">
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-b from-[#0e1f4d] via-[#091433] to-[#060c20] border-2 border-blue-400/60 shadow-[0_0_45px_rgba(59,130,246,0.6)] flex flex-col items-center justify-center relative group hover:scale-105 transition-all duration-300 cursor-pointer p-3">
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

            {/* 6 Connected Feature Cards */}
            {/* 1. Projects */}
            <div
                onMouseEnter={() => setActiveNode('projects')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[60px] left-[30px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[210px] cursor-pointer group wt-fade-f1 ${
                    activeNode === 'projects' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                }`}
            >
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(59,130,246,0.8)] z-30" />
            </div>

            {/* 2. Tasks */}
            <div
                onMouseEnter={() => setActiveNode('tasks')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[242px] left-[30px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-emerald-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[210px] cursor-pointer group wt-fade-f2 ${
                    activeNode === 'tasks' ? 'scale-103 border-emerald-400 shadow-emerald-500/20' : ''
                }`}
            >
                <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(16,185,129,0.8)] z-30" />
            </div>

            {/* 3. Notes */}
            <div
                onMouseEnter={() => setActiveNode('notes')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[424px] left-[30px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-purple-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[210px] cursor-pointer group wt-fade-f3 ${
                    activeNode === 'notes' ? 'scale-103 border-purple-400 shadow-purple-500/20' : ''
                }`}
            >
                <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(168,85,247,0.8)] z-30" />
            </div>

            {/* 4. Calendar (Native WorkTrack) */}
            <div
                onMouseEnter={() => setActiveNode('calendar')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[60px] right-[30px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[210px] cursor-pointer group wt-fade-f4 ${
                    activeNode === 'calendar' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                }`}
            >
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CalendarIcon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-tight truncate">
                        Calendar
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                        Schedule & deadlines
                    </p>
                </div>
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(59,130,246,0.8)] z-30" />
            </div>

            {/* 5. Portfolio */}
            <div
                onMouseEnter={() => setActiveNode('portfolio')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[242px] right-[30px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[210px] cursor-pointer group wt-fade-f5 ${
                    activeNode === 'portfolio' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                }`}
            >
                <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-[#060b19] shadow-[0_0_8px_rgba(59,130,246,0.8)] z-30" />
            </div>

            {/* 6. Archive */}
            <div
                onMouseEnter={() => setActiveNode('archive')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[424px] right-[30px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-blue-900/50 hover:border-cyan-400/60 shadow-lg shadow-black/40 transition-all duration-200 flex items-center gap-3 w-[210px] cursor-pointer group wt-fade-f6 ${
                    activeNode === 'archive' ? 'scale-103 border-cyan-400 shadow-cyan-500/20' : ''
                }`}
            >
                <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
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
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(6,182,212,0.8)] z-30" />
            </div>
        </div>
    );
}

function SlideIntegrations({ activeNode, setActiveNode }) {
    return (
        <div className="relative w-full h-full">
            {/* Keyframe Animations & Reduced Motion Rules */}
            <style>{`
                @keyframes wtFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .wt-fade-hub-int {
                    opacity: 0;
                    animation: wtFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
                }
                .wt-fade-card-int {
                    opacity: 0;
                    animation: wtFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.22s forwards;
                }
                .wt-fade-badge-int {
                    opacity: 0;
                    animation: wtFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.40s forwards;
                }

                @media (prefers-reduced-motion: reduce) {
                    .wt-fade-hub-int,
                    .wt-fade-card-int,
                    .wt-fade-badge-int {
                        opacity: 1 !important;
                        animation: none !important;
                    }
                    .wt-mask-path-int {
                        stroke-dasharray: none !important;
                        stroke-dashoffset: 0 !important;
                    }
                    .wt-mask-path-int animate {
                        display: none !important;
                    }
                    .wt-particle-int {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Concentric Radar Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-blue-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-indigo-400/15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[210px] rounded-full border border-cyan-400/25 pointer-events-none animate-pulse" />

            {/* Decorative Top & Bottom Data Stream Badges */}
            <div className="absolute top-[22px] left-1/2 -translate-x-1/2 z-20 wt-fade-badge-int pointer-events-none select-none">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1838]/85 border border-blue-500/30 backdrop-blur-md shadow-lg text-[11px] text-blue-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span className="font-semibold tracking-wide">Git Sync & Gemini AI · Automated Commits & Smart Analysis</span>
                </div>
            </div>

            <div className="absolute bottom-[22px] left-1/2 -translate-x-1/2 z-20 wt-fade-badge-int pointer-events-none select-none">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1838]/85 border border-indigo-500/30 backdrop-blur-md shadow-lg text-[11px] text-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    <span className="font-semibold tracking-wide">Cloud Storage & Calendar · 256-bit Encrypted Schedule Sync</span>
                </div>
            </div>

            {/* SVG Data Pipelines (Highway Conduit Style: Outer Pipe + Dashed Center Line + Flowing Bead) */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 1000 540"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="photon-glow-int" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Progressive Reveal Masks */}
                    <mask id="mask-int-github" maskUnits="userSpaceOnUse">
                        <path d="M 265 116 C 345 116, 385 245, 460 245" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" strokeDasharray="600" strokeDashoffset="600" className="wt-mask-path-int">
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.65s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-int-gemini" maskUnits="userSpaceOnUse">
                        <path d="M 265 424 C 345 424, 385 295, 460 295" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" strokeDasharray="600" strokeDashoffset="600" className="wt-mask-path-int">
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.85s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-int-calendar" maskUnits="userSpaceOnUse">
                        <path d="M 735 116 C 655 116, 615 245, 540 245" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" strokeDasharray="600" strokeDashoffset="600" className="wt-mask-path-int">
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.65s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>
                    <mask id="mask-int-drive" maskUnits="userSpaceOnUse">
                        <path d="M 735 424 C 655 424, 615 295, 540 295" stroke="#ffffff" strokeWidth="24" strokeLinecap="round" strokeDasharray="600" strokeDashoffset="600" className="wt-mask-path-int">
                            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="0.75s" begin="0.85s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1" />
                        </path>
                    </mask>

                    {/* Conduit Gradients */}
                    <linearGradient id="neon-int-github" x1="265" y1="116" x2="460" y2="245" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#818cf8" />
                        <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="neon-int-gemini" x1="265" y1="424" x2="460" y2="295" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1B72E8" />
                        <stop offset="0.5" stopColor="#8AB4F8" />
                        <stop offset="1" stopColor="#D96570" />
                    </linearGradient>
                    <linearGradient id="neon-int-calendar" x1="735" y1="116" x2="540" y2="245" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4285F4" />
                        <stop offset="1" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="neon-int-drive" x1="735" y1="424" x2="540" y2="295" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#10b981" />
                        <stop offset="0.6" stopColor="#facc15" />
                        <stop offset="1" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* 1. GitHub Pipeline (Top-Left -> Hub) */}
                <g>
                    <g mask="url(#mask-int-github)">
                        <path
                            d="M 265 116 C 345 116, 385 245, 460 245"
                            stroke="url(#neon-int-github)"
                            strokeWidth={activeNode === 'github' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'github' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 265 116 C 345 116, 385 245, 460 245"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle-int">
                        <circle r="9" fill="#818cf8" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 265 116 C 345 116, 385 245, 460 245" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#818cf8" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 265 116 C 345 116, 385 245, 460 245" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 265 116 C 345 116, 385 245, 460 245" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 2. Google Gemini Pipeline (Bottom-Left -> Hub) */}
                <g>
                    <g mask="url(#mask-int-gemini)">
                        <path
                            d="M 265 424 C 345 424, 385 295, 460 295"
                            stroke="url(#neon-int-gemini)"
                            strokeWidth={activeNode === 'gemini' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'gemini' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 265 424 C 345 424, 385 295, 460 295"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle-int">
                        <circle r="9" fill="#D96570" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 265 424 C 345 424, 385 295, 460 295" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#f472b6" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 265 424 C 345 424, 385 295, 460 295" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 265 424 C 345 424, 385 295, 460 295" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 3. Google Calendar Pipeline (Top-Right -> Hub) */}
                <g>
                    <g mask="url(#mask-int-calendar)">
                        <path
                            d="M 735 116 C 655 116, 615 245, 540 245"
                            stroke="url(#neon-int-calendar)"
                            strokeWidth={activeNode === 'calendar' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'calendar' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 735 116 C 655 116, 615 245, 540 245"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle-int">
                        <circle r="9" fill="#4285F4" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 735 116 C 655 116, 615 245, 540 245" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#38bdf8" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 735 116 C 655 116, 615 245, 540 245" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 735 116 C 655 116, 615 245, 540 245" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.35s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>

                {/* 4. Google Drive Pipeline (Bottom-Right -> Hub) */}
                <g>
                    <g mask="url(#mask-int-drive)">
                        <path
                            d="M 735 424 C 655 424, 615 295, 540 295"
                            stroke="url(#neon-int-drive)"
                            strokeWidth={activeNode === 'drive' ? '11.5' : '9.5'}
                            strokeOpacity={activeNode === 'drive' ? '1' : '0.85'}
                            strokeLinecap="round"
                            className="transition-[stroke-width,stroke-opacity] duration-200"
                        />
                        <path
                            d="M 735 424 C 655 424, 615 295, 540 295"
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            strokeDasharray="5 6"
                            strokeOpacity="0.9"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className="wt-particle-int">
                        <circle r="9" fill="#10b981" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 735 424 C 655 424, 615 295, 540 295" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.5;0.5;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                        </circle>
                        <circle r="5.5" fill="#34d399" opacity="0" filter="url(#photon-glow-int)">
                            <animateMotion path="M 735 424 C 655 424, 615 295, 540 295" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;0.95;0.95;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2.5" fill="#ffffff" opacity="0">
                            <animateMotion path="M 735 424 C 655 424, 615 295, 540 295" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="3.2s" begin="1.55s" repeatCount="indefinite" />
                        </circle>
                    </g>
                </g>
            </svg>

            {/* Center WorkTrack Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center wt-fade-hub-int">
                <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-b from-[#0e1f4d] via-[#091433] to-[#060c20] border-2 border-blue-400/60 shadow-[0_0_45px_rgba(59,130,246,0.6)] flex flex-col items-center justify-center relative group hover:scale-105 transition-all duration-300 cursor-pointer p-3">
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

            {/* 1. GitHub Card (Top-Left) */}
            <div
                onMouseEnter={() => setActiveNode('github')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[82px] left-[35px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-2xl p-3 px-3.5 border border-blue-900/50 hover:border-slate-300/60 shadow-xl shadow-black/50 transition-all duration-200 flex items-center gap-3 w-[230px] cursor-pointer group wt-fade-card-int ${
                    activeNode === 'github' ? 'scale-103 border-slate-300 shadow-slate-500/20' : ''
                }`}
            >
                <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-slate-200 transition-colors leading-tight truncate">
                            GitHub
                        </h3>
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                            Sync
                        </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                        Code repository & PRs
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>2-way pipeline active</span>
                    </div>
                </div>
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-indigo-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(129,140,248,0.8)] z-30" />
            </div>

            {/* 2. Google Gemini Card (Bottom-Left) */}
            <div
                onMouseEnter={() => setActiveNode('gemini')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute bottom-[82px] left-[35px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-2xl p-3 px-3.5 border border-blue-900/50 hover:border-pink-400/60 shadow-xl shadow-black/50 transition-all duration-200 flex items-center gap-3 w-[230px] cursor-pointer group wt-fade-card-int ${
                    activeNode === 'gemini' ? 'scale-103 border-pink-400 shadow-pink-500/20' : ''
                }`}
            >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-md">
                    <GoogleGeminiIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-300 transition-colors leading-tight truncate">
                            Google Gemini
                        </h3>
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-pink-500/20 text-pink-300 border border-pink-400/30 shrink-0">
                            AI
                        </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                        Smart AI insights & assistant
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-pink-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                        <span>Gemini 2.5 active</span>
                    </div>
                </div>
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-pink-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(244,114,182,0.8)] z-30" />
            </div>

            {/* 3. Google Calendar Card (Top-Right) */}
            <div
                onMouseEnter={() => setActiveNode('calendar')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-[82px] right-[35px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-2xl p-3 px-3.5 border border-blue-900/50 hover:border-blue-400/60 shadow-xl shadow-black/50 transition-all duration-200 flex items-center gap-3 w-[230px] cursor-pointer group wt-fade-card-int ${
                    activeNode === 'calendar' ? 'scale-103 border-blue-400 shadow-blue-500/20' : ''
                }`}
            >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-700/60 flex items-center justify-center shrink-0 shadow-md">
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
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
                            Sync
                        </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                        Events & deadline sync
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-cyan-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span>Real-time schedule sync</span>
                    </div>
                </div>
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(56,189,248,0.8)] z-30" />
            </div>

            {/* 4. Google Drive Card (Bottom-Right) */}
            <div
                onMouseEnter={() => setActiveNode('drive')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute bottom-[82px] right-[35px] z-20 bg-[#0d1838]/95 hover:bg-[#122250] backdrop-blur-md rounded-2xl p-3 px-3.5 border border-blue-900/50 hover:border-yellow-400/60 shadow-xl shadow-black/50 transition-all duration-200 flex items-center gap-3 w-[230px] cursor-pointer group wt-fade-card-int ${
                    activeNode === 'drive' ? 'scale-103 border-yellow-400 shadow-yellow-500/20' : ''
                }`}
            >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M7.74 3.5h8.52l4.98 8.64H12.72L7.74 3.5z" fill="#FFC107" />
                        <path d="M12.72 12.14l-4.98 8.64H2.76l4.98-8.64h4.98z" fill="#0066DA" />
                        <path d="M21.24 12.14l-4.98 8.64H7.74l4.98-8.64h8.52z" fill="#00AC47" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-yellow-300 transition-colors leading-tight truncate">
                            Google Drive
                        </h3>
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-sm bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 shrink-0">
                            Cloud
                        </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                        Files, docs & assets
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Cloud backup active</span>
                    </div>
                </div>
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#060b19] shadow-[0_0_8px_rgba(16,185,129,0.8)] z-30" />
            </div>
        </div>
    );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({
    show = false,
    isShow,
    message = 'Memproses data...',
    description = '',
    fullScreen = false,
    className = '',
    blur = true,
    progress = null,
    subInfo = '',
    children,
}) {
    const visible = isShow !== undefined ? isShow : show;

    if (!visible) return null;

    if (fullScreen) {
        return (
            <div
                className="fixed inset-0 z-[70] bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 transition-all animate-in fade-in"
                role="status"
                aria-live="polite"
            >
                <div className={`relative bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#1e346e] rounded-2xl shadow-2xl p-6 sm:p-7 max-w-md w-full mx-auto flex flex-col items-center text-center ${className}`}>
                    {children ? children : (
                        <>
                    {/* Centered spinner badge */}
                    <div className="relative mb-4 flex items-center justify-center">
                        <div className="absolute w-14 h-14 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-md animate-pulse pointer-events-none" />
                        <div className="relative w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#132761] border border-blue-100 dark:border-blue-800/60 flex items-center justify-center shadow-xs">
                            <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                    </div>

                    {/* Message / Title */}
                    {message && (
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {message}
                        </h4>
                    )}

                    {/* Description */}
                    {description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-sm">
                            {description}
                        </p>
                    )}

                    {/* Progress Bar & Details or Pulse Track */}
                    {progress !== null && progress !== undefined ? (
                        <div className="w-full mt-5 space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-600 dark:text-slate-300 font-mono">
                                    {subInfo || 'Mengunggah...'}
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-[#152759] h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-800">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-150 ease-out shadow-xs"
                                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-slate-100 dark:bg-[#152759] h-1.5 rounded-full mt-5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" />
                        </div>
                    )}
                    </>
                    )}
                </div>
            </div>
        );
    }

    // In-card / local overlay (e.g. AI refine inside Note Editor)
    const backdropClass = blur ? 'backdrop-blur-xs' : '';
    return (
        <div
            className={`absolute inset-0 z-40 rounded-lg bg-white/80 dark:bg-[#0b1739]/85 ${backdropClass} flex flex-col items-center justify-center p-4 transition-all ${className}`}
            role="status"
            aria-live="polite"
        >
            <div className="bg-white/90 dark:bg-[#0e1d47]/90 border border-slate-200/80 dark:border-[#1e346e]/80 rounded-xl shadow-lg p-5 max-w-xs w-full flex flex-col items-center text-center">
                <div className="relative mb-3 flex items-center justify-center">
                    <div className="absolute w-12 h-12 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-sm animate-pulse pointer-events-none" />
                    <div className="relative w-10 h-10 rounded-lg bg-blue-50 dark:bg-[#132761] border border-blue-100 dark:border-blue-800/60 flex items-center justify-center shadow-xs">
                        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                </div>

                {message && (
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {message}
                    </span>
                )}

                {description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

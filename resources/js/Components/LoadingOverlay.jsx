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
}) {
    const visible = isShow !== undefined ? isShow : show;

    if (!visible) return null;

    if (fullScreen) {
        return (
            <div
                className="fixed inset-0 z-[70] bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
                role="status"
                aria-live="polite"
            >
                <div className="relative bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#1e346e] rounded-2xl shadow-2xl p-6 sm:p-7 max-w-sm w-full mx-auto flex flex-col items-center text-center">
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
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-xs">
                            {description}
                        </p>
                    )}

                    {/* Progress pulse track */}
                    <div className="w-full bg-slate-100 dark:bg-[#152759] h-1.5 rounded-full mt-5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" />
                    </div>
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

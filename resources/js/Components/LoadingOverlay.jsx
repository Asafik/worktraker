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

    const positionClass = fullScreen ? 'fixed inset-0 z-[60]' : 'absolute inset-0 z-40 rounded-lg';
    const backdropClass = blur ? 'backdrop-blur-xs' : '';

    return (
        <div
            className={`${positionClass} bg-white/75 dark:bg-[#0b1739]/80 ${backdropClass} flex flex-col items-center justify-center p-4 transition-all animate-fadeIn ${className}`}
            role="status"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-3 max-w-xs text-center">
                <div className="relative flex items-center justify-center">
                    {/* Pulsing glow background */}
                    <div className="absolute w-10 h-10 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-ping pointer-events-none" />
                    {/* Animated spinner */}
                    <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>

                {message && (
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                        {message}
                    </span>
                )}

                {description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

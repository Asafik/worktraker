import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
    isOpen = false,
    onClose = () => {},
    title,
    description,
    icon: Icon,
    maxWidth = 'lg',
    children,
    footer,
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    backdropClassName = 'bg-black/40 backdrop-blur-sm',
}) {
    // Close on Escape key press
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeOnEscape, onClose]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Max-width mapping
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-full',
    };

    const widthClass = maxWidthClasses[maxWidth] || maxWidth;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${backdropClassName} transition-all animate-fadeIn`}
            onClick={closeOnOverlayClick ? onClose : undefined}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`relative bg-white dark:bg-[#0e1d47] border border-slate-200 dark:border-[#1e346e] rounded-xl shadow-2xl ${widthClass} w-full overflow-hidden flex flex-col max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1b2b5a] shrink-0">
                        <div className="flex-1 pr-3">
                            {title && (
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {Icon && <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}
                                    <span>{title}</span>
                                </h3>
                            )}
                            {description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {description}
                                </p>
                            )}
                        </div>

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                                aria-label="Tutup Modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Modal Content Body */}
                <div className="overflow-y-auto flex-1 p-6">
                    {children}
                </div>

                {/* Optional Modal Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-slate-100 dark:border-[#1b2b5a] bg-slate-50/50 dark:bg-[#0b1739] shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

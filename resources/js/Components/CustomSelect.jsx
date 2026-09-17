import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Pilih opsi...',
    className = '',
    disabled = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Normalize options format: support either array of strings or array of { value, label }
    const normalizedOptions = options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
            return {
                value: opt.value,
                label: opt.label ?? String(opt.value),
                icon: opt.icon,
                desc: opt.desc,
            };
        }
        return { value: opt, label: String(opt) };
    });

    const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle keyboard accessibility
    function handleKeyDown(e) {
        if (disabled) return;
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        }
    }

    return (
        <div ref={dropdownRef} className={`relative select-none ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                onKeyDown={handleKeyDown}
                className={`w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between gap-2 text-left transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isOpen
                        ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'hover:border-slate-300 dark:hover:border-[#3353a8]'
                }`}
            >
                <span className="truncate font-medium">
                    {selectedOption ? selectedOption.label : (
                        <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
                    )}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-500' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu Popup */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#0e1d47] border border-slate-200/90 dark:border-[#1e346e] rounded-lg shadow-xl shadow-slate-900/10 dark:shadow-black/40 py-1 max-h-60 overflow-y-auto focus:outline-none">
                    {normalizedOptions.map((opt) => {
                        const isSelected = String(opt.value) === String(value);
                        return (
                            <button
                                key={String(opt.value)}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                                    isSelected
                                        ? 'bg-blue-50 dark:bg-[#182b63] text-blue-600 dark:text-blue-400 font-semibold'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#132354]'
                                }`}
                            >
                                <span className="truncate">{opt.label}</span>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import React from 'react';
import { Switch } from '@headlessui/react';

export default function Toggle({
    checked = false,
    onChange,
    disabled = false,
    size = 'md',
    className = '',
    ariaLabel,
}) {
    // Dimension configurations based on size
    const sizeConfig = {
        sm: {
            track: 'w-8 h-4.5 p-0.5',
            thumb: 'w-3.5 h-3.5',
            translate: 'translate-x-3.5',
        },
        md: {
            track: 'w-11 h-6 p-0.5',
            thumb: 'w-5 h-5',
            translate: 'translate-x-5',
        },
        lg: {
            track: 'w-14 h-7.5 p-1',
            thumb: 'w-5.5 h-5.5',
            translate: 'translate-x-6.5',
        },
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;

    return (
        <Switch
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`group relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 dark:focus:ring-offset-[#0b1739] disabled:opacity-40 disabled:cursor-not-allowed ${
                currentSize.track
            } ${
                checked
                    ? 'bg-blue-600 dark:bg-blue-600'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
            } ${className}`}
        >
            <span
                className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    currentSize.thumb
                } ${checked ? currentSize.translate : 'translate-x-0'}`}
            />
        </Switch>
    );
}

import React from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';
import { Check } from 'lucide-react';

export default function Checkbox({
    checked = false,
    onChange,
    disabled = false,
    label,
    description,
    children,
    size = 'md', // 'sm', 'md', 'lg'
    className = '',
    id,
    name,
}) {
    const sizeConfig = {
        sm: {
            box: 'w-4 h-4 rounded',
            icon: 'w-2.5 h-2.5 stroke-[3]',
        },
        md: {
            box: 'w-5 h-5 rounded-md',
            icon: 'w-3.5 h-3.5 stroke-[3]',
        },
        lg: {
            box: 'w-6 h-6 rounded-lg',
            icon: 'w-4 h-4 stroke-[3]',
        },
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;

    const handleChange = (newVal) => {
        if (typeof onChange === 'function') {
            onChange(newVal);
        }
    };

    const checkboxBox = (
        <HeadlessCheckbox
            checked={Boolean(checked)}
            onChange={handleChange}
            disabled={disabled}
            name={name}
            id={id}
            className={`group relative flex shrink-0 items-center justify-center border transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-[#0b1739] disabled:opacity-40 disabled:cursor-not-allowed ${
                currentSize.box
            } ${
                checked
                    ? 'bg-blue-600 border-blue-600 dark:bg-blue-600 dark:border-blue-600 shadow-xs shadow-blue-500/30'
                    : 'bg-white dark:bg-[#0a1533] border-slate-300 dark:border-[#243e80] hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-[#122352]'
            } ${className}`}
        >
            <Check
                className={`${currentSize.icon} text-white transition-all duration-150 ease-out ${
                    checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
            />
        </HeadlessCheckbox>
    );

    // If no label, description, or children: return standalone checkbox box
    if (!label && !description && !children) {
        return checkboxBox;
    }

    return (
        <div
            onClick={() => {
                if (!disabled) handleChange(!checked);
            }}
            className="flex items-start gap-3 cursor-pointer select-none group/cb"
        >
            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                {checkboxBox}
            </div>

            {children ? (
                <div className="flex-1">{children}</div>
            ) : (
                <div className="space-y-0.5 flex-1">
                    {label && (
                        <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover/cb:text-blue-600 dark:group-hover/cb:text-blue-400 transition-colors">
                            {label}
                        </div>
                    )}
                    {description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {description}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

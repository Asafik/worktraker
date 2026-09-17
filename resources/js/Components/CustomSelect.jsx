import React from 'react';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Pilih opsi...',
    className = '',
    disabled = false,
}) {
    // Normalize options format: support array of { value, label } or array of strings
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

    const selectedOption = normalizedOptions.find(
        (opt) => String(opt.value) === String(value)
    );

    return (
        <div className={`relative select-none ${className}`}>
            <Listbox value={value} onChange={onChange} disabled={disabled}>
                {({ open }) => (
                    <>
                        <ListboxButton
                            className={`w-full bg-[#f8fafc] dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between gap-2 text-left transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${
                                open
                                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                                    : 'hover:border-slate-300 dark:hover:border-[#3353a8]'
                            }`}
                        >
                            <span className="truncate font-medium">
                                {selectedOption ? (
                                    selectedOption.label
                                ) : (
                                    <span className="text-slate-400 dark:text-slate-500">
                                        {placeholder}
                                    </span>
                                )}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 text-slate-400 dark:text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                                    open ? 'rotate-180 text-blue-500' : ''
                                }`}
                            />
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#0e1d47] border border-slate-200/90 dark:border-[#1e346e] rounded-lg shadow-xl shadow-slate-900/10 dark:shadow-black/40 py-1 max-h-60 overflow-y-auto focus:outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            {normalizedOptions.map((opt) => (
                                <ListboxOption
                                    key={String(opt.value)}
                                    value={opt.value}
                                    className="group flex cursor-pointer select-none items-center justify-between gap-3 px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors data-[focus]:bg-slate-50 dark:data-[focus]:bg-[#132354] data-[selected]:bg-blue-50 dark:data-[selected]:bg-[#182b63] data-[selected]:text-blue-600 dark:data-[selected]:text-blue-400 data-[selected]:font-semibold"
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className="truncate">{opt.label}</span>
                                            {selected && (
                                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </>
                )}
            </Listbox>
        </div>
    );
}

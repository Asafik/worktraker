import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Inbox,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
} from 'lucide-react';
import CustomSelect from '@/Components/CustomSelect';

/**
 * Reusable DataTables-styled Table Component with responsive child row accordion,
 * multi-column sorting, pagination, and search filter.
 *
 * @param {Array} data - The array of row data
 * @param {Array} columns - TanStack column definitions
 * @param {Function} renderExpandedRow - Function ({ row, item }) => JSX for expanded sub-row
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {string} initialSearch - Initial search string
 * @param {number} defaultPageSize - Default items per page (default: 10)
 * @param {Array} pageSizeOptions - Available page size choices (default: [10, 25, 50, 100])
 * @param {string} emptyTitle - Title when data is empty
 * @param {string} emptyMessage - Subtitle when data is empty
 * @param {React.ReactNode} emptyAction - Optional button/link in empty state
 * @param {React.ReactNode} filterSlot - Optional filter components displayed in header bar
 * @param {boolean} showSearch - Whether to display search bar (default: true)
 * @param {boolean} showPageSize - Whether to display items-per-page dropdown (default: true)
 * @param {string} expandBreakpoint - Tailwind breakpoint where (+) toggle is hidden (default: '2xl:hidden')
 * @param {string} wrapperClassName - Custom class for table outer wrapper
 */
export default function DataTable({
    data = [],
    columns = [],
    renderExpandedRow = null,
    searchPlaceholder = 'Search records...',
    initialSearch = '',
    defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    emptyTitle = 'No records found',
    emptyMessage = 'There are no items matching your criteria.',
    emptyAction = null,
    emptyIcon: EmptyIcon = Inbox,
    filterSlot = null,
    showSearch = true,
    showPageSize = true,
    expandBreakpoint = '2xl:hidden',
    wrapperClassName = '',
    rowIdKey = 'id',
    onRowClick = null,
    selectedRowId = null,
    cardMode = true,
    totalLabel = 'results',
}) {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(initialSearch);
    const [expandedRows, setExpandedRows] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    const toggleRowExpand = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const pageSizeSelectOptions = useMemo(() => {
        return pageSizeOptions.map((sz) => ({
            value: sz,
            label: `${sz} per page`,
        }));
    }, [pageSizeOptions]);

    const totalRows = table.getFilteredRowModel().rows.length;
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    const currentSize = table.getState().pagination.pageSize;

    const fromItem = totalRows > 0 ? currentPage * currentSize + 1 : 0;
    const toItem = totalRows > 0 ? Math.min((currentPage + 1) * currentSize, totalRows) : 0;

    const cardWrapperClass = cardMode
        ? `bg-white dark:bg-[#0e1d47] rounded-lg border border-slate-200/80 dark:border-[#1e346e] shadow-xs overflow-hidden ${wrapperClassName}`
        : `space-y-4 ${wrapperClassName}`;

    return (
        <div className={cardWrapperClass}>
            {/* Top Toolbar: Search, Filters & Page Size */}
            {(showSearch || filterSlot || showPageSize) && (
                <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardMode ? 'border-b border-slate-100 dark:border-slate-800/80' : ''}`}>
                    <div className="flex items-center gap-3 flex-wrap flex-1">
                        {showSearch && (
                            <div className="relative min-w-[200px] max-w-sm flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={globalFilter ?? ''}
                                    onChange={(e) => {
                                        setGlobalFilter(e.target.value);
                                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                                    }}
                                    placeholder={searchPlaceholder}
                                    className="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-slate-50 dark:bg-[#122352] border border-slate-200 dark:border-[#243e80] rounded-md text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
                                />
                                {globalFilter && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGlobalFilter('');
                                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                                        }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                                        title="Clear search"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}
                        {filterSlot}
                    </div>

                    {showPageSize && (
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Show:
                            </span>
                            <div className="w-28 sm:w-32">
                                <CustomSelect
                                    value={currentSize}
                                    onChange={(newSize) => {
                                        table.setPageSize(Number(newSize));
                                    }}
                                    options={pageSizeSelectOptions}
                                    buttonClassName="!py-1.5 !px-2.5 !text-xs font-semibold"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Table Container */}
            <div className={cardMode ? '' : 'bg-white dark:bg-[#0c183b] rounded-xl border border-slate-200/80 dark:border-[#1c2e5c] shadow-xs overflow-hidden'}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead className="bg-[#f8fafc] dark:bg-[#0c183b] text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {renderExpandedRow && (
                                        <th className={`w-1 whitespace-nowrap pl-3 pr-1 py-3.5 text-center ${expandBreakpoint}`}></th>
                                    )}
                                    {headerGroup.headers.map((header) => {
                                        const meta = header.column.columnDef.meta || {};
                                        const headerResponsiveClass = meta.responsiveClass || '';
                                        const isSortable = header.column.getCanSort();
                                        const hasCustomPadding = meta.headerClassName && /\b(px-|pl-|pr-|p-)\S+/.test(meta.headerClassName);
                                        const paddingClass = hasCustomPadding ? '' : 'px-3 sm:px-4';

                                        return (
                                            <th
                                                key={header.id}
                                                className={`py-3.5 ${paddingClass} ${headerResponsiveClass} ${
                                                    meta.headerClassName || ''
                                                }`}
                                            >
                                                {header.isPlaceholder ? null : isSortable ? (
                                                    <button
                                                        type="button"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer select-none transition-colors"
                                                    >
                                                        <span>
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        </span>
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                                                        ) : (
                                                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                                                        )}
                                                    </button>
                                                ) : (
                                                    flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (renderExpandedRow ? 1 : 0)}
                                        className="py-14 text-center text-slate-400 dark:text-slate-500"
                                    >
                                        <EmptyIcon className="w-10 h-10 mx-auto stroke-[1.5] text-slate-300 dark:text-slate-600 mb-2" />
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {emptyTitle}
                                        </p>
                                        <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                                            {emptyMessage}
                                        </p>
                                        {emptyAction && <div className="mt-4">{emptyAction}</div>}
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => {
                                    const item = row.original;
                                    const rowId = item[rowIdKey] ?? row.id;
                                    const isExpanded = !!expandedRows[rowId];
                                    const isSelected = selectedRowId !== null && selectedRowId !== undefined && item[rowIdKey] === selectedRowId;

                                    return (
                                        <React.Fragment key={row.id}>
                                            <tr
                                                onClick={(e) => {
                                                    if (onRowClick) onRowClick(item, row, e);
                                                }}
                                                className={`transition-colors group ${
                                                    onRowClick ? 'cursor-pointer' : ''
                                                } ${
                                                    isSelected
                                                        ? 'bg-blue-50/40 dark:bg-blue-950/20'
                                                        : isExpanded
                                                        ? 'bg-blue-50/25 dark:bg-[#122352]/25'
                                                        : 'hover:bg-slate-50/70 dark:hover:bg-[#122352]/40'
                                                }`}
                                            >
                                                {/* Expand / Collapse Control Button */}
                                                {renderExpandedRow && (
                                                    <td
                                                        className={`w-1 whitespace-nowrap pl-3 pr-1 py-3.5 text-center align-middle shrink-0 ${expandBreakpoint}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRowExpand(rowId);
                                                            }}
                                                            className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-bold text-xs transition-all shadow-xs cursor-pointer ${
                                                                isExpanded
                                                                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                                                    : 'bg-[#2952e3] hover:bg-blue-700 text-white'
                                                            }`}
                                                            title={isExpanded ? 'Collapse row' : 'Expand row details'}
                                                        >
                                                            {isExpanded ? '−' : '+'}
                                                        </button>
                                                    </td>
                                                )}

                                                {row.getVisibleCells().map((cell) => {
                                                    const meta = cell.column.columnDef.meta || {};
                                                    const cellResponsiveClass = meta.responsiveClass || '';
                                                    const hasCustomCellPadding = meta.cellClassName && /\b(px-|pl-|pr-|p-)\S+/.test(meta.cellClassName);
                                                    const cellPaddingClass = hasCustomCellPadding ? '' : 'px-3 sm:px-4';

                                                    return (
                                                        <td
                                                            key={cell.id}
                                                            className={`py-3.5 ${cellPaddingClass} ${cellResponsiveClass} ${
                                                                meta.cellClassName || ''
                                                            }`}
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>

                                            {/* Expandable Child Row */}
                                            {renderExpandedRow && isExpanded && (
                                                <tr className={`bg-slate-50/90 dark:bg-[#0a1533] border-b border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-150 ${expandBreakpoint}`}>
                                                    <td
                                                        colSpan={columns.length + 1}
                                                        className="p-3.5 pl-4 sm:pl-10 text-xs"
                                                    >
                                                        {renderExpandedRow({
                                                            row,
                                                            item,
                                                            isExpanded,
                                                            toggleExpand: () => toggleRowExpand(rowId),
                                                        })}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Bottom Pagination & Results Info */}
                <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <div>
                        {totalRows > 0 ? (
                            <span>
                                Showing{' '}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {fromItem}
                                </span>{' '}
                                to{' '}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {toItem}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {totalRows}
                                </span>{' '}
                                {totalLabel}
                            </span>
                        ) : (
                            <span>No {totalLabel} to display</span>
                        )}
                    </div>

                    {pageCount > 1 && (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                title="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: pageCount }, (_, i) => i).map((pageIdx) => {
                                // Simple sliding window for pagination if many pages
                                if (
                                    pageCount > 7 &&
                                    pageIdx !== 0 &&
                                    pageIdx !== pageCount - 1 &&
                                    Math.abs(pageIdx - currentPage) > 1
                                ) {
                                    if (
                                        pageIdx === 1 ||
                                        pageIdx === pageCount - 2
                                    ) {
                                        return (
                                            <span
                                                key={pageIdx}
                                                className="w-6 text-center text-slate-400"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <button
                                        key={pageIdx}
                                        type="button"
                                        onClick={() => table.setPageIndex(pageIdx)}
                                        className={`w-8 h-8 rounded-md font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                            currentPage === pageIdx
                                                ? 'bg-[#2952e3] text-white shadow-xs'
                                                : 'border border-slate-200 dark:border-[#243e80] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122352]'
                                        }`}
                                    >
                                        {pageIdx + 1}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="w-8 h-8 rounded-md border border-slate-200 dark:border-[#243e80] flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-[#122352] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                title="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
    id: string;
    header: string;
    cell: (row: T) => ReactNode;
    sortValue?: (row: T) => string | number;
    className?: string;
    headClassName?: string;
    /** Hide this column below the `md` breakpoint (use a mobile card instead). */
    hideOnMobile?: boolean;
    align?: 'left' | 'right' | 'center';
};

type SortState = { columnId: string; dir: 'asc' | 'desc' } | null;

type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    rows: T[];
    getRowId: (row: T) => string;
    onRowClick?: (row: T) => void;
    /** Return a searchable string for a row to enable the search input. */
    searchAccessor?: (row: T) => string;
    searchPlaceholder?: string;
    toolbar?: ReactNode;
    filterBar?: ReactNode;
    emptyState?: ReactNode;
    loading?: boolean;
    pageSize?: number;
    initialSort?: SortState;
    renderMobileCard?: (row: T) => ReactNode;
    selectable?: boolean;
    bulkActions?: (selectedIds: string[], clear: () => void) => ReactNode;
};

export function DataTable<T>({
    columns,
    rows,
    getRowId,
    onRowClick,
    searchAccessor,
    searchPlaceholder = 'Suchen …',
    toolbar,
    filterBar,
    emptyState,
    loading = false,
    pageSize = 10,
    initialSort = null,
    renderMobileCard,
    selectable = false,
    bulkActions,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortState>(initialSort);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        if (!searchAccessor || search.trim() === '') {
            return rows;
        }

        const q = search.trim().toLowerCase();

        return rows.filter((row) =>
            searchAccessor(row).toLowerCase().includes(q),
        );
    }, [rows, search, searchAccessor]);

    const sorted = useMemo(() => {
        if (!sort) {
            return filtered;
        }

        const column = columns.find((c) => c.id === sort.columnId);

        if (!column?.sortValue) {
            return filtered;
        }

        const factor = sort.dir === 'asc' ? 1 : -1;

        return [...filtered].sort((a, b) => {
            const av = column.sortValue!(a);
            const bv = column.sortValue!(b);

            if (av < bv) {
                return -1 * factor;
            }

            if (av > bv) {
                return 1 * factor;
            }

            return 0;
        });
    }, [filtered, sort, columns]);

    console.log(sorted);

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, pageCount - 1);
    const paged = sorted.slice(
        safePage * pageSize,
        safePage * pageSize + pageSize,
    );

    const toggleSort = (columnId: string) => {
        setSort((prev) => {
            if (prev?.columnId !== columnId) {
                return { columnId, dir: 'asc' };
            }

            return prev.dir === 'asc' ? { columnId, dir: 'desc' } : null;
        });
    };

    const clearSelection = () => setSelected(new Set());

    const toggleRow = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const allOnPageSelected =
        paged.length > 0 && paged.every((row) => selected.has(getRowId(row)));

    const toggleAllOnPage = () => {
        setSelected((prev) => {
            const next = new Set(prev);

            if (allOnPageSelected) {
                paged.forEach((row) => next.delete(getRowId(row)));
            } else {
                paged.forEach((row) => next.add(getRowId(row)));
            }

            return next;
        });
    };

    const colSpan = columns.length + (selectable ? 1 : 0);

    return (
        <div className="flex flex-col gap-3">
            {(searchAccessor || toolbar) && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {searchAccessor ? (
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
                                placeholder={searchPlaceholder}
                                aria-label={searchPlaceholder}
                                className="pl-8"
                            />
                        </div>
                    ) : (
                        <div />
                    )}
                    {toolbar && (
                        <div className="flex items-center gap-2">{toolbar}</div>
                    )}
                </div>
            )}

            {filterBar}

            {selectable && selected.size > 0 && bulkActions && (
                <div className="flex items-center justify-between rounded-md border bg-accent/60 px-3 py-2 text-sm">
                    <span className="font-medium">
                        {selected.size} ausgewählt
                    </span>
                    <div className="flex items-center gap-2">
                        {bulkActions(Array.from(selected), clearSelection)}
                    </div>
                </div>
            )}

            {/* Mobile: card list to avoid unusable horizontal overflow. */}
            {renderMobileCard && (
                <div className="flex flex-col gap-3 md:hidden">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-24 w-full rounded-lg"
                            />
                        ))
                    ) : paged.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6">
                            {emptyState}
                        </div>
                    ) : (
                        paged.map((row) => (
                            <div
                                key={getRowId(row)}
                                onClick={
                                    onRowClick
                                        ? () => onRowClick(row)
                                        : undefined
                                }
                                className={cn(onRowClick && 'cursor-pointer')}
                            >
                                {renderMobileCard(row)}
                            </div>
                        ))
                    )}
                </div>
            )}

            <div
                className={cn(
                    'overflow-hidden rounded-lg border',
                    renderMobileCard && 'hidden md:block',
                )}
            >
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            {selectable && (
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={allOnPageSelected}
                                        onCheckedChange={toggleAllOnPage}
                                        aria-label="Alle auswählen"
                                    />
                                </TableHead>
                            )}
                            {columns.map((column) => (
                                <TableHead
                                    key={column.id}
                                    className={cn(
                                        column.hideOnMobile &&
                                            'hidden md:table-cell',
                                        column.align === 'right' &&
                                            'text-right',
                                        column.align === 'center' &&
                                            'text-center',
                                        column.headClassName,
                                    )}
                                >
                                    {column.sortValue ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleSort(column.id)
                                            }
                                            className="inline-flex items-center gap-1 uppercase hover:text-foreground"
                                        >
                                            {column.header}
                                            {sort?.columnId === column.id ? (
                                                sort.dir === 'asc' ? (
                                                    <ArrowUp className="size-3" />
                                                ) : (
                                                    <ArrowDown className="size-3" />
                                                )
                                            ) : (
                                                <ChevronsUpDown className="size-3 opacity-50" />
                                            )}
                                        </button>
                                    ) : (
                                        column.header
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {selectable && <TableCell />}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            className={cn(
                                                column.hideOnMobile &&
                                                    'hidden md:table-cell',
                                            )}
                                        >
                                            <Skeleton className="h-4 w-full max-w-[160px]" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : paged.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={colSpan}
                                    className="h-32 p-0"
                                >
                                    {emptyState ?? (
                                        <p className="py-10 text-center text-sm text-muted-foreground">
                                            Keine Einträge gefunden.
                                        </p>
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paged.map((row) => {
                                const id = getRowId(row);

                                return (
                                    <TableRow
                                        key={id}
                                        data-state={
                                            selected.has(id)
                                                ? 'selected'
                                                : undefined
                                        }
                                        onClick={
                                            onRowClick
                                                ? () => onRowClick(row)
                                                : undefined
                                        }
                                        className={cn(
                                            onRowClick && 'cursor-pointer',
                                        )}
                                    >
                                        {selectable && (
                                            <TableCell
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Checkbox
                                                    checked={selected.has(id)}
                                                    onCheckedChange={() =>
                                                        toggleRow(id)
                                                    }
                                                    aria-label="Zeile auswählen"
                                                />
                                            </TableCell>
                                        )}
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                className={cn(
                                                    column.hideOnMobile &&
                                                        'hidden md:table-cell',
                                                    column.align === 'right' &&
                                                        'text-right',
                                                    column.align === 'center' &&
                                                        'text-center',
                                                    column.className,
                                                )}
                                            >
                                                {column.cell(row)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {!loading && sorted.length > pageSize && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {safePage * pageSize + 1}–
                        {Math.min((safePage + 1) * pageSize, sorted.length)} von{' '}
                        {sorted.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={safePage === 0}
                            className="rounded-md border px-3 py-1 hover:bg-accent disabled:opacity-40"
                        >
                            Zurück
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) => Math.min(pageCount - 1, p + 1))
                            }
                            disabled={safePage >= pageCount - 1}
                            className="rounded-md border px-3 py-1 hover:bg-accent disabled:opacity-40"
                        >
                            Weiter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

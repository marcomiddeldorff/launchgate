/**
 * Centralised, locale-aware formatting helpers (German B2B defaults).
 * Keeping these in one place avoids scattered `toLocaleString` calls with
 * inconsistent options across the UI.
 */

const LOCALE = 'de-DE';

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
});

function toDate(value: string | Date | null | undefined): Date | null {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined): string {
    const date = toDate(value);

    return date ? dateFormatter.format(date) : '—';
}

export function formatDateTime(
    value: string | Date | null | undefined,
): string {
    const date = toDate(value);

    return date ? dateTimeFormatter.format(date) : '—';
}

export function formatTime(value: string | Date | null | undefined): string {
    const date = toDate(value);

    return date ? timeFormatter.format(date) : '—';
}

/** Human relative time, e.g. "vor 3 Tagen" / "in 2 Stunden". */
export function formatRelative(
    value: string | Date | null | undefined,
): string {
    const date = toDate(value);

    if (!date) {
        return '—';
    }

    const diffMs = date.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ['year', 1000 * 60 * 60 * 24 * 365],
        ['month', 1000 * 60 * 60 * 24 * 30],
        ['week', 1000 * 60 * 60 * 24 * 7],
        ['day', 1000 * 60 * 60 * 24],
        ['hour', 1000 * 60 * 60],
        ['minute', 1000 * 60],
    ];

    for (const [unit, ms] of units) {
        if (Math.abs(diffMs) >= ms) {
            return rtf.format(Math.round(diffMs / ms), unit);
        }
    }

    return rtf.format(0, 'minute');
}

/** Whole days until (positive) or since (negative) the given date. */
export function daysUntil(
    value: string | Date | null | undefined,
): number | null {
    const date = toDate(value);

    if (!date) {
        return null;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return Math.round(
        (target.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
    );
}

export function isOverdue(value: string | Date | null | undefined): boolean {
    const date = toDate(value);

    return date ? date.getTime() < Date.now() : false;
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );
    const value = bytes / 1024 ** exponent;

    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatPercent(value: number, fractionDigits = 0): string {
    return `${value.toFixed(fractionDigits).replace('.', ',')} %`;
}

/** Short git SHA, e.g. "8f3a1c2". */
export function shortSha(sha: string | null | undefined): string {
    return sha ? sha.slice(0, 7) : '—';
}

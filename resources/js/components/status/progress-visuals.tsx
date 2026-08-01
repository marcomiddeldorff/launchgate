import { toneDotClasses } from '@/components/status/status-badge';
import type { StatusTone } from '@/lib/status';
import { cn } from '@/lib/utils';
import type { ReviewProgressSummary } from '@/types';

/** Percentage of required review items that have been completed. */
export function requiredCompletion(progress: ReviewProgressSummary): number {
    if (progress.requiredTotal === 0) {
        return 0;
    }

    return Math.round(
        (progress.requiredCompleted / progress.requiredTotal) * 100,
    );
}

type Segment = { key: string; count: number; className: string; label: string };

/**
 * Segmented review-progress bar. Each result type is a distinct colour *and*
 * is described in the accompanying legend/labels — colour is never the only
 * signal.
 */
export function ReviewProgress({
    progress,
    showLegend = true,
    className,
}: {
    progress: ReviewProgressSummary;
    showLegend?: boolean;
    className?: string;
}) {
    const segments: Segment[] = [
        {
            key: 'passed',
            count: progress.passed,
            className: 'bg-success',
            label: 'Erfolgreich',
        },
        {
            key: 'failed',
            count: progress.failed,
            className: 'bg-danger',
            label: 'Problem',
        },
        {
            key: 'blocked',
            count: progress.blocked,
            className: 'bg-warning',
            label: 'Nicht prüfbar',
        },
        {
            key: 'question',
            count: progress.question,
            className: 'bg-info',
            label: 'Rückfrage',
        },
        {
            key: 'na',
            count: progress.notApplicable,
            className: 'bg-muted-foreground/50',
            label: 'Nicht relevant',
        },
        {
            key: 'open',
            count: progress.notStarted,
            className: 'bg-muted',
            label: 'Offen',
        },
    ];

    const total = Math.max(progress.total, 1);

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div
                className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`${progress.passed} von ${progress.total} Prüfungen erfolgreich`}
            >
                {segments
                    .filter((s) => s.count > 0)
                    .map((s) => (
                        <div
                            key={s.key}
                            className={s.className}
                            style={{ width: `${(s.count / total) * 100}%` }}
                        />
                    ))}
            </div>

            {showLegend && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {segments
                        .filter((s) => s.count > 0)
                        .map((s) => (
                            <li
                                key={s.key}
                                className="flex items-center gap-1.5"
                            >
                                <span
                                    className={cn(
                                        'size-2 rounded-full',
                                        s.className,
                                    )}
                                />
                                {s.label}
                                <span className="font-medium text-foreground">
                                    {s.count}
                                </span>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}

export function CircularProgress({
    value,
    size = 56,
    strokeWidth = 6,
    tone = 'primary',
    label,
}: {
    value: number;
    size?: number;
    strokeWidth?: number;
    tone?: StatusTone;
    label?: string;
}) {
    const clamped = Math.max(0, Math.min(100, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;
    const strokeByTone: Record<StatusTone, string> = {
        neutral: 'stroke-muted-foreground',
        primary: 'stroke-primary',
        success: 'stroke-success',
        warning: 'stroke-warning',
        danger: 'stroke-danger',
        info: 'stroke-info',
        retest: 'stroke-retest',
    };

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    className="stroke-muted"
                    fill="none"
                    strokeWidth={strokeWidth}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                />
                <circle
                    className={cn(
                        'transition-[stroke-dashoffset] duration-700',
                        strokeByTone[tone],
                    )}
                    fill="none"
                    strokeLinecap="round"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                />
            </svg>
            <span className="absolute text-xs font-semibold">
                {label ?? `${Math.round(clamped)}%`}
            </span>
        </div>
    );
}

export function HealthIndicator({
    tone,
    label,
    className,
}: {
    tone: StatusTone;
    label: string;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-sm',
                className,
            )}
        >
            <span
                className={cn('size-2.5 rounded-full', toneDotClasses[tone])}
                aria-hidden
            />
            {label}
        </span>
    );
}

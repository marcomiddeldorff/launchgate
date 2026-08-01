import type { ComponentProps } from 'react';

import type { StatusMeta, StatusTone } from '@/lib/status';
import { cn } from '@/lib/utils';

/**
 * Single source of truth mapping a semantic {@link StatusTone} to Tailwind
 * classes. Every status surface routes through here, so colours never drift.
 */
export const toneClasses: Record<StatusTone, string> = {
    neutral: 'bg-muted text-muted-foreground border-border',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/25',
    warning: 'bg-warning/10 text-warning border-warning/30',
    danger: 'bg-danger/10 text-danger border-danger/25',
    info: 'bg-info/10 text-info border-info/25',
    retest: 'bg-retest/10 text-retest border-retest/25',
};

/** Solid dot colour per tone, for compact status indicators. */
export const toneDotClasses: Record<StatusTone, string> = {
    neutral: 'bg-muted-foreground',
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    retest: 'bg-retest',
};

type StatusBadgeProps = ComponentProps<'span'> & {
    meta: StatusMeta;
    /** Show the leading icon (status is not conveyed by colour alone). */
    showIcon?: boolean;
    size?: 'sm' | 'md';
};

export function StatusBadge({
    meta,
    showIcon = true,
    size = 'md',
    className,
    ...props
}: StatusBadgeProps) {
    const Icon = meta.icon;

    return (
        <span
            data-slot="status-badge"
            className={cn(
                'inline-flex w-fit shrink-0 items-center gap-1 rounded-md border font-medium whitespace-nowrap',
                size === 'sm'
                    ? 'px-1.5 py-0.5 text-[11px]'
                    : 'px-2 py-0.5 text-xs',
                toneClasses[meta.tone],
                className,
            )}
            {...props}
        >
            {showIcon && (
                <Icon
                    className={cn(size === 'sm' ? 'size-3' : 'size-3.5')}
                    aria-hidden
                />
            )}
            {meta.label}
        </span>
    );
}

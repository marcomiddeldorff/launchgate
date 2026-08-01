import {
    CircleAlert,
    CircleCheck,
    Info,
    OctagonAlert,
    TriangleAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BannerTone = 'info' | 'warning' | 'danger' | 'success' | 'neutral';

const toneConfig: Record<
    BannerTone,
    { icon: LucideIcon; wrapper: string; iconClass: string }
> = {
    info: {
        icon: Info,
        wrapper: 'border-info/30 bg-info/10 text-info-foreground',
        iconClass: 'text-info',
    },
    warning: {
        icon: TriangleAlert,
        wrapper: 'border-warning/40 bg-warning/10',
        iconClass: 'text-warning',
    },
    danger: {
        icon: OctagonAlert,
        wrapper: 'border-danger/30 bg-danger/10',
        iconClass: 'text-danger',
    },
    success: {
        icon: CircleCheck,
        wrapper: 'border-success/30 bg-success/10',
        iconClass: 'text-success',
    },
    neutral: {
        icon: CircleAlert,
        wrapper: 'border-border bg-muted/50',
        iconClass: 'text-muted-foreground',
    },
};

/**
 * Inline banner for alerts, info, warnings, errors and success messages. The
 * tone is always paired with an icon and text so meaning is not colour-only.
 */
export function Banner({
    tone = 'info',
    title,
    children,
    icon,
    actions,
    className,
}: {
    tone?: BannerTone;
    title?: ReactNode;
    children?: ReactNode;
    icon?: LucideIcon;
    actions?: ReactNode;
    className?: string;
}) {
    const config = toneConfig[tone];
    const Icon = icon ?? config.icon;

    return (
        <div
            role={tone === 'danger' ? 'alert' : 'status'}
            className={cn(
                'flex gap-3 rounded-lg border p-4 text-sm',
                config.wrapper,
                className,
            )}
        >
            <Icon
                className={cn('mt-0.5 size-5 shrink-0', config.iconClass)}
                aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-1">
                {title && (
                    <p className="font-semibold text-foreground">{title}</p>
                )}
                {children && (
                    <div className="text-foreground/80">{children}</div>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

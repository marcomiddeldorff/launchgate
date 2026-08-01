import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Professional empty state: an icon, a headline, supporting copy and an
 * optional action. Never leaves a screen looking broken or unfinished.
 */
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    compact = false,
}: {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    compact?: boolean;
}) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center',
                compact ? 'gap-2 py-8' : 'gap-3 py-14',
                className,
            )}
        >
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-5" aria-hidden />
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-semibold">{title}</h3>
                {description && (
                    <p className="mx-auto max-w-sm text-sm text-pretty text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}

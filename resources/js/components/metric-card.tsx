import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

import { toneClasses } from '@/components/status/status-badge';
import { Card } from '@/components/ui/card';
import type { StatusTone } from '@/lib/status';
import { cn } from '@/lib/utils';

type MetricCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    tone?: StatusTone;
    hint?: string;
    href?: string;
};

/** Compact KPI card — value-dense, not a giant empty tile. */
export function MetricCard({
    label,
    value,
    icon: Icon,
    tone = 'neutral',
    hint,
    href,
}: MetricCardProps) {
    const content = (
        <Card
            className={cn(
                'flex-row items-center gap-4 p-4',
                href && 'transition-colors hover:border-primary/40',
            )}
        >
            <div
                className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg border',
                    toneClasses[tone],
                )}
            >
                <Icon className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 space-y-0.5">
                <p className="text-2xl font-semibold tracking-tight tabular-nums">
                    {value}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                    {label}
                </p>
                {hint && (
                    <p className="truncate text-xs text-muted-foreground/80">
                        {hint}
                    </p>
                )}
            </div>
        </Card>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        );
    }

    return content;
}

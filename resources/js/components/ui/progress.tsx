import * as React from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = React.ComponentProps<'div'> & {
    value?: number;
    /** Tailwind background class for the indicator, e.g. `bg-success`. */
    indicatorClassName?: string;
};

function Progress({
    className,
    value = 0,
    indicatorClassName,
    ...props
}: ProgressProps) {
    const clamped = Math.max(0, Math.min(100, value));

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(clamped)}
            data-slot="progress"
            className={cn(
                'bg-muted relative h-2 w-full overflow-hidden rounded-full',
                className,
            )}
            {...props}
        >
            <div
                data-slot="progress-indicator"
                className={cn(
                    'h-full rounded-full bg-primary transition-[width] duration-500 ease-out',
                    indicatorClassName,
                )}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}

export { Progress };

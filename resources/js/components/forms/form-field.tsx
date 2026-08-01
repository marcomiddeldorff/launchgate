import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Accessible form field wrapper: label, optional hint, the control and an
 * inline validation error. Wiring `htmlFor`/`id` keeps labels associated.
 */
export function FormField({
    id,
    label,
    hint,
    error,
    required,
    optionalLabel = 'optional',
    children,
    className,
}: {
    id: string;
    label: ReactNode;
    hint?: ReactNode;
    error?: string;
    required?: boolean;
    optionalLabel?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('grid gap-2', className)}>
            <div className="flex items-center justify-between gap-2">
                <Label htmlFor={id}>
                    {label}
                    {required && (
                        <span className="ml-0.5 text-danger" aria-hidden>
                            *
                        </span>
                    )}
                </Label>
                {!required && (
                    <span className="text-xs text-muted-foreground">
                        {optionalLabel}
                    </span>
                )}
            </div>
            {children}
            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
            <InputError message={error} />
        </div>
    );
}

/** Live character counter shown under text inputs / textareas. */
export function CharacterCounter({
    value,
    max,
    className,
}: {
    value: string;
    max: number;
    className?: string;
}) {
    const over = value.length > max;

    return (
        <p
            className={cn(
                'text-xs tabular-nums',
                over ? 'text-danger' : 'text-muted-foreground',
                className,
            )}
            aria-live="polite"
        >
            {value.length} / {max}
        </p>
    );
}

import {
    CircleCheck,
    CircleX,
    Info,
    
    TriangleAlert,
    X
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {  useState } from 'react';
import type {ReactNode} from 'react';

import { cn } from '@/lib/utils';

/**
 * Static, on-page status message — the inline counterpart to the toasts.
 * Variants mirror `notify` (info / success / warning / error) so the whole app
 * speaks one status language. Meaning is always carried by icon + text, never
 * colour alone.
 *
 * @example
 * <Callout variant="warning" title="Limit erreicht">
 *     Du hast die maximale Anzahl deiner Organisationen erreicht.
 * </Callout>
 * @example
 * <Callout variant="info">Kurzer Hinweis ohne Titel.</Callout>
 */
export type CalloutVariant = 'info' | 'success' | 'warning' | 'error';

const variantConfig: Record<
    CalloutVariant,
    {
        icon: LucideIcon;
        container: string;
        iconClass: string;
        role: 'status' | 'alert';
    }
> = {
    info: {
        icon: Info,
        container: 'border-info/30 bg-info/10',
        iconClass: 'text-info',
        role: 'status',
    },
    success: {
        icon: CircleCheck,
        container: 'border-success/30 bg-success/10',
        iconClass: 'text-success',
        role: 'status',
    },
    warning: {
        icon: TriangleAlert,
        container: 'border-warning/40 bg-warning/10',
        iconClass: 'text-warning',
        role: 'alert',
    },
    error: {
        icon: CircleX,
        container: 'border-danger/30 bg-danger/10',
        iconClass: 'text-danger',
        role: 'alert',
    },
};

export function Callout({
    variant = 'info',
    title,
    children,
    icon,
    action,
    dismissible = false,
    onDismiss,
    className,
}: {
    variant?: CalloutVariant;
    /** Bold headline; optional — a Callout can be a single line of body text. */
    title?: ReactNode;
    /** Message body. */
    children?: ReactNode;
    /** Override the default variant icon. */
    icon?: LucideIcon;
    /** Right-aligned action slot, e.g. a button or link. */
    action?: ReactNode;
    /** Show a close button (self-hides, and calls `onDismiss` if provided). */
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}) {
    const [visible, setVisible] = useState(true);
    const config = variantConfig[variant];
    const Icon = icon ?? config.icon;

    if (!visible) {
        return null;
    }

    const showClose = dismissible || Boolean(onDismiss);

    return (
        <div
            role={config.role}
            className={cn(
                'flex gap-3 rounded-xl border p-4 text-sm',
                config.container,
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

            {action && (
                <div className="flex shrink-0 items-center gap-2">{action}</div>
            )}

            {showClose && (
                <button
                    type="button"
                    onClick={() => {
                        setVisible(false);
                        onDismiss?.();
                    }}
                    aria-label="Schließen"
                    className="-mt-1 -mr-1 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}

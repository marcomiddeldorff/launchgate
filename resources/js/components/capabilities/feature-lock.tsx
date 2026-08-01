import { Link } from '@inertiajs/react';
import { Lock, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

import { PlanBadge } from '@/components/status/badges';
import { Button } from '@/components/ui/button';
import { capabilityLabels, requiredPlanFor } from '@/lib/capabilities';
import { paths } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { OrganizationCapabilities } from '@/types';

/**
 * Wraps a plan-gated feature. When the capability is available it renders the
 * children; otherwise it shows an upgrade prompt naming the required plan.
 */
export function FeatureLock({
    capability,
    available,
    children,
    title,
    description,
    className,
}: {
    capability: keyof OrganizationCapabilities;
    available: boolean;
    children: ReactNode;
    title?: string;
    description?: string;
    className?: string;
}) {
    if (available) {
        return <>{children}</>;
    }

    const requiredPlan = requiredPlanFor(capability);

    return (
        <div
            className={cn(
                'flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center',
                className,
            )}
        >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Lock className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
                <h3 className="flex items-center justify-center gap-2 text-sm font-semibold">
                    {title ?? capabilityLabels[capability]}
                    <PlanBadge plan={requiredPlan} size="sm" />
                </h3>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                    {description ??
                        `Diese Funktion ist ab dem ${requiredPlan === 'pro' ? 'Pro' : 'Agency'}-Plan verfügbar.`}
                </p>
            </div>
            <Button asChild size="sm">
                <Link href={paths.settings.billing}>
                    <Sparkles /> Jetzt upgraden
                </Link>
            </Button>
        </div>
    );
}

/** Compact inline upgrade hint. */
export function UpgradeHint({
    capability,
    className,
}: {
    capability: keyof OrganizationCapabilities;
    className?: string;
}) {
    const requiredPlan = requiredPlanFor(capability);

    return (
        <Link
            href={paths.settings.billing}
            className={cn(
                'inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline',
                className,
            )}
        >
            <Sparkles className="size-3.5" />
            {capabilityLabels[capability]} ab{' '}
            {requiredPlan === 'pro' ? 'Pro' : 'Agency'}
        </Link>
    );
}

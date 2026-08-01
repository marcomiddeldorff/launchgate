import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { planList } from '@/lib/capabilities';
import { cn } from '@/lib/utils';
import type { PlanTier } from '@/types';

/**
 * Plan comparison used on the landing page and in billing settings. Prices are
 * illustrative — no payment logic is wired up.
 */
export function Pricing({
    currentPlan,
    onSelect,
}: {
    currentPlan?: PlanTier;
    onSelect?: (plan: PlanTier) => void;
}) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {planList.map((plan) => {
                const isCurrent = plan.tier === currentPlan;

                return (
                    <div
                        key={plan.tier}
                        className={cn(
                            'flex flex-col rounded-xl border bg-card p-6',
                            plan.highlighted
                                ? 'border-primary shadow-sm ring-1 ring-primary/20'
                                : 'border-border',
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                {plan.name}
                            </h3>
                            {plan.highlighted && (
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    Beliebt
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {plan.tagline}
                        </p>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl font-semibold tracking-tight">
                                {plan.priceLabel}
                            </span>
                            {plan.priceMonthly !== null &&
                                plan.priceMonthly > 0 && (
                                    <span className="text-sm text-muted-foreground">
                                        / Monat
                                    </span>
                                )}
                        </div>
                        <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm">
                            {plan.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-start gap-2"
                                >
                                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button
                            className="mt-6"
                            variant={plan.highlighted ? 'default' : 'outline'}
                            disabled={isCurrent}
                            onClick={() => onSelect?.(plan.tier)}
                        >
                            {isCurrent
                                ? 'Aktueller Plan'
                                : `${plan.name} wählen`}
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}

import { CircleCheck, CircleX, Info, MinusCircle } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Release } from '@/types';

export type ReadinessCheck = {
    id: string;
    label: string;
    detail: string;
    state: 'met' | 'unmet' | 'neutral';
};

/**
 * Derives the go-live decision *basis* from a release. LaunchGate never decides
 * autonomously — it only surfaces which conditions are met and which are open.
 */
export function computeReadiness(
    release: Release,
    hasRequiredApproval: boolean,
): ReadinessCheck[] {
    const { progress } = release;
    const requiredDone =
        progress.requiredTotal > 0 &&
        progress.requiredCompleted >= progress.requiredTotal;

    return [
        {
            id: 'required-reviews',
            label: 'Pflichtprüfungen abgeschlossen',
            detail: requiredDone
                ? `Alle ${progress.requiredTotal} Pflichtprüfungen sind durchgeführt.`
                : `${progress.requiredTotal - progress.requiredCompleted} von ${progress.requiredTotal} Pflichtprüfungen offen.`,
            state:
                progress.requiredTotal === 0
                    ? 'neutral'
                    : requiredDone
                      ? 'met'
                      : 'unmet',
        },
        {
            id: 'blockers',
            label: 'Keine offenen Go-live-Blocker',
            detail:
                release.openBlockerCount === 0
                    ? 'Es sind keine Go-live-Blocker offen.'
                    : `${release.openBlockerCount} Go-live-Blocker sind offen.`,
            state: release.openBlockerCount === 0 ? 'met' : 'unmet',
        },
        {
            id: 'failed',
            label: 'Keine fehlgeschlagenen Prüfungen',
            detail:
                progress.failed === 0
                    ? 'Keine Prüfung ist als Problem markiert.'
                    : `${progress.failed} Prüfung(en) sind als Problem markiert.`,
            state: progress.failed === 0 ? 'met' : 'unmet',
        },
        {
            id: 'retests',
            label: 'Keine ausstehenden Retests',
            detail:
                release.pendingRetestCount === 0
                    ? 'Alle Retests sind abgeschlossen.'
                    : `${release.pendingRetestCount} Retest(s) stehen noch aus.`,
            state: release.pendingRetestCount === 0 ? 'met' : 'unmet',
        },
        {
            id: 'approval',
            label: 'Erforderliche Freigabe vorhanden',
            detail: hasRequiredApproval
                ? 'Die fachliche Freigabe liegt vor.'
                : 'Die fachliche Freigabe fehlt noch.',
            state: hasRequiredApproval ? 'met' : 'unmet',
        },
        {
            id: 'build',
            label: 'Aktueller Build deployed',
            detail: release.currentBuild
                ? `${release.currentBuild.label} ist auf ${release.currentBuild.environmentName} deployed.`
                : 'Es ist noch kein aktueller Build gesetzt.',
            state:
                release.currentBuild?.status === 'deployed' ? 'met' : 'unmet',
        },
    ];
}

const stateIcon = {
    met: CircleCheck,
    unmet: CircleX,
    neutral: MinusCircle,
} as const;

const stateColor = {
    met: 'text-success',
    unmet: 'text-danger',
    neutral: 'text-muted-foreground',
} as const;

export function GoLiveReadinessPanel({
    release,
    hasRequiredApproval,
    checks: providedChecks,
}: {
    release: Release;
    hasRequiredApproval: boolean;
    checks?: ReadinessCheck[];
}) {
    const checks =
        providedChecks ?? computeReadiness(release, hasRequiredApproval);
    const unmet = checks.filter((c) => c.state === 'unmet');
    const ready = unmet.length === 0;

    return (
        <Card
            className={cn(
                'gap-0 overflow-hidden border-2 py-0',
                ready ? 'border-success/40' : 'border-warning/50',
            )}
        >
            <CardHeader
                className={cn(
                    'flex flex-row items-start gap-3 border-b px-5 py-4',
                    ready ? 'bg-success/10' : 'bg-warning/10',
                )}
            >
                {ready ? (
                    <CircleCheck
                        className="mt-0.5 size-6 shrink-0 text-success"
                        aria-hidden
                    />
                ) : (
                    <CircleX
                        className="mt-0.5 size-6 shrink-0 text-warning"
                        aria-hidden
                    />
                )}
                <div>
                    <h3 className="text-base font-semibold">
                        {ready
                            ? 'Go-live-Bedingungen erfüllt'
                            : 'Go-live aktuell nicht empfohlen'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {ready
                            ? 'Alle definierten Bedingungen für diesen Build sind erfüllt.'
                            : `${unmet.length} Bedingung(en) sind noch offen.`}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="px-5 py-4">
                <ul className="flex flex-col gap-3">
                    {checks.map((check) => {
                        const Icon = stateIcon[check.state];

                        return (
                            <li
                                key={check.id}
                                className="flex items-start gap-3"
                            >
                                <Icon
                                    className={cn(
                                        'mt-0.5 size-4 shrink-0',
                                        stateColor[check.state],
                                    )}
                                    aria-hidden
                                />
                                <div className="text-sm">
                                    <p className="font-medium">{check.label}</p>
                                    <p className="text-muted-foreground">
                                        {check.detail}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <p className="mt-4 flex items-start gap-2 border-t pt-3 text-xs text-muted-foreground">
                    <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                    LaunchGate trifft keine automatische Entscheidung. Es zeigt
                    nur die Entscheidungsgrundlage – die Freigabe erfolgt durch
                    eine berechtigte Person.
                </p>
            </CardContent>
        </Card>
    );
}

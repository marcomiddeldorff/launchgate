import { GitCommitHorizontal, TriangleAlert } from 'lucide-react';

import { BuildStatusBadge } from '@/components/status/badges';
import { shortSha } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { KnownLimitation, ReleaseBuild } from '@/types';

/** Inline build identifier: label + short SHA, optionally with status. */
export function BuildBadge({
    build,
    showStatus = false,
    className,
}: {
    build: Pick<ReleaseBuild, 'label' | 'commitSha' | 'status'>;
    showStatus?: boolean;
    className?: string;
}) {
    return (
        <span className={cn('inline-flex items-center gap-2', className)}>
            <span className="inline-flex items-center gap-1 font-medium">
                <GitCommitHorizontal
                    className="size-4 text-muted-foreground"
                    aria-hidden
                />
                {build.label}
            </span>
            {build.commitSha && (
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-muted-foreground">
                    {shortSha(build.commitSha)}
                </code>
            )}
            {showStatus && <BuildStatusBadge status={build.status} size="sm" />}
        </span>
    );
}

export function KnownLimitationsPanel({
    limitations,
}: {
    limitations: KnownLimitation[];
}) {
    if (limitations.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                Keine bekannten Einschränkungen dokumentiert.
            </p>
        );
    }

    return (
        <ul className="flex flex-col gap-3">
            {limitations.map((limitation) => (
                <li key={limitation.id} className="flex gap-3">
                    <TriangleAlert
                        className="mt-0.5 size-4 shrink-0 text-warning"
                        aria-hidden
                    />
                    <div className="text-sm">
                        <p className="font-medium">{limitation.title}</p>
                        <p className="text-pretty text-muted-foreground">
                            {limitation.description}
                        </p>
                        {!limitation.acknowledged && (
                            <span className="mt-1 inline-block text-xs font-medium text-warning">
                                Noch nicht bestätigt
                            </span>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

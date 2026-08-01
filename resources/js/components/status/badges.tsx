import { OctagonAlert, RotateCcw } from 'lucide-react';

import { StatusBadge, toneClasses } from '@/components/status/status-badge';
import { planMeta } from '@/lib/capabilities';
import {
    approvalStatusMeta,
    buildStatusMeta,
    environmentTypeMeta,
    issueImpactMeta,
    issueSeverityMeta,
    issueStatusMeta,
    priorityMeta,
    releaseStatusMeta,
    reviewItemStatusMeta,
    reviewResultMeta,
    riskLevelMeta,
} from '@/lib/status';
import { cn } from '@/lib/utils';
import type {
    ApprovalStatus,
    BuildStatus,
    EnvironmentType,
    IssueImpact,
    IssueSeverity,
    IssueStatus,
    PlanTier,
    Priority,
    ReleaseStatus,
    ReviewItemStatus,
    ReviewResult,
    RiskLevel,
} from '@/types';

type Size = 'sm' | 'md';

export function ReleaseStatusBadge({
    status,
    size,
}: {
    status: ReleaseStatus;
    size?: Size;
}) {
    return <StatusBadge meta={releaseStatusMeta[status]} size={size} />;
}

export function ReviewResultBadge({
    result,
    size,
}: {
    result: ReviewResult;
    size?: Size;
}) {
    return <StatusBadge meta={reviewResultMeta[result]} size={size} />;
}

export function ReviewItemStatusBadge({
    status,
    size,
}: {
    status: ReviewItemStatus;
    size?: Size;
}) {
    return <StatusBadge meta={reviewItemStatusMeta[status]} size={size} />;
}

export function IssueStatusBadge({
    status,
    size,
}: {
    status: IssueStatus;
    size?: Size;
}) {
    return <StatusBadge meta={issueStatusMeta[status]} size={size} />;
}

export function IssueSeverityBadge({
    severity,
    size,
}: {
    severity: IssueSeverity;
    size?: Size;
}) {
    return <StatusBadge meta={issueSeverityMeta[severity]} size={size} />;
}

export function IssueImpactBadge({
    impact,
    size,
}: {
    impact: IssueImpact;
    size?: Size;
}) {
    return <StatusBadge meta={issueImpactMeta[impact]} size={size} />;
}

export function PriorityBadge({
    priority,
    size,
}: {
    priority: Priority;
    size?: Size;
}) {
    return <StatusBadge meta={priorityMeta[priority]} size={size} />;
}

export function ApprovalStatusBadge({
    status,
    size,
}: {
    status: ApprovalStatus;
    size?: Size;
}) {
    return <StatusBadge meta={approvalStatusMeta[status]} size={size} />;
}

export function BuildStatusBadge({
    status,
    size,
}: {
    status: BuildStatus;
    size?: Size;
}) {
    return <StatusBadge meta={buildStatusMeta[status]} size={size} />;
}

export function RiskIndicator({
    risk,
    size,
}: {
    risk: RiskLevel;
    size?: Size;
}) {
    return <StatusBadge meta={riskLevelMeta[risk]} size={size} />;
}

export function EnvironmentBadge({
    type,
    size,
}: {
    type: EnvironmentType;
    size?: Size;
}) {
    return <StatusBadge meta={environmentTypeMeta[type]} size={size} />;
}

export function PlanBadge({ plan, size }: { plan: PlanTier; size?: Size }) {
    const meta = planMeta(plan);

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-md border font-medium',
                size === 'sm'
                    ? 'px-1.5 py-0.5 text-[11px]'
                    : 'px-2 py-0.5 text-xs',
                toneClasses[meta.tone],
            )}
        >
            {meta.name}
        </span>
    );
}

/** A prominent, hard-to-miss go-live blocker marker. */
export function GoLiveBlockerBadge({ size }: { size?: Size }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-1 rounded-md border font-semibold whitespace-nowrap',
                size === 'sm'
                    ? 'px-1.5 py-0.5 text-[11px]'
                    : 'px-2 py-0.5 text-xs',
                toneClasses.danger,
            )}
        >
            <OctagonAlert className="size-3.5" aria-hidden />
            Go-live-Blocker
        </span>
    );
}

export function RetestBadge({ size }: { size?: Size }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-1 rounded-md border font-medium whitespace-nowrap',
                size === 'sm'
                    ? 'px-1.5 py-0.5 text-[11px]'
                    : 'px-2 py-0.5 text-xs',
                toneClasses.retest,
            )}
        >
            <RotateCcw className="size-3.5" aria-hidden />
            Retest nötig
        </span>
    );
}

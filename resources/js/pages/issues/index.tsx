import { Head, router } from '@inertiajs/react';
import { Bug } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTable } from '@/components/data-table';
import type { DataTableColumn } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import {
    GoLiveBlockerBadge,
    IssueImpactBadge,
    IssueSeverityBadge,
    IssueStatusBadge,
} from '@/components/status/badges';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserInline } from '@/components/user-avatar';
import { formatRelative } from '@/lib/format';
import { issueStatusMeta } from '@/lib/status';
import { cn } from '@/lib/utils';
import { issues as allIssues } from '@/mocks';
import issueRoutes from '@/routes/issues';
import type { Issue, IssueStatus } from '@/types';

export default function IssuesIndex() {
    const [status, setStatus] = useState<IssueStatus | 'all'>('all');
    const [blockersOnly, setBlockersOnly] = useState(false);

    const rows = useMemo(
        () =>
            allIssues.filter(
                (issue) =>
                    (status === 'all' || issue.status === status) &&
                    (!blockersOnly || issue.isGoLiveBlocker),
            ),
        [status, blockersOnly],
    );

    const columns: DataTableColumn<Issue>[] = [
        {
            id: 'number',
            header: 'Nr.',
            cell: (i) => (
                <span className="text-muted-foreground tabular-nums">
                    #{i.number}
                </span>
            ),
            sortValue: (i) => i.number,
            className: 'w-14',
        },
        {
            id: 'title',
            header: 'Titel',
            cell: (i) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{i.title}</span>
                    {i.isGoLiveBlocker && <GoLiveBlockerBadge size="sm" />}
                </div>
            ),
            sortValue: (i) => i.title,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (i) => <IssueStatusBadge status={i.status} size="sm" />,
            hideOnMobile: true,
        },
        {
            id: 'severity',
            header: 'Melderschwere',
            cell: (i) => <IssueSeverityBadge severity={i.severity} size="sm" />,
            hideOnMobile: true,
        },
        {
            id: 'impact',
            header: 'Auswirkung',
            cell: (i) => <IssueImpactBadge impact={i.impact} size="sm" />,
            hideOnMobile: true,
        },
        {
            id: 'assignee',
            header: 'Verantwortlich',
            cell: (i) =>
                i.assignee ? (
                    <UserInline user={i.assignee} size="xs" />
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
            hideOnMobile: true,
        },
        {
            id: 'release',
            header: 'Release',
            cell: (i) => (
                <span className="text-sm text-muted-foreground">
                    {i.releaseName}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'updated',
            header: 'Aktualisiert',
            cell: (i) => (
                <span className="text-sm text-muted-foreground">
                    {formatRelative(i.updatedAt)}
                </span>
            ),
            sortValue: (i) => i.updatedAt,
            hideOnMobile: true,
        },
    ];

    return (
        <>
            <Head title="Issues" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Issues' }]}
                    title="Issues"
                    description="Alle gemeldeten Probleme über Projekte und Releases hinweg."
                />

                <DataTable
                    columns={columns}
                    rows={rows}
                    getRowId={(i) => i.id}
                    onRowClick={(i) => router.visit(issueRoutes.show.url(i.id))}
                    searchAccessor={(i) =>
                        `${i.number} ${i.title} ${i.releaseName} ${i.projectName}`
                    }
                    searchPlaceholder="Issues durchsuchen …"
                    initialSort={{ columnId: 'number', dir: 'desc' }}
                    emptyState={
                        <EmptyState
                            icon={Bug}
                            title="Keine Issues gefunden"
                            description="Passe die Filter an oder starte eine Prüfung."
                            compact
                        />
                    }
                    filterBar={
                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={status}
                                onValueChange={(v) =>
                                    setStatus(v as IssueStatus | 'all')
                                }
                            >
                                <SelectTrigger
                                    className="w-48"
                                    aria-label="Status filtern"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Alle Status
                                    </SelectItem>
                                    {(
                                        Object.keys(
                                            issueStatusMeta,
                                        ) as IssueStatus[]
                                    ).map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {issueStatusMeta[s].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <label className="flex items-center gap-2 text-sm">
                                <Switch
                                    checked={blockersOnly}
                                    onCheckedChange={setBlockersOnly}
                                    aria-label="Nur Go-live-Blocker"
                                />
                                Nur Go-live-Blocker
                            </label>
                        </div>
                    }
                    renderMobileCard={(i) => (
                        <Card className={cn('gap-2 p-4')}>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">
                                    <span className="text-muted-foreground">
                                        #{i.number}
                                    </span>{' '}
                                    {i.title}
                                </span>
                                <IssueStatusBadge status={i.status} size="sm" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {i.isGoLiveBlocker && (
                                    <GoLiveBlockerBadge size="sm" />
                                )}
                                <IssueSeverityBadge
                                    severity={i.severity}
                                    size="sm"
                                />
                                <IssueImpactBadge impact={i.impact} size="sm" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {i.releaseName} · aktualisiert{' '}
                                {formatRelative(i.updatedAt)}
                            </p>
                        </Card>
                    )}
                />
            </div>
        </>
    );
}

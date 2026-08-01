import { Head, Link, router } from '@inertiajs/react';
import { Rocket } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DataTable } from '@/components/data-table';
import type { DataTableColumn } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { ReleaseStatusBadge, RiskIndicator } from '@/components/status/badges';
import { ReviewProgress } from '@/components/status/progress-visuals';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/format';
import { paths } from '@/lib/routes';
import { releaseStatusMeta } from '@/lib/status';
import { releases as allReleases } from '@/mocks';
import type { Release, ReleaseStatus } from '@/types';

export default function ReleasesIndex() {
    const [status, setStatus] = useState<ReleaseStatus | 'all'>('all');

    const rows = useMemo(
        () =>
            allReleases.filter((r) => status === 'all' || r.status === status),
        [status],
    );

    const columns: DataTableColumn<Release>[] = [
        {
            id: 'name',
            header: 'Release',
            cell: (r) => (
                <div>
                    <p className="font-medium">
                        {r.name}{' '}
                        <span className="font-normal text-muted-foreground">
                            {r.version}
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {r.projectName} · {r.clientName}
                    </p>
                </div>
            ),
            sortValue: (r) => r.name,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (r) => <ReleaseStatusBadge status={r.status} size="sm" />,
            hideOnMobile: true,
        },
        {
            id: 'risk',
            header: 'Risiko',
            cell: (r) => <RiskIndicator risk={r.riskLevel} size="sm" />,
            hideOnMobile: true,
        },
        {
            id: 'progress',
            header: 'Fortschritt',
            cell: (r) =>
                r.progress.total === 0 ? (
                    <span className="text-sm text-muted-foreground">—</span>
                ) : (
                    <div className="w-40">
                        <ReviewProgress
                            progress={r.progress}
                            showLegend={false}
                        />
                        <span className="text-xs text-muted-foreground">
                            {r.progress.passed}/{r.progress.total} erfolgreich
                        </span>
                    </div>
                ),
            hideOnMobile: true,
        },
        {
            id: 'blockers',
            header: 'Blocker',
            cell: (r) =>
                r.openBlockerCount > 0 ? (
                    <span className="font-medium text-danger tabular-nums">
                        {r.openBlockerCount}
                    </span>
                ) : (
                    <span className="text-muted-foreground">0</span>
                ),
            sortValue: (r) => r.openBlockerCount,
            align: 'center',
            hideOnMobile: true,
        },
        {
            id: 'golive',
            header: 'Go-live',
            cell: (r) => (
                <span className="text-sm text-muted-foreground">
                    {formatDate(r.plannedGoLiveAt)}
                </span>
            ),
            sortValue: (r) => r.plannedGoLiveAt ?? '',
            hideOnMobile: true,
        },
    ];

    return (
        <>
            <Head title="Releases" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Releases' }]}
                    title="Releases"
                    description="Alle Releases über Projekte und Kunden hinweg."
                    actions={
                        <Button asChild>
                            <Link href={paths.releases.create}>
                                <Rocket /> Neuer Release
                            </Link>
                        </Button>
                    }
                />

                <DataTable
                    columns={columns}
                    rows={rows}
                    getRowId={(r) => r.id}
                    onRowClick={(r) => router.visit(paths.releases.show(r.id))}
                    searchAccessor={(r) =>
                        `${r.name} ${r.projectName} ${r.clientName}`
                    }
                    searchPlaceholder="Releases durchsuchen …"
                    filterBar={
                        <Select
                            value={status}
                            onValueChange={(v) =>
                                setStatus(v as ReleaseStatus | 'all')
                            }
                        >
                            <SelectTrigger
                                className="w-52"
                                aria-label="Status filtern"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alle Status</SelectItem>
                                {(
                                    Object.keys(
                                        releaseStatusMeta,
                                    ) as ReleaseStatus[]
                                ).map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {releaseStatusMeta[s].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    }
                    emptyState={
                        <EmptyState
                            icon={Rocket}
                            title="Keine Releases gefunden"
                            description="Lege deinen ersten Release an, um den Prüfprozess zu starten."
                            action={
                                <Button asChild size="sm">
                                    <Link href={paths.releases.create}>
                                        Release anlegen
                                    </Link>
                                </Button>
                            }
                            compact
                        />
                    }
                    renderMobileCard={(r) => (
                        <Card className="gap-2 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">
                                    {r.name} {r.version}
                                </span>
                                <ReleaseStatusBadge
                                    status={r.status}
                                    size="sm"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {r.projectName} · {r.clientName}
                            </p>
                            {r.progress.total > 0 && (
                                <ReviewProgress
                                    progress={r.progress}
                                    showLegend={false}
                                />
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <RiskIndicator risk={r.riskLevel} size="sm" />
                                <span>
                                    Go-live {formatDate(r.plannedGoLiveAt)}
                                </span>
                            </div>
                        </Card>
                    )}
                />
            </div>
        </>
    );
}

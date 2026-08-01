import { Head, Link } from '@inertiajs/react';
import { GitCommitHorizontal, UserCheck } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { ApprovalStatusBadge } from '@/components/status/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInline } from '@/components/user-avatar';
import { formatDate, formatRelative } from '@/lib/format';
import { paths } from '@/lib/routes';
import { approvals } from '@/mocks';

export default function ApprovalsIndex() {
    const pending = approvals.filter((a) => a.status === 'pending');
    const decided = approvals.filter((a) => a.status !== 'pending');

    const renderCard = (
        approval: (typeof approvals)[number],
        showDue: boolean,
    ) => (
        <Link
            key={approval.id}
            href={paths.approvals.show(approval.id)}
            className="block rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{approval.releaseName}</span>
                <ApprovalStatusBadge status={approval.status} size="sm" />
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <GitCommitHorizontal className="size-4" /> Build{' '}
                {approval.buildLabel}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <UserInline
                    user={approval.approver}
                    secondary="Freigebende Person"
                    size="xs"
                />
                <span className="text-xs text-muted-foreground">
                    {showDue && approval.dueAt
                        ? `Fällig ${formatDate(approval.dueAt)}`
                        : approval.decidedAt
                          ? `Entschieden ${formatRelative(approval.decidedAt)}`
                          : ''}
                </span>
            </div>
        </Link>
    );

    return (
        <>
            <Head title="Freigaben" />
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Freigaben' }]}
                    title="Freigaben"
                    description="Anfragen zur fachlichen Freigabe von Releases – immer an einen konkreten Build gebunden."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Ausstehend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {pending.length === 0 ? (
                            <EmptyState
                                icon={UserCheck}
                                title="Keine offenen Freigaben"
                                compact
                            />
                        ) : (
                            pending.map((a) => renderCard(a, true))
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Entschieden</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {decided.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Noch keine Entscheidungen.
                            </p>
                        ) : (
                            decided.map((a) => renderCard(a, false))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

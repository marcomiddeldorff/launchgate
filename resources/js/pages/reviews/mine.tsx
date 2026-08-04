import { Head, Link } from '@inertiajs/react';
import {
    CircleCheck,
    ClipboardCheck,
    Clock,
    PlayCircle,
    RotateCcw,
} from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { MetricCard } from '@/components/metric-card';
import { PageHeader } from '@/components/page-header';
import {
    PriorityBadge,
    ReviewItemStatusBadge,
} from '@/components/status/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { daysUntil, formatDate, isOverdue } from '@/lib/format';
import { cn } from '@/lib/utils';
import { myAssignments } from '@/mocks';
import releaseRoutes from '@/routes/releases';
import type { ReviewAssignment } from '@/types';

const isDone = (a: ReviewAssignment) =>
    ['passed', 'not_applicable'].includes(a.status);

function AssignmentCard({ assignment }: { assignment: ReviewAssignment }) {
    const overdue =
        assignment.deadline &&
        isOverdue(assignment.deadline) &&
        !isDone(assignment);
    const days = daysUntil(assignment.deadline);

    return (
        <Link
            href={releaseRoutes.runner.url(assignment.releaseId)}
            className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
        >
            <div className="min-w-0 flex-1">
                <p className="font-medium">{assignment.reviewItem.title}</p>
                <p className="text-sm text-muted-foreground">
                    {assignment.projectName} · {assignment.releaseName} ·{' '}
                    {assignment.suiteName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PriorityBadge
                        priority={assignment.reviewItem.priority}
                        size="sm"
                    />
                    <ReviewItemStatusBadge
                        status={assignment.status}
                        size="sm"
                    />
                    {assignment.deadline && (
                        <span
                            className={cn(
                                'text-xs',
                                overdue
                                    ? 'font-medium text-danger'
                                    : 'text-muted-foreground',
                            )}
                        >
                            <Clock className="mr-1 inline size-3" />
                            {overdue
                                ? `überfällig seit ${formatDate(assignment.deadline)}`
                                : days === 0
                                  ? 'heute fällig'
                                  : `fällig ${formatDate(assignment.deadline)}`}
                        </span>
                    )}
                </div>
            </div>
            <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                tabIndex={-1}
            >
                <PlayCircle /> Prüfen
            </Button>
        </Link>
    );
}

function Group({ title, items }: { title: string; items: ReviewAssignment[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{title}</CardTitle>
                <span className="text-sm text-muted-foreground">
                    {items.length}
                </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {items.map((a) => (
                    <AssignmentCard key={a.id} assignment={a} />
                ))}
            </CardContent>
        </Card>
    );
}

export default function MyReviews() {
    const overdue = myAssignments.filter(
        (a) => a.deadline && isOverdue(a.deadline) && !isDone(a),
    );
    const dueToday = myAssignments.filter(
        (a) => daysUntil(a.deadline) === 0 && !isDone(a),
    );
    const retest = myAssignments.filter((a) => a.status === 'retest_required');
    const open = myAssignments.filter(
        (a) =>
            !isDone(a) &&
            a.status !== 'retest_required' &&
            !overdue.includes(a) &&
            !dueToday.includes(a),
    );
    const done = myAssignments.filter(isDone);

    const hasAny = myAssignments.length > 0;

    return (
        <>
            <Head title="Meine Prüfungen" />
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Meine Prüfungen' }]}
                    title="Meine Prüfungen"
                    description="Alle dir zugewiesenen Prüfungen – gruppiert nach Dringlichkeit."
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        label="Offen"
                        value={open.length + dueToday.length}
                        icon={ClipboardCheck}
                    />
                    <MetricCard
                        label="Überfällig"
                        value={overdue.length}
                        icon={Clock}
                        tone={overdue.length ? 'danger' : 'success'}
                    />
                    <MetricCard
                        label="Retest nötig"
                        value={retest.length}
                        icon={RotateCcw}
                        tone={retest.length ? 'retest' : 'neutral'}
                    />
                    <MetricCard
                        label="Abgeschlossen"
                        value={done.length}
                        icon={CircleCheck}
                        tone="success"
                    />
                </div>

                {!hasAny ? (
                    <Card>
                        <CardContent>
                            <EmptyState
                                icon={ClipboardCheck}
                                title="Keine Prüfungen zugewiesen"
                                description="Sobald dir Prüfungen zugewiesen werden, erscheinen sie hier."
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-6">
                        <Group title="Überfällig" items={overdue} />
                        <Group title="Heute fällig" items={dueToday} />
                        <Group title="Retest erforderlich" items={retest} />
                        <Group title="Offen" items={open} />
                        <Group title="Abgeschlossen" items={done} />
                    </div>
                )}
            </div>
        </>
    );
}

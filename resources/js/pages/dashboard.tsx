import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CircleDot,
    Clock,
    FlaskConical,
    FolderKanban,
    OctagonAlert,
    Rocket,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';

import { AuditEventList } from '@/components/activity/audit-event-list';
import { EmptyState } from '@/components/empty-state';
import { MetricCard } from '@/components/metric-card';
import { PageHeader } from '@/components/page-header';
import {
    ApprovalStatusBadge,
    ReleaseStatusBadge,
    RiskIndicator,
} from '@/components/status/badges';
import { ReviewProgress } from '@/components/status/progress-visuals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInline } from '@/components/user-avatar';
import { useAppContext } from '@/hooks/use-app-context';
import { daysUntil, formatDate, isOverdue } from '@/lib/format';
import {
    activeReleases,
    myAssignments,
    openIssues,
    pendingApprovals,
    projects,
    recentActivity,
    releases,
} from '@/mocks';
import approvalRoutes from '@/routes/approvals';
import issueRoutes from '@/routes/issues';
import projectRoutes from '@/routes/projects';
import releaseRoutes from '@/routes/releases';
import reviewRoutes from '@/routes/reviews';

export default function Dashboard() {
    const { organization, currentUser } = useAppContext();

    const testing = releases.filter((release) =>
        ['testing', 'blocked'].includes(release.status),
    );
    const upcomingGoLives = releases
        .filter(
            (release) =>
                release.plannedGoLiveAt &&
                !['completed', 'cancelled'].includes(release.status) &&
                !isOverdue(release.plannedGoLiveAt),
        )
        .sort((left, right) =>
            left.plannedGoLiveAt! < right.plannedGoLiveAt! ? -1 : 1,
        );
    const blockers = openIssues.filter((issue) => issue.isGoLiveBlocker);
    const overdueReviews = myAssignments.filter(
        (assignment) =>
            assignment.deadline &&
            isOverdue(assignment.deadline) &&
            assignment.status !== 'passed',
    );
    const nextGoLive = upcomingGoLives[0] ?? null;
    const readinessLabel =
        blockers.length > 0
            ? 'Go-live aktuell blockiert'
            : pendingApprovals.length > 0
              ? 'Freigabe läuft'
              : testing.length > 0
                ? 'Release-Prüfung aktiv'
                : 'Bereit für neuen Release';

    return (
        <>
            <Head title="Übersicht" />
            <div className="flex flex-col gap-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Übersicht' }]}
                    title={`Willkommen zurück, ${currentUser.name.split(' ')[0]}`}
                    description={`Steuere Releases, Reviews und Freigaben für ${organization.name} aus einer zentralen Abnahmeoberfläche.`}
                    actions={
                        <Button asChild>
                            <Link href={releaseRoutes.create.url()}>
                                <Rocket /> Neuer Release
                            </Link>
                        </Button>
                    }
                />

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
                    <Card className="overflow-hidden border-border/70 bg-card/92 shadow-[0_30px_80px_-50px_color-mix(in_oklch,var(--color-primary)_30%,transparent)]">
                        <CardContent className="relative p-0">
                            <div
                                aria-hidden
                                className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--color-primary)_20%,transparent),transparent_70%)]"
                            />
                            <div className="relative flex flex-col gap-6 p-6 sm:p-7">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="space-y-4">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                            <ShieldCheck className="size-4" />
                                            Release Control Room
                                        </span>
                                        <div className="space-y-2">
                                            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance">
                                                {readinessLabel}
                                            </h2>
                                            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                                LaunchGate bildet genau die
                                                Phase zwischen fertiger
                                                Entwicklung, Kundenprüfung und
                                                finaler Freigabe ab. Offene
                                                Risiken, Retests und Sign-offs
                                                bleiben an einem Ort sichtbar.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3 lg:w-[23rem] lg:grid-cols-1">
                                        <div className="rounded-3xl border border-border/70 bg-background/75 p-4">
                                            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                                Aktive Testphase
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold">
                                                {testing.length}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Releases mit laufender Prüfung
                                            </p>
                                        </div>
                                        <div className="rounded-3xl border border-border/70 bg-background/75 p-4">
                                            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                                Go-live-Blocker
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold text-danger">
                                                {blockers.length}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Kritische Punkte vor Livegang
                                            </p>
                                        </div>
                                        <div className="rounded-3xl border border-border/70 bg-background/75 p-4">
                                            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                                Ausstehende Sign-offs
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold text-warning-foreground">
                                                {pendingApprovals.length}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Freigaben mit Handlungsbedarf
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
                                    <div className="rounded-[1.75rem] border border-border/70 bg-background/82 p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    Nächster relevanter Schritt
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Fokus auf den am stärksten
                                                    zeitkritischen Release-Stand
                                                </p>
                                            </div>
                                            {nextGoLive ? (
                                                <ReleaseStatusBadge
                                                    status={nextGoLive.status}
                                                    size="sm"
                                                />
                                            ) : (
                                                <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                                                    Kein geplanter Go-live
                                                </span>
                                            )}
                                        </div>

                                        {nextGoLive ? (
                                            <div className="mt-4 space-y-4">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-xl font-semibold">
                                                            {nextGoLive.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                nextGoLive.projectName
                                                            }{' '}
                                                            ·{' '}
                                                            {
                                                                nextGoLive.clientName
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl border border-border/70 bg-muted/45 px-4 py-3 text-right">
                                                        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                                            Geplanter Go-live
                                                        </p>
                                                        <p className="mt-1 text-base font-semibold">
                                                            {formatDate(
                                                                nextGoLive.plannedGoLiveAt,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <ReviewProgress
                                                    progress={
                                                        nextGoLive.progress
                                                    }
                                                    showLegend={false}
                                                />

                                                <div className="flex flex-wrap gap-2 text-xs font-medium">
                                                    <span className="rounded-full bg-success/10 px-3 py-1 text-success">
                                                        {
                                                            nextGoLive.progress
                                                                .passed
                                                        }{' '}
                                                        erfolgreich
                                                    </span>
                                                    <span className="rounded-full bg-danger/10 px-3 py-1 text-danger">
                                                        {
                                                            nextGoLive.openBlockerCount
                                                        }{' '}
                                                        Blocker
                                                    </span>
                                                    <span className="rounded-full bg-retest/10 px-3 py-1 text-retest">
                                                        {
                                                            nextGoLive.pendingRetestCount
                                                        }{' '}
                                                        Retests offen
                                                    </span>
                                                    <span className="rounded-full bg-info/10 px-3 py-1 text-info">
                                                        Risiko{' '}
                                                        {nextGoLive.riskLevel}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <EmptyState
                                                icon={Rocket}
                                                title="Kein Go-live geplant"
                                                description="Lege einen Release mit Zieltermin an, damit LaunchGate den Prüfpfad sichtbar machen kann."
                                                compact
                                            />
                                        )}
                                    </div>

                                    <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--color-warning)_10%,transparent),transparent_70%)] p-5">
                                        <p className="text-sm font-semibold">
                                            Heute im Blick
                                        </p>
                                        <ul className="mt-4 space-y-3 text-sm">
                                            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/75 p-3">
                                                <CircleDot className="mt-0.5 size-4 text-info" />
                                                <span>
                                                    {overdueReviews.length > 0
                                                        ? `${overdueReviews.length} Prüfungen warten auf Retest oder Rückmeldung.`
                                                        : 'Aktuell sind keine Prüfungen überfällig.'}
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/75 p-3">
                                                <CircleDot className="mt-0.5 size-4 text-warning" />
                                                <span>
                                                    {pendingApprovals.length > 0
                                                        ? `${pendingApprovals.length} Freigaben sind noch nicht bestätigt.`
                                                        : 'Es gibt derzeit keine offenen Freigaben.'}
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/75 p-3">
                                                <CircleDot className="mt-0.5 size-4 text-danger" />
                                                <span>
                                                    {blockers.length > 0
                                                        ? `${blockers.length} Go-live-Blocker müssen vor dem Livegang gelöst werden.`
                                                        : 'Kein offener Go-live-Blocker vorhanden.'}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-card/90">
                        <CardHeader>
                            <CardTitle>Bald anstehende Go-lives</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {upcomingGoLives.length === 0 ? (
                                <EmptyState
                                    icon={Rocket}
                                    title="Keine geplanten Go-lives"
                                    compact
                                />
                            ) : (
                                <ul className="space-y-3">
                                    {upcomingGoLives
                                        .slice(0, 4)
                                        .map((release) => {
                                            const days = daysUntil(
                                                release.plannedGoLiveAt,
                                            );

                                            return (
                                                <li key={release.id}>
                                                    <Link
                                                        href={releaseRoutes.show.url(
                                                            release.id,
                                                        )}
                                                        className="block rounded-3xl border border-border/70 bg-background/75 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="truncate font-medium">
                                                                    {
                                                                        release.name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        release.projectName
                                                                    }{' '}
                                                                    ·{' '}
                                                                    {
                                                                        release.clientName
                                                                    }
                                                                </p>
                                                            </div>
                                                            <RiskIndicator
                                                                risk={
                                                                    release.riskLevel
                                                                }
                                                                size="sm"
                                                            />
                                                        </div>
                                                        <div className="mt-4 flex items-center justify-between text-sm">
                                                            <span className="font-medium">
                                                                {formatDate(
                                                                    release.plannedGoLiveAt,
                                                                )}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                {days !==
                                                                    null &&
                                                                days >= 0
                                                                    ? `in ${days} Tagen`
                                                                    : 'überfällig'}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </section>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <MetricCard
                        label="Aktive Projekte"
                        value={
                            projects.filter(
                                (project) => project.status === 'active',
                            ).length
                        }
                        icon={FolderKanban}
                        href={projectRoutes.index.url()}
                    />
                    <MetricCard
                        label="In Testphase"
                        value={testing.length}
                        icon={FlaskConical}
                        tone="info"
                        href={releaseRoutes.index.url()}
                    />
                    <MetricCard
                        label="Bevorstehende Go-lives"
                        value={upcomingGoLives.length}
                        icon={Rocket}
                        tone="primary"
                    />
                    <MetricCard
                        label="Offene Go-live-Blocker"
                        value={blockers.length}
                        icon={OctagonAlert}
                        tone={blockers.length > 0 ? 'danger' : 'success'}
                        href={issueRoutes.index.url()}
                    />
                    <MetricCard
                        label="Ausstehende Freigaben"
                        value={pendingApprovals.length}
                        icon={UserCheck}
                        tone={
                            pendingApprovals.length > 0 ? 'warning' : 'success'
                        }
                        href={approvalRoutes.index.url()}
                    />
                    <MetricCard
                        label="Überfällige Prüfungen"
                        value={overdueReviews.length}
                        icon={Clock}
                        tone={overdueReviews.length > 0 ? 'danger' : 'success'}
                        href={reviewRoutes.mine.url()}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card className="border-border/70 bg-card/90">
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle>Releases in Testphase</CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={releaseRoutes.index.url()}>
                                        Alle Releases <ArrowRight />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                {testing.length === 0 ? (
                                    <EmptyState
                                        icon={FlaskConical}
                                        title="Keine Releases in Testphase"
                                        description="Sobald ein Release getestet wird, erscheint es hier."
                                        compact
                                    />
                                ) : (
                                    testing.map((release) => (
                                        <Link
                                            key={release.id}
                                            href={releaseRoutes.show.url(
                                                release.id,
                                            )}
                                            className="block rounded-[1.6rem] border border-border/70 bg-background/75 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {release.name}{' '}
                                                        <span className="font-normal text-muted-foreground">
                                                            ·{' '}
                                                            {
                                                                release.projectName
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {release.clientName}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <RiskIndicator
                                                        risk={release.riskLevel}
                                                        size="sm"
                                                    />
                                                    <ReleaseStatusBadge
                                                        status={release.status}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <ReviewProgress
                                                    progress={release.progress}
                                                    showLegend={false}
                                                />
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                                                <span className="rounded-full bg-success/10 px-3 py-1 text-success">
                                                    {release.progress.passed}/
                                                    {release.progress.total}{' '}
                                                    erfolgreich
                                                </span>
                                                {release.openBlockerCount >
                                                    0 && (
                                                    <span className="rounded-full bg-danger/10 px-3 py-1 text-danger">
                                                        {
                                                            release.openBlockerCount
                                                        }{' '}
                                                        Go-live-Blocker
                                                    </span>
                                                )}
                                                {release.pendingRetestCount >
                                                    0 && (
                                                    <span className="rounded-full bg-retest/10 px-3 py-1 text-retest">
                                                        {
                                                            release.pendingRetestCount
                                                        }{' '}
                                                        Retests offen
                                                    </span>
                                                )}
                                                {release.plannedGoLiveAt && (
                                                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                                                        Go-live{' '}
                                                        {formatDate(
                                                            release.plannedGoLiveAt,
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/70 bg-card/90">
                            <CardHeader>
                                <CardTitle>Bevorstehende Go-lives</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {upcomingGoLives.length === 0 ? (
                                    <EmptyState
                                        icon={Rocket}
                                        title="Keine geplanten Go-lives"
                                        compact
                                    />
                                ) : (
                                    <ul className="divide-y divide-border/70">
                                        {upcomingGoLives.map((release) => {
                                            const days = daysUntil(
                                                release.plannedGoLiveAt,
                                            );

                                            return (
                                                <li
                                                    key={release.id}
                                                    className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                                                >
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={releaseRoutes.show.url(
                                                                release.id,
                                                            )}
                                                            className="font-medium hover:text-primary"
                                                        >
                                                            {release.name}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                release.projectName
                                                            }{' '}
                                                            ·{' '}
                                                            {release.clientName}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">
                                                            {formatDate(
                                                                release.plannedGoLiveAt,
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {days !== null &&
                                                            days >= 0
                                                                ? `in ${days} Tagen`
                                                                : 'überfällig'}
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card className="border-border/70 bg-card/90">
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle>Ausstehende Freigaben</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pendingApprovals.length === 0 ? (
                                    <EmptyState
                                        icon={UserCheck}
                                        title="Keine offenen Freigaben"
                                        compact
                                    />
                                ) : (
                                    <ul className="flex flex-col gap-3">
                                        {pendingApprovals.map((approval) => (
                                            <li key={approval.id}>
                                                <Link
                                                    href={approvalRoutes.show.url(
                                                        approval.id,
                                                    )}
                                                    className="block rounded-[1.5rem] border border-border/70 bg-background/75 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-medium">
                                                            {
                                                                approval.releaseName
                                                            }
                                                        </span>
                                                        <ApprovalStatusBadge
                                                            status={
                                                                approval.status
                                                            }
                                                            size="sm"
                                                        />
                                                    </div>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Build{' '}
                                                        {approval.buildLabel}
                                                    </p>
                                                    <div className="mt-3">
                                                        <UserInline
                                                            user={
                                                                approval.approver
                                                            }
                                                            secondary="Freigebende Person"
                                                            size="xs"
                                                        />
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/70 bg-card/90">
                            <CardHeader>
                                <CardTitle>Letzte Aktivitäten</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AuditEventList events={recentActivity} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {activeReleases.length === 0 && (
                    <EmptyState
                        icon={Rocket}
                        title="Noch keine Releases"
                        description="Lege deinen ersten Release an, um mit dem strukturierten Prüf- und Freigabeprozess zu starten."
                        action={
                            <Button asChild>
                                <Link href={releaseRoutes.create.url()}>
                                    Release anlegen
                                </Link>
                            </Button>
                        }
                    />
                )}
            </div>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import {
    Bug,
    CalendarClock,
    ClipboardCheck,
    FileText,
    GitCommitHorizontal,
    PlayCircle,
    Plus,
    Send,
    UserCheck,
} from 'lucide-react';

import { AuditEventList } from '@/components/activity/audit-event-list';
import { Banner } from '@/components/banner';
import { DefinitionList } from '@/components/definition-list';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { GoLiveReadinessPanel } from '@/components/releases/go-live-readiness';
import {
    BuildBadge,
    KnownLimitationsPanel,
} from '@/components/releases/release-bits';
import {
    ApprovalStatusBadge,
    BuildStatusBadge,
    GoLiveBlockerBadge,
    IssueImpactBadge,
    IssueStatusBadge,
    PriorityBadge,
    ReleaseStatusBadge,
    ReviewItemStatusBadge,
    RiskIndicator,
} from '@/components/status/badges';
import {
    CircularProgress,
    ReviewProgress,
    requiredCompletion,
} from '@/components/status/progress-visuals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserInline } from '@/components/user-avatar';
import { useAppContext } from '@/hooks/use-app-context';
import { formatDate, formatDateTime } from '@/lib/format';
import { paths } from '@/lib/routes';
import {
    approvalsForRelease,
    auditForRelease,
    buildsForRelease,
    getRelease,
    issuesForRelease,
    suitesForRelease,
} from '@/mocks';

export default function ReleaseShow({ id }: { id: string }) {
    const { abilities } = useAppContext();
    const release = getRelease(id);
    const builds = buildsForRelease(release.id);
    const suites = suitesForRelease(release.id);
    const issues = issuesForRelease(release.id);
    const approvals = approvalsForRelease(release.id);
    const audit = auditForRelease(release.id);

    const hasApproval = approvals.some(
        (a) =>
            a.buildId === release.currentBuild?.id &&
            ['approved', 'approved_with_conditions'].includes(a.status),
    );

    const completion = requiredCompletion(release.progress);

    return (
        <>
            <Head title={`${release.name} · ${release.projectName}`} />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Releases', href: paths.releases.index },
                        {
                            title: `${release.projectName}`,
                            href: paths.projects.show(release.projectId),
                        },
                        { title: release.name },
                    ]}
                    title={
                        <span className="flex flex-wrap items-center gap-3">
                            {release.name}
                            <span className="text-lg font-normal text-muted-foreground">
                                {release.version}
                            </span>
                        </span>
                    }
                    description={`${release.projectName} · ${release.clientName}`}
                    actions={
                        <>
                            <div className="flex items-center gap-2">
                                <RiskIndicator risk={release.riskLevel} />
                                <ReleaseStatusBadge status={release.status} />
                            </div>
                            <Button variant="outline" asChild>
                                <Link href={paths.releases.runner(release.id)}>
                                    <PlayCircle /> Prüfung starten
                                </Link>
                            </Button>
                            {release.status === 'completed' ? (
                                <Button asChild>
                                    <Link
                                        href={paths.releases.report(release.id)}
                                    >
                                        <FileText /> Abschlussbericht
                                    </Link>
                                </Button>
                            ) : (
                                abilities.requestApprovals && (
                                    <Button asChild>
                                        <Link href={paths.approvals.index}>
                                            <Send /> Freigabe anfordern
                                        </Link>
                                    </Button>
                                )
                            )}
                        </>
                    }
                />

                <Tabs defaultValue="overview">
                    <TabsList className="w-full max-w-xl overflow-x-auto">
                        <TabsTrigger value="overview">Übersicht</TabsTrigger>
                        <TabsTrigger value="builds">Builds</TabsTrigger>
                        <TabsTrigger value="reviews">Prüfungen</TabsTrigger>
                        <TabsTrigger value="issues">Issues</TabsTrigger>
                        <TabsTrigger value="approvals">Freigaben</TabsTrigger>
                        <TabsTrigger value="activity">Aktivität</TabsTrigger>
                    </TabsList>

                    {/* -------------------------------- Overview ------------------------------- */}
                    <TabsContent
                        value="overview"
                        className="flex flex-col gap-6"
                    >
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="flex flex-col gap-6 lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Release-Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        {release.description && (
                                            <p className="text-sm text-pretty">
                                                {release.description}
                                            </p>
                                        )}
                                        <DefinitionList
                                            columns={2}
                                            items={[
                                                {
                                                    term: 'Aktueller Build',
                                                    description:
                                                        release.currentBuild ? (
                                                            <BuildBadge
                                                                build={
                                                                    release.currentBuild
                                                                }
                                                                showStatus
                                                            />
                                                        ) : (
                                                            '—'
                                                        ),
                                                },
                                                {
                                                    term: 'Umgebung',
                                                    description:
                                                        release.environmentName ??
                                                        '—',
                                                },
                                                {
                                                    term: 'Testzeitraum',
                                                    description: `${formatDate(release.testStartsAt)} – ${formatDate(release.testEndsAt)}`,
                                                },
                                                {
                                                    term: 'Geplanter Go-live',
                                                    description: formatDate(
                                                        release.plannedGoLiveAt,
                                                    ),
                                                },
                                                {
                                                    term: 'Verantwortlich',
                                                    description: (
                                                        <UserInline
                                                            user={
                                                                release.projectManager
                                                            }
                                                            size="xs"
                                                        />
                                                    ),
                                                },
                                                {
                                                    term: 'Scope',
                                                    description:
                                                        release.scope ?? '—',
                                                },
                                            ]}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex-row items-center justify-between">
                                        <CardTitle>Testfortschritt</CardTitle>
                                        <span className="text-sm text-muted-foreground">
                                            {release.progress.requiredCompleted}
                                            /{release.progress.requiredTotal}{' '}
                                            Pflichtprüfungen
                                        </span>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                        <CircularProgress
                                            value={completion}
                                            size={84}
                                            tone={
                                                completion === 100
                                                    ? 'success'
                                                    : 'primary'
                                            }
                                        />
                                        <div className="flex-1">
                                            <ReviewProgress
                                                progress={release.progress}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Bekannte Einschränkungen
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <KnownLimitationsPanel
                                            limitations={
                                                release.knownLimitations
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-6">
                                <GoLiveReadinessPanel
                                    release={release}
                                    hasRequiredApproval={hasApproval}
                                />

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Auf einen Blick</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DefinitionList
                                            items={[
                                                {
                                                    term: 'Offene Go-live-Blocker',
                                                    description:
                                                        release.openBlockerCount >
                                                        0 ? (
                                                            <span className="font-semibold text-danger">
                                                                {
                                                                    release.openBlockerCount
                                                                }
                                                            </span>
                                                        ) : (
                                                            '0'
                                                        ),
                                                },
                                                {
                                                    term: 'Offene Issues',
                                                    description:
                                                        release.openIssueCount,
                                                },
                                                {
                                                    term: 'Ausstehende Retests',
                                                    description:
                                                        release.pendingRetestCount,
                                                },
                                                {
                                                    term: 'Freigabestatus',
                                                    description:
                                                        approvals.length ? (
                                                            <ApprovalStatusBadge
                                                                status={
                                                                    approvals[0]
                                                                        .status
                                                                }
                                                                size="sm"
                                                            />
                                                        ) : (
                                                            'Keine Freigabe angefordert'
                                                        ),
                                                },
                                            ]}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* --------------------------------- Builds -------------------------------- */}
                    <TabsContent value="builds" className="flex flex-col gap-4">
                        <Banner
                            tone="warning"
                            title="Freigaben sind an einen Build gebunden"
                        >
                            Wird ein neuer Build als aktuell markiert, können
                            bereits erteilte Freigaben ungültig werden und
                            müssen erneut eingeholt werden.
                        </Banner>
                        {builds.length === 0 ? (
                            <Card>
                                <CardContent>
                                    <EmptyState
                                        icon={GitCommitHorizontal}
                                        title="Noch keine Builds"
                                        description="Trage den ersten Build für diesen Release ein."
                                        compact
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {builds.map((build) => (
                                    <Card
                                        key={build.id}
                                        className={
                                            build.isCurrent
                                                ? 'border-primary/50'
                                                : ''
                                        }
                                    >
                                        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <BuildBadge build={build} />
                                                    <BuildStatusBadge
                                                        status={build.status}
                                                        size="sm"
                                                    />
                                                    {build.isCurrent && (
                                                        <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                                                            Aktueller Build
                                                        </span>
                                                    )}
                                                </div>
                                                {build.releaseNotes && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {build.releaseNotes}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                    <span>
                                                        Branch {build.branch}
                                                    </span>
                                                    <span>
                                                        {build.environmentName}
                                                    </span>
                                                    <span>
                                                        Deployed{' '}
                                                        {formatDateTime(
                                                            build.deployedAt,
                                                        )}
                                                    </span>
                                                    <span>
                                                        von{' '}
                                                        {build.createdBy.name}
                                                    </span>
                                                </div>
                                            </div>
                                            {!build.isCurrent &&
                                                abilities.manageReleases &&
                                                build.status !== 'failed' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Als aktuell markieren
                                                    </Button>
                                                )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* -------------------------------- Reviews -------------------------------- */}
                    <TabsContent
                        value="reviews"
                        className="flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {suites.length} Suiten ·{' '}
                                {release.progress.total} Prüfgegenstände
                            </p>
                            <Button asChild size="sm">
                                <Link href={paths.releases.runner(release.id)}>
                                    <PlayCircle /> Test-Runner öffnen
                                </Link>
                            </Button>
                        </div>
                        {suites.length === 0 ? (
                            <Card>
                                <CardContent>
                                    <EmptyState
                                        icon={ClipboardCheck}
                                        title="Noch keine Prüfungen angelegt"
                                        description="Lege Prüf-Suites und Prüfgegenstände an, oder kopiere sie aus einem früheren Release."
                                        action={
                                            <Button size="sm">
                                                <Plus /> Suite anlegen
                                            </Button>
                                        }
                                        compact
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            suites.map((suite) => (
                                <Card key={suite.id}>
                                    <CardHeader className="flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base">
                                                {suite.name}
                                            </CardTitle>
                                            {suite.description && (
                                                <p className="mt-0.5 text-sm text-muted-foreground">
                                                    {suite.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {suite.passedCount}/
                                            {suite.itemCount} erfolgreich
                                        </span>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ul className="divide-y border-t">
                                            {suite.items.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="flex items-center gap-3 px-4 py-3 sm:px-6"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-medium">
                                                                {item.title}
                                                            </span>
                                                            {item.isRequired && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Pflicht
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="truncate text-sm text-muted-foreground">
                                                            {item.instruction}
                                                        </p>
                                                    </div>
                                                    <PriorityBadge
                                                        priority={item.priority}
                                                        size="sm"
                                                    />
                                                    <ReviewItemStatusBadge
                                                        status={item.status}
                                                        size="sm"
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* --------------------------------- Issues -------------------------------- */}
                    <TabsContent value="issues" className="flex flex-col gap-3">
                        {issues.length === 0 ? (
                            <Card>
                                <CardContent>
                                    <EmptyState
                                        icon={Bug}
                                        title="Keine Issues"
                                        description="In diesem Release wurden noch keine Probleme gemeldet."
                                        compact
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            issues.map((issue) => (
                                <Link
                                    key={issue.id}
                                    href={paths.issues.show(issue.id)}
                                    className="block rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="flex items-center gap-2 font-medium">
                                            <span className="text-muted-foreground">
                                                #{issue.number}
                                            </span>
                                            {issue.title}
                                        </span>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {issue.isGoLiveBlocker && (
                                                <GoLiveBlockerBadge size="sm" />
                                            )}
                                            <IssueImpactBadge
                                                impact={issue.impact}
                                                size="sm"
                                            />
                                            <IssueStatusBadge
                                                status={issue.status}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                    {issue.assignee && (
                                        <div className="mt-2">
                                            <UserInline
                                                user={issue.assignee}
                                                secondary="Verantwortlich"
                                                size="xs"
                                            />
                                        </div>
                                    )}
                                </Link>
                            ))
                        )}
                    </TabsContent>

                    {/* ------------------------------- Approvals ------------------------------- */}
                    <TabsContent
                        value="approvals"
                        className="flex flex-col gap-3"
                    >
                        {approvals.length === 0 ? (
                            <Card>
                                <CardContent>
                                    <EmptyState
                                        icon={UserCheck}
                                        title="Keine Freigaben"
                                        description="Fordere eine Freigabe an, sobald die Pflichtprüfungen abgeschlossen sind."
                                        action={
                                            abilities.requestApprovals ? (
                                                <Button size="sm">
                                                    <Send /> Freigabe anfordern
                                                </Button>
                                            ) : undefined
                                        }
                                        compact
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            approvals.map((approval) => (
                                <Link
                                    key={approval.id}
                                    href={paths.approvals.show(approval.id)}
                                    className="block rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="flex items-center gap-2 font-medium">
                                            <GitCommitHorizontal className="size-4 text-muted-foreground" />
                                            Freigabe für Build{' '}
                                            {approval.buildLabel}
                                        </span>
                                        <ApprovalStatusBadge
                                            status={approval.status}
                                            size="sm"
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center gap-4">
                                        <UserInline
                                            user={approval.approver}
                                            secondary="Freigebende Person"
                                            size="xs"
                                        />
                                        {approval.decidedAt && (
                                            <span className="text-xs text-muted-foreground">
                                                <CalendarClock className="mr-1 inline size-3" />
                                                {formatDateTime(
                                                    approval.decidedAt,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </TabsContent>

                    {/* ------------------------------- Activity -------------------------------- */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aktivität & Audit-Verlauf</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {audit.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Noch keine Aktivität.
                                    </p>
                                ) : (
                                    <AuditEventList events={audit} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

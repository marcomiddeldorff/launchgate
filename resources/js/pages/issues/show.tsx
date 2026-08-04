import { Head, Link } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';

import { AttachmentList } from '@/components/attachments/attachments';
import { Banner } from '@/components/banner';
import { DefinitionList } from '@/components/definition-list';
import {
    CommentComposer,
    CommentThread,
} from '@/components/issues/comment-thread';
import { PageHeader } from '@/components/page-header';
import { BuildBadge } from '@/components/releases/release-bits';
import {
    GoLiveBlockerBadge,
    IssueImpactBadge,
    IssueSeverityBadge,
    IssueStatusBadge,
} from '@/components/status/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInline } from '@/components/user-avatar';
import { useAppContext } from '@/hooks/use-app-context';
import { formatDateTime, formatRelative } from '@/lib/format';
import { issueStatusMeta } from '@/lib/status';
import { getIssue } from '@/mocks';
import issueRoutes from '@/routes/issues';
import releaseRoutes from '@/routes/releases';

export default function IssueShow({ id }: { id: string }) {
    const { abilities, currentUser } = useAppContext();
    const issue = getIssue(id);

    return (
        <>
            <Head title={`#${issue.number} · ${issue.title}`} />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Issues', href: issueRoutes.index.url() },
                        { title: `#${issue.number}` },
                    ]}
                    title={
                        <span className="flex flex-wrap items-baseline gap-2">
                            <span className="text-xl text-muted-foreground">
                                #{issue.number}
                            </span>
                            {issue.title}
                        </span>
                    }
                    actions={
                        <div className="flex flex-wrap items-center gap-2">
                            {issue.isGoLiveBlocker && <GoLiveBlockerBadge />}
                            <IssueStatusBadge status={issue.status} />
                        </div>
                    }
                />

                {issue.needsRetest && (
                    <Banner
                        tone="danger"
                        icon={RotateCcw}
                        title="Retest erforderlich"
                        actions={
                            abilities.runReviews && (
                                <Button size="sm" variant="outline">
                                    <RotateCcw /> Retest durchführen
                                </Button>
                            )
                        }
                    >
                        Der zugehörige Fix wurde eingespielt. Bitte prüfe im
                        aktuellen Build, ob das Problem behoben ist.
                    </Banner>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Beschreibung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-pretty whitespace-pre-line">
                                    {issue.description}
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                                        <p className="text-xs font-semibold tracking-wide text-success uppercase">
                                            Erwartetes Verhalten
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {issue.expectedBehavior ?? '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-danger/30 bg-danger/5 p-3">
                                        <p className="text-xs font-semibold tracking-wide text-danger uppercase">
                                            Tatsächliches Verhalten
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {issue.actualBehavior ?? '—'}
                                        </p>
                                    </div>
                                </div>
                                {issue.attachments.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            Screenshots & Anhänge
                                        </p>
                                        <AttachmentList
                                            attachments={issue.attachments}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kommentare</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CommentThread
                                    comments={issue.comments}
                                    canViewInternal={
                                        abilities.viewInternalComments
                                    }
                                />
                                <CommentComposer
                                    currentUser={currentUser}
                                    canPostInternal={
                                        abilities.viewInternalComments
                                    }
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DefinitionList
                                    items={[
                                        {
                                            term: 'Verantwortlich',
                                            description: issue.assignee ? (
                                                <UserInline
                                                    user={issue.assignee}
                                                    size="xs"
                                                />
                                            ) : (
                                                '—'
                                            ),
                                        },
                                        {
                                            term: 'Reporter',
                                            description: (
                                                <UserInline
                                                    user={issue.reporter}
                                                    size="xs"
                                                />
                                            ),
                                        },
                                        {
                                            term: 'Melderschwere',
                                            description: (
                                                <IssueSeverityBadge
                                                    severity={issue.severity}
                                                    size="sm"
                                                />
                                            ),
                                        },
                                        {
                                            term: 'Release-Auswirkung',
                                            description: (
                                                <IssueImpactBadge
                                                    impact={issue.impact}
                                                    size="sm"
                                                />
                                            ),
                                        },
                                        {
                                            term: 'Release',
                                            description: (
                                                <Link
                                                    href={releaseRoutes.show.url(
                                                        issue.releaseId,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {issue.releaseName}
                                                </Link>
                                            ),
                                        },
                                        {
                                            term: 'Build',
                                            description: issue.buildLabel ? (
                                                <BuildBadge
                                                    build={{
                                                        label: issue.buildLabel,
                                                        commitSha: null,
                                                        status: 'deployed',
                                                    }}
                                                />
                                            ) : (
                                                '—'
                                            ),
                                        },
                                        {
                                            term: 'Verknüpfte Prüfung',
                                            description:
                                                issue.reviewItemTitle ?? '—',
                                        },
                                        {
                                            term: 'Getestete URL',
                                            description: issue.testedUrl ? (
                                                <a
                                                    href={issue.testedUrl}
                                                    className="break-all text-primary hover:underline"
                                                >
                                                    {issue.testedUrl}
                                                </a>
                                            ) : (
                                                '—'
                                            ),
                                        },
                                        {
                                            term: 'Erstellt',
                                            description: formatDateTime(
                                                issue.createdAt,
                                            ),
                                        },
                                    ]}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Statushistorie</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="flex flex-col gap-3">
                                    {[...issue.history]
                                        .reverse()
                                        .map((entry) => (
                                            <li
                                                key={entry.id}
                                                className="text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {entry.from && (
                                                        <>
                                                            <IssueStatusBadge
                                                                status={
                                                                    entry.from
                                                                }
                                                                size="sm"
                                                            />
                                                            <span className="text-muted-foreground">
                                                                →
                                                            </span>
                                                        </>
                                                    )}
                                                    <span className="font-medium">
                                                        {
                                                            issueStatusMeta[
                                                                entry.to
                                                            ].label
                                                        }
                                                    </span>
                                                </div>
                                                {entry.note && (
                                                    <p className="mt-1 text-muted-foreground">
                                                        {entry.note}
                                                    </p>
                                                )}
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {entry.actor.name} ·{' '}
                                                    {formatRelative(
                                                        entry.createdAt,
                                                    )}
                                                </p>
                                            </li>
                                        ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

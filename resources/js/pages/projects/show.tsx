import { Head, Link } from '@inertiajs/react';
import { ExternalLink, GitBranch, Rocket, Settings, Users } from 'lucide-react';

import { DefinitionList } from '@/components/definition-list';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import {
    EnvironmentBadge,
    ReleaseStatusBadge,
} from '@/components/status/badges';
import { ReviewProgress } from '@/components/status/progress-visuals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInline } from '@/components/user-avatar';
import { formatDate } from '@/lib/format';
import { organizationRoleMeta } from '@/lib/roles';
import { paths } from '@/lib/routes';
import { getProject, releasesForProject } from '@/mocks';

export default function ProjectShow({ id }: { id: string }) {
    const project = getProject(id);
    const releases = releasesForProject(project.id);
    const currentRelease = releases.find(
        (r) => !['completed', 'cancelled'].includes(r.status),
    );
    const pastReleases = releases.filter((r) =>
        ['completed', 'cancelled'].includes(r.status),
    );

    return (
        <>
            <Head title={project.name} />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Projekte', href: paths.projects.index },
                        { title: project.name },
                    ]}
                    title={project.name}
                    description={project.description ?? undefined}
                    actions={
                        <>
                            <Button variant="outline" asChild>
                                <Link
                                    href={paths.projects.settings(project.id)}
                                >
                                    <Settings /> Einstellungen
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={paths.releases.create}>
                                    <Rocket /> Neuer Release
                                </Link>
                            </Button>
                        </>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aktueller Release</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {currentRelease ? (
                                    <Link
                                        href={paths.releases.show(
                                            currentRelease.id,
                                        )}
                                        className="block rounded-lg border p-4 transition-colors hover:border-primary/40"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="font-medium">
                                                {currentRelease.name}{' '}
                                                <span className="font-normal text-muted-foreground">
                                                    {currentRelease.version}
                                                </span>
                                            </span>
                                            <ReleaseStatusBadge
                                                status={currentRelease.status}
                                                size="sm"
                                            />
                                        </div>
                                        {currentRelease.progress.total > 0 && (
                                            <div className="mt-3">
                                                <ReviewProgress
                                                    progress={
                                                        currentRelease.progress
                                                    }
                                                    showLegend={false}
                                                />
                                            </div>
                                        )}
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Go-live{' '}
                                            {formatDate(
                                                currentRelease.plannedGoLiveAt,
                                            )}
                                            {currentRelease.openBlockerCount >
                                                0 && (
                                                <span className="text-danger">
                                                    {' '}
                                                    ·{' '}
                                                    {
                                                        currentRelease.openBlockerCount
                                                    }{' '}
                                                    Go-live-Blocker
                                                </span>
                                            )}
                                        </p>
                                    </Link>
                                ) : (
                                    <EmptyState
                                        icon={Rocket}
                                        title="Kein aktiver Release"
                                        description="Lege einen neuen Release an, um mit dem Testen zu starten."
                                        compact
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Umgebungen</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {project.environments.map((env) => (
                                    <div
                                        key={env.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border p-3"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {env.name}
                                                </span>
                                                <EnvironmentBadge
                                                    type={env.type}
                                                    size="sm"
                                                />
                                                {env.isDefaultForTesting && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Standard für Tests
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={env.url}
                                                className="flex items-center gap-1 truncate text-sm text-primary hover:underline"
                                            >
                                                <ExternalLink className="size-3.5 shrink-0" />{' '}
                                                {env.url}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Vergangene Releases</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pastReleases.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Noch keine abgeschlossenen Releases.
                                    </p>
                                ) : (
                                    <ul className="divide-y">
                                        {pastReleases.map((release) => (
                                            <li
                                                key={release.id}
                                                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                            >
                                                <Link
                                                    href={paths.releases.show(
                                                        release.id,
                                                    )}
                                                    className="font-medium hover:underline"
                                                >
                                                    {release.name}{' '}
                                                    {release.version}
                                                </Link>
                                                <div className="flex items-center gap-3">
                                                    <ReleaseStatusBadge
                                                        status={release.status}
                                                        size="sm"
                                                    />
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            release.completedAt,
                                                        )}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
                                            term: 'Kunde',
                                            description: (
                                                <Link
                                                    href={paths.clients.show(
                                                        project.clientId,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {project.clientName}
                                                </Link>
                                            ),
                                        },
                                        {
                                            term: 'Project Manager',
                                            description: (
                                                <UserInline
                                                    user={
                                                        project.projectManager
                                                    }
                                                    size="xs"
                                                />
                                            ),
                                        },
                                        {
                                            term: 'Repository',
                                            description:
                                                project.repositoryUrl ? (
                                                    <a
                                                        href={
                                                            project.repositoryUrl
                                                        }
                                                        className="flex items-center gap-1 text-primary hover:underline"
                                                    >
                                                        <GitBranch className="size-3.5" />{' '}
                                                        Repository
                                                    </a>
                                                ) : (
                                                    '—'
                                                ),
                                        },
                                        {
                                            term: 'Angelegt',
                                            description: formatDate(
                                                project.createdAt,
                                            ),
                                        },
                                    ]}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle>Beteiligte</CardTitle>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link
                                        href={paths.projects.members(
                                            project.id,
                                        )}
                                    >
                                        <Users /> Verwalten
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {project.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-2"
                                    >
                                        <UserInline
                                            user={member.user}
                                            size="sm"
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {
                                                organizationRoleMeta[
                                                    member.role
                                                ].label
                                            }
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

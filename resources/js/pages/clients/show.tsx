import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    FolderKanban,
    Mail,
    Pencil,
    Phone,
    Rocket,
} from 'lucide-react';

import { AuditEventList } from '@/components/activity/audit-event-list';
import { DefinitionList } from '@/components/definition-list';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { ReleaseStatusBadge } from '@/components/status/badges';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { paths } from '@/lib/routes';
import {
    getClient,
    projectsForClient,
    recentActivity,
    releasesForProject,
} from '@/mocks';
import type { ClientStatus } from '@/types';

const statusLabel: Record<ClientStatus, string> = {
    active: 'Aktiv',
    prospect: 'Interessent',
    archived: 'Archiviert',
};

export default function ClientShow({ id }: { id: string }) {
    const client = getClient(id);
    const projects = projectsForClient(client.id);
    const releases = projects.flatMap((p) => releasesForProject(p.id));
    const activeReleases = releases.filter(
        (r) => !['completed', 'cancelled'].includes(r.status),
    );
    const activity = recentActivity.filter(
        (e) =>
            e.detail?.includes(client.name) || e.summary.includes(client.name),
    );

    return (
        <>
            <Head title={client.name} />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Kunden', href: paths.clients.index },
                        { title: client.name },
                    ]}
                    icon={
                        <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-lg font-semibold text-primary">
                            {client.name.charAt(0)}
                        </span>
                    }
                    title={client.name}
                    description={client.notes ?? undefined}
                    actions={
                        <>
                            <StatusBadge
                                meta={{
                                    label: statusLabel[client.status],
                                    tone:
                                        client.status === 'active'
                                            ? 'success'
                                            : 'neutral',
                                    icon: Building2,
                                }}
                                showIcon={false}
                            />
                            <Button variant="outline" asChild>
                                <Link href={paths.clients.edit(client.id)}>
                                    <Pencil /> Bearbeiten
                                </Link>
                            </Button>
                        </>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle>Projekte</CardTitle>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href={paths.projects.create}>
                                        <FolderKanban /> Projekt anlegen
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {projects.length === 0 ? (
                                    <EmptyState
                                        icon={FolderKanban}
                                        title="Noch keine Projekte"
                                        description="Für diesen Kunden wurde noch kein Projekt angelegt."
                                        compact
                                    />
                                ) : (
                                    projects.map((project) => (
                                        <Link
                                            key={project.id}
                                            href={paths.projects.show(
                                                project.id,
                                            )}
                                            className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    {project.name}
                                                </p>
                                                <p className="truncate text-sm text-muted-foreground">
                                                    {project.description}
                                                </p>
                                            </div>
                                            <span className="shrink-0 text-sm text-muted-foreground">
                                                {project.openIssueCount} offene
                                                Issues
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Aktive Releases</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {activeReleases.length === 0 ? (
                                    <EmptyState
                                        icon={Rocket}
                                        title="Keine aktiven Releases"
                                        compact
                                    />
                                ) : (
                                    activeReleases.map((release) => (
                                        <Link
                                            key={release.id}
                                            href={paths.releases.show(
                                                release.id,
                                            )}
                                            className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {release.name}{' '}
                                                    <span className="font-normal text-muted-foreground">
                                                        · {release.projectName}
                                                    </span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Go-live{' '}
                                                    {formatDate(
                                                        release.plannedGoLiveAt,
                                                    )}
                                                </p>
                                            </div>
                                            <ReleaseStatusBadge
                                                status={release.status}
                                                size="sm"
                                            />
                                        </Link>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basisinformationen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DefinitionList
                                    items={[
                                        {
                                            term: 'Referenz',
                                            description:
                                                client.reference ?? '—',
                                        },
                                        {
                                            term: 'Domain',
                                            description:
                                                client.primaryDomain ? (
                                                    <a
                                                        href={`https://${client.primaryDomain}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {client.primaryDomain}
                                                    </a>
                                                ) : (
                                                    '—'
                                                ),
                                        },
                                        {
                                            term: 'Status',
                                            description:
                                                statusLabel[client.status],
                                        },
                                        {
                                            term: 'Kunde seit',
                                            description: formatDate(
                                                client.createdAt,
                                            ),
                                        },
                                    ]}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kontakte</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {client.contacts.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Keine Kontakte hinterlegt.
                                    </p>
                                ) : (
                                    client.contacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            className="rounded-lg border p-3"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-medium">
                                                    {contact.name}
                                                </span>
                                                {contact.isPrimary && (
                                                    <span className="text-xs font-medium text-primary">
                                                        Hauptkontakt
                                                    </span>
                                                )}
                                            </div>
                                            {contact.role && (
                                                <p className="text-sm text-muted-foreground">
                                                    {contact.role}
                                                </p>
                                            )}
                                            <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="flex items-center gap-1.5 hover:text-foreground"
                                                >
                                                    <Mail className="size-3.5" />{' '}
                                                    {contact.email}
                                                </a>
                                                {contact.phone && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Phone className="size-3.5" />{' '}
                                                        {contact.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Letzte Aktivitäten</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activity.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Keine aktuellen Aktivitäten.
                                    </p>
                                ) : (
                                    <AuditEventList events={activity} />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

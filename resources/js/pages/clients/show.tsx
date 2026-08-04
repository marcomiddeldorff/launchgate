import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

import { DefinitionList } from '@/components/definition-list';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/format';
import { hasOrganizationRoles } from '@/lib/permissions';
import clientRoutes from '@/routes/clients';
import { OrganizationRole } from '@/types';
import type { Client, ClientStatus } from '@/types';

const statusLabel: Record<ClientStatus, string> = {
    active: 'Aktiv',
    prospect: 'Interessent',
    archived: 'Archiviert',
};

type ClientsShowProps = {
    client: Client;
};
export default function ClientShow({ client }: ClientsShowProps) {
    const activity = [];

    const deleteClient = () => {
        router.delete(clientRoutes.destroy(client));
    };

    return (
        <>
            <Head title={client.name} />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Kunden', href: clientRoutes.index.url() },
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
                            {hasOrganizationRoles(OrganizationRole.Admin) && (
                                <>
                                    <Button variant="outline" asChild>
                                        <Link
                                            href={clientRoutes.edit.url(
                                                client.id,
                                            )}
                                        >
                                            <Pencil /> Bearbeiten
                                        </Link>
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash />
                                                Löschen
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Kunden löschen?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Sämtliche Daten des Kunden,
                                                    einschließlich der Projekte
                                                    und dessen Inhalte gehen
                                                    durch die Löschung verloren
                                                    und können <b>nicht</b>{' '}
                                                    wiederhergestellt werden.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">
                                                        Abbrechen
                                                    </Button>
                                                </DialogClose>

                                                <Button
                                                    onClick={deleteClient}
                                                    variant="destructive"
                                                >
                                                    Kunden löschen
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {/*    <Card>*/}
                        {/*        <CardHeader className="flex-row items-center justify-between">*/}
                        {/*            <CardTitle>Projekte</CardTitle>*/}
                        {/*            <Button size="sm" variant="ghost" asChild>*/}
                        {/*                <Link href={projectRoutes.create.url()}>*/}
                        {/*                    <FolderKanban /> Projekt anlegen*/}
                        {/*                </Link>*/}
                        {/*            </Button>*/}
                        {/*        </CardHeader>*/}
                        {/*        <CardContent className="flex flex-col gap-3">*/}
                        {/*            {projects.length === 0 ? (*/}
                        {/*                <EmptyState*/}
                        {/*                    icon={FolderKanban}*/}
                        {/*                    title="Noch keine Projekte"*/}
                        {/*                    description="Für diesen Kunden wurde noch kein Projekt angelegt."*/}
                        {/*                    compact*/}
                        {/*                />*/}
                        {/*            ) : (*/}
                        {/*                projects.map((project) => (*/}
                        {/*                    <Link*/}
                        {/*                        key={project.id}*/}
                        {/*                        href={projectRoutes.show.url(*/}
                        {/*                            project.id,*/}
                        {/*                        )}*/}
                        {/*                        className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40"*/}
                        {/*                    >*/}
                        {/*                        <div className="min-w-0">*/}
                        {/*                            <p className="font-medium">*/}
                        {/*                                {project.name}*/}
                        {/*                            </p>*/}
                        {/*                            <p className="truncate text-sm text-muted-foreground">*/}
                        {/*                                {project.description}*/}
                        {/*                            </p>*/}
                        {/*                        </div>*/}
                        {/*                        <span className="shrink-0 text-sm text-muted-foreground">*/}
                        {/*                            {project.openIssueCount} offene*/}
                        {/*                            Issues*/}
                        {/*                        </span>*/}
                        {/*                    </Link>*/}
                        {/*                ))*/}
                        {/*            )}*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}

                        {/*    <Card>*/}
                        {/*        <CardHeader>*/}
                        {/*            <CardTitle>Aktive Releases</CardTitle>*/}
                        {/*        </CardHeader>*/}
                        {/*        <CardContent className="flex flex-col gap-3">*/}
                        {/*            {activeReleases.length === 0 ? (*/}
                        {/*                <EmptyState*/}
                        {/*                    icon={Rocket}*/}
                        {/*                    title="Keine aktiven Releases"*/}
                        {/*                    compact*/}
                        {/*                />*/}
                        {/*            ) : (*/}
                        {/*                activeReleases.map((release) => (*/}
                        {/*                    <Link*/}
                        {/*                        key={release.id}*/}
                        {/*                        href={releaseRoutes.show.url(*/}
                        {/*                            release.id,*/}
                        {/*                        )}*/}
                        {/*                        className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40"*/}
                        {/*                    >*/}
                        {/*                        <div>*/}
                        {/*                            <p className="font-medium">*/}
                        {/*                                {release.name}{' '}*/}
                        {/*                                <span className="font-normal text-muted-foreground">*/}
                        {/*                                    · {release.projectName}*/}
                        {/*                                </span>*/}
                        {/*                            </p>*/}
                        {/*                            <p className="text-sm text-muted-foreground">*/}
                        {/*                                Go-live{' '}*/}
                        {/*                                {formatDate(*/}
                        {/*                                    release.plannedGoLiveAt,*/}
                        {/*                                )}*/}
                        {/*                            </p>*/}
                        {/*                        </div>*/}
                        {/*                        <ReleaseStatusBadge*/}
                        {/*                            status={release.status}*/}
                        {/*                            size="sm"*/}
                        {/*                        />*/}
                        {/*                    </Link>*/}
                        {/*                ))*/}
                        {/*            )}*/}
                        {/*        </CardContent>*/}
                        {/*    </Card>*/}
                        {/*</div>*/}

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
                                                    client.primary_domain ? (
                                                        <a
                                                            href={`https://${client.primary_domain}`}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {
                                                                client.primary_domain
                                                            }
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
                                                    client.created_at,
                                                ),
                                            },
                                        ]}
                                    />
                                </CardContent>
                            </Card>

                            {/*<Card>*/}
                            {/*    <CardHeader>*/}
                            {/*        <CardTitle>Kontakte</CardTitle>*/}
                            {/*    </CardHeader>*/}
                            {/*    <CardContent className="flex flex-col gap-3">*/}
                            {/*        {client.contacts.length === 0 ? (*/}
                            {/*            <p className="text-sm text-muted-foreground">*/}
                            {/*                Keine Kontakte hinterlegt.*/}
                            {/*            </p>*/}
                            {/*        ) : (*/}
                            {/*            client.contacts.map((contact) => (*/}
                            {/*                <div*/}
                            {/*                    key={contact.id}*/}
                            {/*                    className="rounded-lg border p-3"*/}
                            {/*                >*/}
                            {/*                    <div className="flex items-center justify-between gap-2">*/}
                            {/*                        <span className="font-medium">*/}
                            {/*                            {contact.name}*/}
                            {/*                        </span>*/}
                            {/*                        {contact.isPrimary && (*/}
                            {/*                            <span className="text-xs font-medium text-primary">*/}
                            {/*                                Hauptkontakt*/}
                            {/*                            </span>*/}
                            {/*                        )}*/}
                            {/*                    </div>*/}
                            {/*                    {contact.role && (*/}
                            {/*                        <p className="text-sm text-muted-foreground">*/}
                            {/*                            {contact.role}*/}
                            {/*                        </p>*/}
                            {/*                    )}*/}
                            {/*                    <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">*/}
                            {/*                        <a*/}
                            {/*                            href={`mailto:${contact.email}`}*/}
                            {/*                            className="flex items-center gap-1.5 hover:text-foreground"*/}
                            {/*                        >*/}
                            {/*                            <Mail className="size-3.5" />{' '}*/}
                            {/*                            {contact.email}*/}
                            {/*                        </a>*/}
                            {/*                        {contact.phone && (*/}
                            {/*                            <span className="flex items-center gap-1.5">*/}
                            {/*                                <Phone className="size-3.5" />{' '}*/}
                            {/*                                {contact.phone}*/}
                            {/*                            </span>*/}
                            {/*                        )}*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*            ))*/}
                            {/*        )}*/}
                            {/*    </CardContent>*/}
                            {/*</Card>*/}

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
                                        <div></div>
                                        // <AuditEventList events={activity} />
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

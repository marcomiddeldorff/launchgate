import { Head, Link, router } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import type { DataTableColumn } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { hasOrganizationRoles } from '@/lib/permissions';
import type { StatusTone } from '@/lib/status';
import clientRoutes from '@/routes/clients';
import type { Client, ClientStatus } from '@/types';
import { OrganizationRole } from '@/types';
import { Callout } from '@/components/callout';

const clientStatusMeta: Record<
    ClientStatus,
    { label: string; tone: StatusTone }
> = {
    active: { label: 'Aktiv', tone: 'success' },
    prospect: { label: 'Interessent', tone: 'info' },
    archived: { label: 'Archiviert', tone: 'neutral' },
};

function ClientStatusBadge({ status }: { status: ClientStatus }) {
    const meta = clientStatusMeta[status];

    return (
        <StatusBadge
            meta={{ label: meta.label, tone: meta.tone, icon: Building2 }}
            showIcon={false}
            size="sm"
        />
    );
}

type ClientsIndexProps = {
    clients: Client[];
};

export default function ClientsIndex({ clients }: ClientsIndexProps) {
    const columns: DataTableColumn<Client>[] = [
        {
            id: 'name',
            header: 'Kunde',
            cell: (c) => (
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                        {c.name.charAt(0)}
                    </span>
                    <div>
                        <p className="font-medium">{c.name}</p>
                        {c.primary_domain && (
                            <p className="text-sm text-muted-foreground">
                                {c.primary_domain}
                            </p>
                        )}
                    </div>
                </div>
            ),
            sortValue: (c) => c.name,
        },
        {
            id: 'reference',
            header: 'Referenz',
            cell: (c) => (
                <span className="text-sm text-muted-foreground">
                    {c.reference ?? '—'}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (c) => <ClientStatusBadge status={c.status} />,
            hideOnMobile: true,
        },
        /*{
            id: 'projects',
            header: 'Projekte',
            cell: (c) => <span className="tabular-nums">{c.projectCount}</span>,
            sortValue: (c) => c.projectCount,
            align: 'center',
            hideOnMobile: true,
        },*/
        // {
        //     id: 'releases',
        //     header: 'Aktive Releases',
        //     cell: (c) => (
        //         <span className="tabular-nums">{c.activeReleaseCount}</span>
        //     ),
        //     sortValue: (c) => c.activeReleaseCount,
        //     align: 'center',
        //     hideOnMobile: true,
        // },
        {
            id: 'created',
            header: 'Kunde seit',
            cell: (c) => (
                <span className="text-sm text-muted-foreground">
                    {formatDate(c.created_at)}
                </span>
            ),
            sortValue: (c) => c.created_at,
            hideOnMobile: true,
        },
    ];

    return (
        <>
            <Head title="Kunden" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Kunden' }]}
                    title="Kunden"
                    description="Die Auftraggeber, für die deine Organisation Releases prüft und freigibt."
                    actions={
                        hasOrganizationRoles(OrganizationRole.Admin) && (
                            <Button asChild>
                                <Link href={clientRoutes.create.url()}>
                                    <Plus /> Kunde anlegen
                                </Link>
                            </Button>
                        )
                    }
                />

                <Callout variant="error" title="Kundenlimit erreicht">
                    Sie haben das Limit von 3 Kunden erreicht. Upgraden Sie
                    Ihren Plan, um weitere Kunden anlegen zu können.{' '}
                    <Link className="text-primary underline">Upgrade Plan</Link>
                </Callout>

                <DataTable
                    columns={columns}
                    rows={clients}
                    getRowId={(c) => c.id}
                    onRowClick={(c) =>
                        router.visit(clientRoutes.show.url(c.id))
                    }
                    searchAccessor={(c) =>
                        `${c.name} ${c.primary_domain} ${c.reference}`
                    }
                    searchPlaceholder="Kunden durchsuchen …"
                    initialSort={{ columnId: 'name', dir: 'asc' }}
                    emptyState={
                        <EmptyState
                            icon={Building2}
                            title="Noch keine Kunden"
                            description="Lege deinen ersten Kunden an, um Projekte und Releases zuzuordnen."
                            action={
                                <Button asChild size="sm">
                                    <Link href={clientRoutes.create.url()}>
                                        Kunde anlegen
                                    </Link>
                                </Button>
                            }
                            compact
                        />
                    }
                    renderMobileCard={(c) => (
                        <Card className="gap-2 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">{c.name}</span>
                                <ClientStatusBadge status={c.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {c.primary_domain ?? '—'}
                            </p>
                            {/*<p className="text-xs text-muted-foreground">*/}
                            {/*    {c.projectCount} Projekte ·{' '}*/}
                            {/*    {c.activeReleaseCount} aktive Releases*/}
                            {/*</p>*/}
                        </Card>
                    )}
                />
            </div>
        </>
    );
}

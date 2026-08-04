import { Head, Link, router, usePage } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import { Callout } from '@/components/callout';
import { DataTable } from '@/components/data-table';
import type { DataTableColumn } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import * as orgs from '@/routes/organizations';
import type { Organization } from '@/types';

export default function OrganizationsIndex() {
    const { organizations } = usePage<{ organizations: Organization[] }>()
        .props;

    const columns: DataTableColumn<Organization>[] = [
        {
            id: 'name',
            header: 'Name',
            cell: (c) => (
                <div className="flex items-center gap-3">
                    {c.logo_url ? (
                        <img width="20" src={c.logo_url} alt={c.name} />
                    ) : (
                        <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                            {c.name.charAt(0)}
                        </span>
                    )}
                    {c.name}
                </div>
            ),
            sortValue: (c) => c.name,
        },
        {
            id: 'slug',
            header: 'Slug',
            cell: (c) => (
                <span className="text-sm text-muted-foreground">
                    {c.slug ?? '—'}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'members',
            header: 'Mitglieder',
            cell: (c) => (
                <span className="tabular-nums">{c.memberships_count}</span>
            ),
            sortValue: (c) => c.default_locale,
            align: 'center',
            hideOnMobile: true,
        },
        {
            id: 'created_at',
            header: 'Erstellt am',
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
            <Head title="Organisationen" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Organisationen' }]}
                    title="Organisationen"
                    description="Die Organisationen, für die du Releases prüfst und freigibst."
                    actions={
                        <Button asChild>
                            <Link href={orgs.create.url()}>
                                <Plus /> Organisation anlegen
                            </Link>
                        </Button>
                    }
                />

                <Callout title="Limit erreicht" variant="error">
                    Du hast das Limit von 3 Organisationen erreicht. Bitte
                    lösche eine Organisation, um eine neue anzulegen.
                </Callout>

                <DataTable
                    columns={columns}
                    rows={organizations}
                    getRowId={(o) => o.id}
                    onRowClick={(o) =>
                        router.visit(orgs.show({ organization: o.id }).url)
                    }
                    emptyState={
                        <EmptyState
                            icon={Building2}
                            title="Noch keine Organisationen"
                            description="Lege deine erste Organisation an, um Projekte und Releases zuzuordnen."
                            action={
                                <Button asChild size="sm">
                                    <Link href={orgs.create.url()}>
                                        Organisation anlegen
                                    </Link>
                                </Button>
                            }
                            compact
                        />
                    }
                />
            </div>
        </>
    );
}

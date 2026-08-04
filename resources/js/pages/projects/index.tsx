import { Head, Link, router } from '@inertiajs/react';
import { FolderKanban, Plus } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import type { DataTableColumn } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserInline } from '@/components/user-avatar';
import type { StatusTone } from '@/lib/status';
import projectRoutes from '@/routes/projects';
import type { Project, ProjectStatus } from '@/types';

const projectStatusMeta: Record<
    ProjectStatus,
    { label: string; tone: StatusTone }
> = {
    active: { label: 'Aktiv', tone: 'success' },
    on_hold: { label: 'Pausiert', tone: 'warning' },
    archived: { label: 'Archiviert', tone: 'neutral' },
};

type ProjectsIndexProps = {
    projects: Project[];
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const columns: DataTableColumn<Project>[] = [
        {
            id: 'name',
            header: 'Projekt',
            cell: (p) => (
                <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {p.client.name}
                    </p>
                </div>
            ),
            sortValue: (p) => p.name,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (p) => {
                const m = projectStatusMeta[p.status];

                return (
                    <StatusBadge
                        meta={{
                            label: m.label,
                            tone: m.tone,
                            icon: FolderKanban,
                        }}
                        showIcon={false}
                        size="sm"
                    />
                );
            },
            hideOnMobile: true,
        },
        // {
        //     id: 'release',
        //     header: 'Aktiver Release',
        //     cell: (p) => (
        //         <span className="text-sm text-muted-foreground">
        //             {p.activeReleaseName ?? '—'}
        //         </span>
        //     ),
        //     hideOnMobile: true,
        // },
        // {
        //     id: 'issues',
        //     header: 'Offene Issues',
        //     cell: (p) => (
        //         <span
        //             className={
        //                 p.openIssueCount > 0
        //                     ? 'font-medium tabular-nums'
        //                     : 'text-muted-foreground tabular-nums'
        //             }
        //         >
        //             {p.openIssueCount}
        //         </span>
        //     ),
        //     sortValue: (p) => p.openIssueCount,
        //     align: 'center',
        //     hideOnMobile: true,
        // },
        {
            id: 'pm',
            header: 'Projektmanager',
            cell: (p) => <UserInline user={p.project_manager} size="xs" />,
            hideOnMobile: true,
        },
    ];

    return (
        <>
            <Head title="Projekte" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Projekte' }]}
                    title="Projekte"
                    description="Die Anwendungen und Produkte, deren Releases hier geprüft werden."
                    actions={
                        <Button asChild>
                            <Link href={projectRoutes.create.url()}>
                                <Plus /> Projekt anlegen
                            </Link>
                        </Button>
                    }
                />

                <DataTable
                    columns={columns}
                    rows={projects}
                    getRowId={(p) => p.id}
                    onRowClick={(p) =>
                        router.visit(projectRoutes.show.url(p.id))
                    }
                    searchAccessor={(p) => `${p.name} ${p.client.name}`}
                    searchPlaceholder="Projekte durchsuchen …"
                    initialSort={{ columnId: 'name', dir: 'asc' }}
                    emptyState={
                        <EmptyState
                            icon={FolderKanban}
                            title="Noch keine Projekte"
                            description="Lege ein Projekt an, um Releases und Prüfungen zu organisieren."
                            action={
                                <Button asChild size="sm">
                                    <Link href={projectRoutes.create.url()}>
                                        Projekt anlegen
                                    </Link>
                                </Button>
                            }
                            compact
                        />
                    }
                    renderMobileCard={(p) => (
                        <Card className="gap-2 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">{p.name}</span>
                                <StatusBadge
                                    meta={{
                                        label: projectStatusMeta[p.status]
                                            .label,
                                        tone: projectStatusMeta[p.status].tone,
                                        icon: FolderKanban,
                                    }}
                                    showIcon={false}
                                    size="sm"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {p.client.name}
                            </p>
                            {/*<p className="text-xs text-muted-foreground">*/}
                            {/*    {p.activeReleaseName ?? 'Kein aktiver Release'}{' '}*/}
                            {/*    · {p.openIssueCount} offene Issues*/}
                            {/*</p>*/}
                        </Card>
                    )}
                />
            </div>
        </>
    );
}

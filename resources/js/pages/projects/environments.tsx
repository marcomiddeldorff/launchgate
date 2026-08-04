import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Code2,
    Pencil,
    Trash,
} from 'lucide-react';
import environmentController from '@/actions/App/Http/Controllers/EnvironmentController';
import { PageHeader } from '@/components/page-header';
import ProjectTabs from '@/components/project-tabs';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hasProjectRole } from '@/lib/permissions';
import type { StatusMeta } from '@/lib/status';
import projectRoutes from '@/routes/projects';
import type { Environment, Project} from '@/types';
import { ProjectRole } from '@/types';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const environmentTypeStatusMeta: Record<string, StatusMeta> = {
    production: {
        label: 'Produktion',
        tone: 'primary',
        icon: CheckCircle,
    },
    staging: {
        label: 'Staging',
        tone: 'warning',
        icon: AlertCircle
    }
}

type ProjectEnvironmentsProps = {
    project: Project;
}

export default function ProjectEnvironments({ project }: ProjectEnvironmentsProps) {

    const deleteEnvironment = (environment: Environment) => {

        router.delete(environmentController.destroy.url({
            project,
            environment
        }));
    }

    return (
        <>
            <Head title={`Einstellungen · ${project.name}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Projekte', href: projectRoutes.index.url() },
                        {
                            title: project.name,
                            href: projectRoutes.show.url(project.id),
                        },
                        { title: 'Einstellungen' },
                    ]}
                    title="Projekteinstellungen"
                    description={project.name}
                />

                <ProjectTabs project={project} active="environments" />

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Umgebungen</CardTitle>
                        {hasProjectRole(
                            project,
                            ProjectRole.ProjectManager,
                        ) && (
                            <Button size="sm" asChild>
                                <Link
                                    href={environmentController.create.url(
                                        project.id,
                                    )}
                                >
                                    <Code2 />
                                    Umgebung erstellen
                                </Link>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="divide-y">
                        {project.environments.map((e) => (
                            <div
                                key={e.id}
                                className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                            >
                                <div className="flex items-center gap-4">
                                    <p className="mb-0.5">{e.name}</p>
                                    <small>
                                        <StatusBadge
                                            meta={
                                                environmentTypeStatusMeta[
                                                    e.type
                                                ]
                                            }
                                        >
                                            {e.type}
                                        </StatusBadge>
                                    </small>
                                </div>

                                <div className="flex items-center gap-6">
                                    <Link
                                        className="text-sm text-muted-foreground underline"
                                        href={e.url ?? '#'}
                                    >
                                        {e.url}
                                    </Link>
                                    {e.is_default_for_testing && (
                                        <StatusBadge
                                            meta={{
                                                label: "Standard für's Testen",
                                                tone: 'warning',
                                                icon: AlertTriangle,
                                            }}
                                        />
                                    )}

                                    {e.is_active ? (
                                        <StatusBadge
                                            meta={{
                                                label: 'Aktiv',
                                                tone: 'success',
                                                icon: CheckCircle,
                                            }}
                                        />
                                    ) : (
                                        <StatusBadge
                                            meta={{
                                                label: 'Inaktiv',
                                                tone: 'danger',
                                                icon: AlertCircle,
                                            }}
                                        />
                                    )}

                                    {hasProjectRole(project, [
                                        ProjectRole.ProjectManager,
                                        ProjectRole.Developer,
                                    ]) && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(
                                                        environmentController.edit(
                                                            {
                                                                project,
                                                                environment: e,
                                                            },
                                                        ).url,
                                                    )
                                                }
                                            >
                                                <Pencil />
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                    >
                                                        <Trash />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Umgebung "{e.name}"
                                                            löschen?
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Beim Löschen der
                                                            Umgebung bleiben
                                                            Releases, sowie
                                                            Builds und
                                                            anderweitige
                                                            Ressourcen,
                                                            erhalten, die dieser
                                                            Umgebung zugeordnet
                                                            sind.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                            >
                                                                Abbrechen
                                                            </Button>
                                                        </DialogClose>

                                                        <Button
                                                            onClick={() =>
                                                                deleteEnvironment(
                                                                    e,
                                                                )
                                                            }
                                                            variant="destructive"
                                                        >
                                                            Löschen
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

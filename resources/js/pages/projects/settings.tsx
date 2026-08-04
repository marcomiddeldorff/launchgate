import { Head, router, useForm } from '@inertiajs/react';
import { Archive, ExternalLink, LoaderCircle, Plus } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import { toast } from 'sonner';
import archiveProjectController from '@/actions/App/Http/Controllers/Projects/ArchiveProjectController';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import ProjectTabs from '@/components/project-tabs';
import { EnvironmentBadge } from '@/components/status/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { hasProjectRole } from '@/lib/permissions';
import projectRoutes from '@/routes/projects';
import type {
    Locales,
    Organization,
    OrganizationMembership,
    Project} from '@/types';
import  { ProjectRole,
} from '@/types';
import { ProjectStatus } from '@/types/enums/project-status';

type ProjectSettingsProps = {
    project: Project;
    projectManager: OrganizationMembership[];
    timezones: string[];
    organization: Organization;
    locales: Locales[];
}

export default function ProjectSettings({
    project,
    projectManager,
    timezones,
    locales
}: ProjectSettingsProps) {
    const tab = 'general';

    const { data, setData, errors, processing, put } = useForm({
        name: project.name,
        description: project.description ?? '',
        repository_url: project.repository_url ?? '',
        timezone: project.timezone,
        default_locale: project.default_locale,
        project_manager_user_id: project.project_manager_user_id,
        status: project.status,
    })

    const save: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        put(projectRoutes.update(project.id).url, {
            preserveScroll: true,
        });
    };

    const archiveProject = () => {
        router.put(archiveProjectController.url(project.id));
    }

    const canUpdate = hasProjectRole(project, ProjectRole.ProjectManager);
    const canArchive = hasProjectRole(project, ProjectRole.ProjectManager);

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

                <ProjectTabs project={project} active="general" />

                <Card>
                    <CardHeader>
                        <CardTitle>Allgemein</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={save} className="space-y-5">
                            <FormField id="name" label="Projektname" required>
                                <Input
                                    disabled={!canUpdate}
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />

                                <InputError message={errors.name} />
                            </FormField>

                            <FormField id="status" label="Status" required>
                                <Select
                                    disabled={!canUpdate}
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData(
                                            'status',
                                            value as ProjectStatus,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem
                                                value={ProjectStatus.Active}
                                            >
                                                Aktiv
                                            </SelectItem>
                                            <SelectItem
                                                value={ProjectStatus.Archived}
                                            >
                                                Archiviert
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </FormField>

                            <FormField id="description" label="Beschreibung">
                                <Textarea
                                    disabled={!canUpdate}
                                    id="description"
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                <InputError message={errors.description} />
                            </FormField>
                            <FormField id="repo" label="Repository-URL">
                                <Input
                                    disabled={!canUpdate}
                                    id="repo"
                                    type="url"
                                    value={data.repository_url}
                                    onChange={(e) =>
                                        setData(
                                            'repository_url',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.repository_url} />
                            </FormField>

                            <FormField
                                id="project_manager"
                                label="Projektmanager"
                                required
                            >
                                <Select
                                    disabled={!canUpdate}
                                    value={data.project_manager_user_id}
                                    onValueChange={(value) =>
                                        setData(
                                            'project_manager_user_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {projectManager.map((pm) => (
                                                <SelectItem
                                                    value={pm.user.id}
                                                    key={pm.user.id}
                                                >
                                                    {pm.user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.project_manager_user_id}
                                />
                            </FormField>

                            <FormField
                                id="default_locale"
                                label="Standard-Sprache"
                                required
                            >
                                <Select
                                    disabled={!canUpdate}
                                    value={data.default_locale}
                                    onValueChange={(value) =>
                                        setData('default_locale', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {locales.map((locale) => (
                                                <SelectItem
                                                    value={locale.locale}
                                                    key={locale.locale}
                                                >
                                                    {locale.localizedName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.default_locale} />
                            </FormField>

                            <FormField id="timezone" label="Zeitzone" required>
                                <Select
                                    disabled={!canUpdate}
                                    value={data.timezone}
                                    onValueChange={(value) =>
                                        setData('timezone', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {timezones.map((timezone) => (
                                                <SelectItem
                                                    value={timezone}
                                                    key={timezone}
                                                >
                                                    {timezone}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.timezone} />
                            </FormField>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing || !canUpdate}>
                                    {processing && <LoaderCircle />}
                                    Speichern
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-danger/30">
                    <CardHeader>
                        <CardTitle className="text-danger">
                            Projekt archivieren
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            Archivierte Projekte sind schreibgeschützt, bleiben
                            aber einsehbar.
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    disabled={!canArchive}
                                    variant="outline"
                                    className="border-danger/40 text-danger hover:bg-danger/10"
                                >
                                    <Archive /> Archivieren
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Projekt archivieren?
                                    </DialogTitle>
                                    <DialogDescription>
                                        Durch das Archivieren des Projektes kann
                                        dieses nicht länger bearbeitet werden.
                                        Alle Inhalte bleiben jedoch weiterhin
                                        einsehbar. Sie können das Projekt
                                        jederzeit wiederherstellen.
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Abbrechen
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={!canArchive} onClick={archiveProject}>
                                        Archivieren
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {tab === 'environments' && (
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Umgebungen</CardTitle>
                            <Button
                                size="sm"
                                onClick={() =>
                                    toast.info('Umgebung hinzufügen folgt.')
                                }
                            >
                                <Plus /> Hinzufügen
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {project.environments.map((env) => (
                                <div
                                    key={env.id}
                                    className="rounded-lg border p-3"
                                >
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
                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        <ExternalLink className="size-3.5" />{' '}
                                        {env.url}
                                    </a>
                                    {env.accessNotes && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {env.accessNotes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { Archive, ExternalLink, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { PageHeader } from '@/components/page-header';
import { EnvironmentBadge } from '@/components/status/badges';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserInline } from '@/components/user-avatar';
import { organizationRoleMeta } from '@/lib/roles';
import { paths } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { getProject } from '@/mocks';

type Tab = 'general' | 'members' | 'environments';

export default function ProjectSettings({
    id,
    tab = 'general',
}: {
    id: string;
    tab?: Tab;
}) {
    const project = getProject(id);

    const tabs: { id: Tab; label: string; href: string }[] = [
        {
            id: 'general',
            label: 'Allgemein',
            href: paths.projects.settings(project.id),
        },
        {
            id: 'members',
            label: 'Mitglieder',
            href: paths.projects.members(project.id),
        },
        {
            id: 'environments',
            label: 'Umgebungen',
            href: paths.projects.environments(project.id),
        },
    ];

    const save = (event: FormEvent) => {
        event.preventDefault();
        toast.success('Projekt aktualisiert.');
    };

    return (
        <>
            <Head title={`Einstellungen · ${project.name}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Projekte', href: paths.projects.index },
                        {
                            title: project.name,
                            href: paths.projects.show(project.id),
                        },
                        { title: 'Einstellungen' },
                    ]}
                    title="Projekteinstellungen"
                    description={project.name}
                />

                <nav
                    className="flex gap-1 overflow-x-auto border-b"
                    aria-label="Projekteinstellungen"
                >
                    {tabs.map((t) => (
                        <Link
                            key={t.id}
                            href={t.href}
                            className={cn(
                                '-mb-px border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                                tab === t.id
                                    ? 'border-primary text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                            aria-current={tab === t.id ? 'page' : undefined}
                        >
                            {t.label}
                        </Link>
                    ))}
                </nav>

                {tab === 'general' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Allgemein</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={save} className="space-y-5">
                                    <FormField
                                        id="name"
                                        label="Projektname"
                                        required
                                    >
                                        <Input
                                            id="name"
                                            defaultValue={project.name}
                                            required
                                        />
                                    </FormField>
                                    <FormField
                                        id="description"
                                        label="Beschreibung"
                                    >
                                        <Textarea
                                            id="description"
                                            rows={3}
                                            defaultValue={
                                                project.description ?? ''
                                            }
                                        />
                                    </FormField>
                                    <FormField id="repo" label="Repository-URL">
                                        <Input
                                            id="repo"
                                            type="url"
                                            defaultValue={
                                                project.repositoryUrl ?? ''
                                            }
                                        />
                                    </FormField>
                                    <div className="flex justify-end">
                                        <Button type="submit">Speichern</Button>
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
                                    Archivierte Projekte sind schreibgeschützt,
                                    bleiben aber einsehbar.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-danger/40 text-danger hover:bg-danger/10"
                                    onClick={() =>
                                        toast.warning(
                                            'Projekt archiviert (Demo).',
                                        )
                                    }
                                >
                                    <Archive /> Archivieren
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}

                {tab === 'members' && (
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Mitglieder</CardTitle>
                            <Button
                                size="sm"
                                onClick={() =>
                                    toast.info('Mitglied hinzufügen folgt.')
                                }
                            >
                                <Plus /> Hinzufügen
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-col divide-y">
                            {project.members.map((member) => {
                                const roleMeta =
                                    organizationRoleMeta[member.role];

                                return (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <UserInline
                                            user={member.user}
                                            secondary={member.user.email}
                                        />
                                        <div className="flex items-center gap-3">
                                            {member.canViewInternalComments && (
                                                <span className="hidden text-xs text-muted-foreground sm:inline">
                                                    Interne Kommentare
                                                </span>
                                            )}
                                            <StatusBadge
                                                meta={{
                                                    label: roleMeta.label,
                                                    tone: roleMeta.tone,
                                                    icon: Plus,
                                                }}
                                                showIcon={false}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

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

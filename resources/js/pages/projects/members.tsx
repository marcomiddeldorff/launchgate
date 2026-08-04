import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import ProjectMemberInvite from '@/components/project-member-invite';
import ProjectTabs from '@/components/project-tabs';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInline } from '@/components/user-avatar';
import { hasProjectRole } from '@/lib/permissions';
import { projectRoleMeta } from '@/lib/roles';
import projectRoutes from '@/routes/projects';
import type { OrganizationMembership, Project} from '@/types';
import { ProjectRole } from '@/types';


type ProjectMembersProps = {
    project: Project;
    organizationMembers: OrganizationMembership[];
}

export default function ProjectMembers({ project, organizationMembers }: ProjectMembersProps) {

    const canInviteUser = hasProjectRole(project, ProjectRole.ProjectManager);
    const canEditUser = hasProjectRole(project, ProjectRole.ProjectManager);
    const canRemoveUser = hasProjectRole(project, ProjectRole.ProjectManager);

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

                <ProjectTabs project={project} active="members" />

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Mitglieder</CardTitle>
                        {canInviteUser && <ProjectMemberInvite project={project} members={organizationMembers} />}
                    </CardHeader>
                    <CardContent className="flex flex-col divide-y">
                        {project.members.map((member) => {
                            const roleMeta = projectRoleMeta[member.role];

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
                                        <span className="hidden text-xs text-muted-foreground sm:inline">
                                            Interne Kommentare
                                        </span>
                                        <StatusBadge
                                            meta={{
                                                label: roleMeta.label,
                                                tone: roleMeta.tone,
                                                icon: Plus,
                                            }}
                                            showIcon={false}
                                            size="sm"
                                        />

                                        {canEditUser && (
                                            <Button variant="ghost" size="sm">
                                                <Pencil />
                                            </Button>
                                        )}

                                        {canRemoveUser && (
                                            <Button variant="ghost" size="sm">
                                                <Trash className="text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

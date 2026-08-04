import { Head, Link } from '@inertiajs/react';
import { Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { projectRoleMeta } from '@/lib/roles';
import { register } from '@/routes';
import type {
    Invitation,
    Project,
    ProjectRole,
    User} from '@/types';


type ProjectShowInvitationProps = {
    invitation: Invitation;
    user: User | null;
    project: Project;
}

export default function ProjectShowInvitation({ invitation, user, project }: ProjectShowInvitationProps) {

    const role = projectRoleMeta[invitation.role as ProjectRole];

    return (
        <>
            <Head title="Einladung zum Projekt annehmen" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-6" />
                    </span>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {invitation.invited_by_user.name}
                        </span>{' '}
                        hat dich zum Projekt
                    </p>
                    <p className="text-lg font-semibold">
                        {project.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        als{' '}
                        <span className="font-medium text-foreground">
                            {role.label}
                        </span>{' '}
                        eingeladen.
                    </p>
                </div>

                <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    {role.description}
                </div>

                <div className="flex flex-col gap-2">
                    <Button asChild>
                        <Link
                            href={
                                register({
                                    query: { invitation: invitation.id },
                                }).url
                            }
                        >
                            Einladung annehmen & Konto erstellen
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/public">Später</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

ProjectShowInvitation.layout = {
    title: 'Einladung annehmen',
    description: 'Tritt dem Projekt bei.',
};

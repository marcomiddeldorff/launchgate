import { Head, Link, usePage } from '@inertiajs/react';
import { Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { organizationRoleMeta } from '@/lib/roles';
import { register } from '@/routes';
import type { Invitation, OrganizationRole, User } from '@/types';

export default function AcceptInvitation() {
    const { invitation, user } = usePage<{ invitation: Invitation, user: User | null }>().props;

    const role = organizationRoleMeta[invitation.role as OrganizationRole];

    return (
        <>
            <Head title="Einladung annehmen" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-6" />
                    </span>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {invitation.invitedBy.name}
                        </span>{' '}
                        hat dich zu
                    </p>
                    <p className="text-lg font-semibold">
                        {invitation?.organization?.name}
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
                        <Link href="/">Später</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

AcceptInvitation.layout = {
    title: 'Einladung annehmen',
    description: 'Tritt der Organisation bei und starte mit LaunchGate.',
};

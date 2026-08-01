import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Languages,
    Pencil,
    ShieldCheck,
    Trash,
    UserPlus,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { DataTable } from '@/components/data-table';
import type { DataTableColumn } from '@/components/data-table';
import { DefinitionList } from '@/components/definition-list';
import { EmptyState } from '@/components/empty-state';
import { FormField } from '@/components/forms/form-field';
import MemberInvite from '@/components/member-invite';
import { MetricCard } from '@/components/metric-card';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserAvatar } from '@/components/user-avatar';
import { formatDate } from '@/lib/format';
import { organizationRoleMeta } from '@/lib/roles';
import type { StatusTone } from '@/lib/status';
import * as orgs from '@/routes/organizations';
import type {
    Invitation,
    MembershipStatus,
    Organization,
    OrganizationMembership,
    OrganizationRole,
} from '@/types';
import MemberTable from '@/pages/organizations/member-table';
import InvitedTable from '@/pages/organizations/invited-table';

const localeLabels: Record<string, string> = {
    de: 'Deutsch',
    en: 'English',
};

/** Organization logo with a graceful fallback to an initial glyph. */
function OrgLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
    const [failed, setFailed] = useState(false);

    if (logoUrl && !failed) {
        return (
            <img
                src={logoUrl}
                alt={name}
                onError={() => setFailed(true)}
                className="size-11 rounded-lg object-cover"
            />
        );
    }

    return (
        <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
            {name.charAt(0)}
        </span>
    );
}

type OrganizationsShowProps = {
    organization: Organization;
}

export default function OrganizationsShow({ organization }: OrganizationsShowProps) {
    const memberships = organization.memberships ?? [];
    const invitations = organization.invitations ?? [];

    const [deleteOpen, setDeleteOpen] = useState(false);

    const activeCount = memberships.filter((m) => m.status === 'active').length;
    const invitedCount = organization.invitationsCount;

    const destroy = () => {
        router.delete(orgs.destroy({ organization: organization.id }).url);
    };

    return (
        <>
            <Head title={organization.name} />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Organisationen', href: orgs.index.url() },
                        { title: organization.name },
                    ]}
                    icon={
                        <OrgLogo
                            name={organization.name}
                            logoUrl={organization.logoUrl}
                        />
                    }
                    title={organization.name}
                    description={`launchgate.app/${organization.slug}`}
                    actions={
                        <>
                            <Dialog
                                open={deleteOpen}
                                onOpenChange={setDeleteOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-danger/40 text-danger hover:bg-danger/10"
                                    >
                                        <Trash />
                                        Löschen
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Organisation löschen?
                                        </DialogTitle>
                                        <DialogDescription>
                                            „{organization.name}“ und alle
                                            zugehörigen Daten werden
                                            unwiderruflich entfernt. Diese
                                            Aktion kann nicht rückgängig gemacht
                                            werden.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setDeleteOpen(false)}
                                        >
                                            Abbrechen
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={destroy}
                                        >
                                            <Trash /> Endgültig löschen
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button asChild>
                                <Link
                                    href={
                                        orgs.edit({
                                            organization: organization.id,
                                        }).url
                                    }
                                >
                                    <Pencil />
                                    Bearbeiten
                                </Link>
                            </Button>
                        </>
                    }
                />

                <div className="grid gap-3 sm:grid-cols-3">
                    <MetricCard
                        label="Mitglieder"
                        value={memberships.length}
                        icon={Users}
                    />
                    <MetricCard
                        label="Aktiv"
                        value={activeCount}
                        icon={ShieldCheck}
                        tone="success"
                    />
                    <MetricCard
                        label="Eingeladen"
                        value={invitedCount}
                        icon={UserPlus}
                        tone={invitedCount > 0 ? 'warning' : 'neutral'}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Organisationsdaten</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DefinitionList
                                items={[
                                    {
                                        term: 'Name',
                                        description: organization.name,
                                    },
                                    {
                                        term: 'Slug',
                                        description: organization.slug,
                                    },
                                    {
                                        term: 'Standard-Sprache',
                                        description: (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Languages className="size-3.5 text-muted-foreground" />
                                                {localeLabels[
                                                    organization.defaultLocale
                                                ] ?? organization.defaultLocale}
                                            </span>
                                        ),
                                    },
                                    {
                                        term: 'Zeitzone',
                                        description: organization.timezone,
                                    },
                                    {
                                        term: 'Erstellt am',
                                        description: (
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays className="size-3.5 text-muted-foreground" />
                                                {formatDate(
                                                    organization.createdAt,
                                                )}
                                            </span>
                                        ),
                                    },
                                ]}
                            />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 lg:col-span-2">
                        <MemberTable
                            memberships={organization.memberships}
                            organization={organization}
                        />
                        {organization.invitationsCount > 0 && (
                            <InvitedTable
                                invitations={organization.invitations}
                                organization={organization}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

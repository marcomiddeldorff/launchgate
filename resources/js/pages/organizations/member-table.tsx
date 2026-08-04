import { Ellipsis, Pencil, ShieldCheck, Trash, Users } from 'lucide-react';
import type { DataTableColumn } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import OrganizationMemberInvite from '@/components/organization-member-invite';
import { StatusBadge } from '@/components/status/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import { formatDate } from '@/lib/format';
import { organizationRoleMeta } from '@/lib/roles';
import type { StatusTone } from '@/lib/status';
import type { MembershipStatus, OrganizationRole, User } from '@/types';
import type { Organization, OrganizationMembership } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import EditUser from '@/pages/organizations/edit-user';
import { useState } from 'react';

type MemberTableProps = {
    memberships: OrganizationMembership[];
    organization: Organization;
};

const statusMeta: Record<
    MembershipStatus,
    { label: string; tone: StatusTone }
> = {
    active: { label: 'Aktiv', tone: 'success' },
    invited: { label: 'Eingeladen', tone: 'warning' },
    suspended: { label: 'Gesperrt', tone: 'neutral' },
};

function RoleBadge({ role }: { role: string }) {
    const meta = organizationRoleMeta[role as OrganizationRole];

    if (!meta) {
        return <span className="text-sm text-muted-foreground">{role}</span>;
    }

    return (
        <StatusBadge
            meta={{ label: meta.label, tone: meta.tone, icon: ShieldCheck }}
            showIcon={false}
            size="sm"
        />
    );
}

function MembershipStatusBadge({ status }: { status: string }) {
    const meta = statusMeta[status as MembershipStatus] ?? {
        label: status,
        tone: 'neutral' as StatusTone,
    };

    return (
        <StatusBadge
            meta={{ label: meta.label, tone: meta.tone, icon: ShieldCheck }}
            showIcon={false}
            size="sm"
        />
    );
}

function initialsFor(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();
}

export default function MemberTable({
    memberships,
    organization,
}: MemberTableProps) {
    const [editMembership, setEditMembership] =
        useState<OrganizationMembership | null>(null);

    const columns: DataTableColumn<OrganizationMembership>[] = [
        {
            id: 'name',
            header: 'Name',
            cell: (m) => (
                <div className="flex items-center gap-3">
                    <UserAvatar
                        user={{
                            name: m.user.name,
                            initials: initialsFor(m.user.name),
                            avatarUrl: m.user.avatarUrl,
                        }}
                        size="sm"
                    />
                    <div className="min-w-0">
                        <p className="truncate font-medium">{m.user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                            {m.user.email}
                        </p>
                    </div>
                </div>
            ),
            sortValue: (m) => m.user.name,
        },
        {
            id: 'role',
            header: 'Rolle',
            cell: (m) => <RoleBadge role={m.role} />,
            sortValue: (m) => m.role,
            hideOnMobile: true,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (m) => <MembershipStatusBadge status={m.status} />,
            hideOnMobile: true,
        },
        {
            id: 'joined_at',
            header: 'Beigetreten',
            cell: (m) => (
                <span className="text-sm text-muted-foreground">
                    {formatDate(m.joined_at)}
                </span>
            ),
            sortValue: (m) => m.joined_at ?? '',
            hideOnMobile: true,
        },
        {
            id: 'actions',
            header: '',
            cell: (m) => (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                                <Ellipsis />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => setEditMembership(m)}
                                >
                                    <Pencil />
                                    Bearbeiten
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem variant="destructive">
                                    <Trash />
                                    Entfernen
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <EditUser
                        membership={editMembership}
                        organization={organization}
                        onClose={() => setEditMembership(null)}
                    />
                </div>
            ),
        },
    ];

    return (
        <Card className="lg:col-span-2" variant="bare">
            <CardHeader className="flex-row items-center justify-between gap-2">
                <CardTitle>Mitglieder</CardTitle>
                <OrganizationMemberInvite organization={organization} />
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    rows={memberships}
                    getRowId={(m) => m.id}
                    searchAccessor={(m) => `${m.user.name} ${m.user.email}`}
                    searchPlaceholder="Mitglieder durchsuchen …"
                    initialSort={{ columnId: 'name', dir: 'asc' }}
                    emptyState={
                        <EmptyState
                            icon={Users}
                            title="Noch keine Mitglieder"
                            description="Lade dein erstes Mitglied in diese Organisation ein."
                            action={
                                <OrganizationMemberInvite organization={organization} />
                            }
                            compact
                        />
                    }
                    renderMobileCard={(m) => (
                        <Card className="gap-2 p-4">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    user={{
                                        name: m.user.name,
                                        initials: initialsFor(m.user.name),
                                        avatarUrl: m.user.avatarUrl,
                                    }}
                                    size="sm"
                                />
                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {m.user.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {m.user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <RoleBadge role={m.role} />
                                <MembershipStatusBadge status={m.status} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Beigetreten {formatDate(m.joined_at)}
                            </p>
                        </Card>
                    )}
                />
            </CardContent>
        </Card>
    );
}

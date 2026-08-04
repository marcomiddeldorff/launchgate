import { ShieldCheck, Trash } from 'lucide-react';
import type { DataTableColumn } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDateTime } from '@/lib/format';
import { organizationRoleMeta } from '@/lib/roles';
import type { StatusTone } from '@/lib/status';
import type { Invitation, InvitationStatus, OrganizationRole } from '@/types';
import type { Organization } from '@/types';

type InvitedTableProps = {
    invitations: Invitation[];
    organization: Organization;
};

const statusMeta: Record<
    InvitationStatus,
    { label: string; tone: StatusTone }
> = {
    default: { label: 'Standard', tone: 'neutral' },
    expired: { label: 'Abgelaufen', tone: 'danger' },
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

function InvitedStatusBadge({ status }: { status: string }) {
    const meta = statusMeta[status as InvitationStatus] ?? {
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

export default function InvitedTable({ invitations }: InvitedTableProps) {
    const columns: DataTableColumn<Invitation>[] = [
        {
            id: 'email',
            header: 'E-Mail Adresse',
            cell: (m) => (
                <div className="min-w-0">
                    <p className="truncate font-medium">
                        {m.email}{' '}
                        {m.is_expired ? (
                            <Tooltip>
                                <TooltipTrigger>
                                    <InvitedStatusBadge status="expired" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Abgelaufene Einladungen werden automatisch
                                    gelöscht.
                                </TooltipContent>
                            </Tooltip>
                        ) : null}
                    </p>
                </div>
            ),
            sortValue: (m) => m.email,
        },
        {
            id: 'role',
            header: 'Rolle',
            cell: (m) => <RoleBadge role={m.role} />,
            hideOnMobile: true,
        },
        {
            id: 'expires_at',
            header: 'Eingeladen am',
            cell: (m) => (
                <InvitedStatusBadge status={formatDateTime(m.created_at)} />
            ),
            hideOnMobile: true,
        },
        {
            id: 'expires_at',
            header: 'Läuft ab am',
            cell: (m) => (
                <InvitedStatusBadge status={formatDateTime(m.expires_at)} />
            ),
            hideOnMobile: true,
        },
        {
            id: 'actions',
            header: '',
            cell: () => (
                <Button variant="ghost" size="sm">
                    <Trash size={16} className="text-destructive" />
                </Button>
            ),
            hideOnMobile: false,
        },
    ];

    return (
        <Card className="lg:col-span-2" variant="bare">
            <CardHeader className="flex-row items-center justify-between gap-2">
                <CardTitle>Einladungen</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    rows={invitations}
                    getRowId={(m) => m.id}
                    searchAccessor={(m) => `${m.email}`}
                    searchPlaceholder="Mitglieder durchsuchen …"
                    initialSort={{ columnId: 'email', dir: 'asc' }}
                    renderMobileCard={(m) => (
                        <Card className="gap-2 p-4">
                            <div className="min-w-0">
                                <p className="truncate font-medium">
                                    {m.email}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <RoleBadge role={m.role} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Eingeladen am {formatDateTime(m.created_at)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Läuft ab am {formatDateTime(m.expires_at)}
                            </p>
                        </Card>
                    )}
                />
            </CardContent>
        </Card>
    );
}

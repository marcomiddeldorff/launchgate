import { Head } from '@inertiajs/react';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { Banner } from '@/components/banner';
import { FormField } from '@/components/forms/form-field';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserInline } from '@/components/user-avatar';
import { useAppContext } from '@/hooks/use-app-context';
import { formatDate, formatRelative } from '@/lib/format';
import { organizationRoleMeta } from '@/lib/roles';
import { members } from '@/mocks';
import { OrganizationRole } from '@/types';

export default function MembersIndex() {
    const { organization } = useAppContext();
    const [inviteOpen, setInviteOpen] = useState(false);
    const [role, setRole] = useState<OrganizationRole>(OrganizationRole.Viewer);

    const invite = (event: FormEvent) => {
        event.preventDefault();
        setInviteOpen(false);
        toast.success('Einladung versendet.');
    };

    return (
        <>
            <Head title="Mitglieder" />
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Mitglieder' }]}
                    title="Mitglieder"
                    description={`${members.length} Personen in ${organization.name}.`}
                    actions={
                        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus /> Mitglied einladen
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Mitglied einladen</DialogTitle>
                                    <DialogDescription>
                                        Die Person erhält eine E-Mail mit einem
                                        Einladungslink.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={invite} className="space-y-4">
                                    <FormField
                                        id="invite-email"
                                        label="E-Mail-Adresse"
                                        required
                                    >
                                        <Input
                                            id="invite-email"
                                            type="email"
                                            required
                                            placeholder="name@firma.de"
                                        />
                                    </FormField>
                                    <FormField
                                        id="invite-role"
                                        label="Rolle"
                                        required
                                        hint={
                                            organizationRoleMeta[role]
                                                .description
                                        }
                                    >
                                        <Select
                                            value={role}
                                            onValueChange={(v) =>
                                                setRole(v as OrganizationRole)
                                            }
                                        >
                                            <SelectTrigger id="invite-role">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    OrganizationRole,
                                                ).map((r) => (
                                                    <SelectItem
                                                        key={r}
                                                        value={r}
                                                    >
                                                        {
                                                            organizationRoleMeta[
                                                                r
                                                            ].label
                                                        }
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setInviteOpen(false)}
                                        >
                                            Abbrechen
                                        </Button>
                                        <Button type="submit">
                                            Einladung senden
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    }
                />

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead>Mitglied</TableHead>
                                    <TableHead>Rolle</TableHead>
                                    <TableHead className="hidden sm:table-cell">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Beigetreten
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">
                                        Zuletzt aktiv
                                    </TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => {
                                    const roleMeta =
                                        organizationRoleMeta[member.role];

                                    return (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <UserInline
                                                    user={member.user}
                                                    secondary={
                                                        member.user.email
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    meta={{
                                                        label: roleMeta.label,
                                                        tone: roleMeta.tone,
                                                        icon: UserPlus,
                                                    }}
                                                    showIcon={false}
                                                    size="sm"
                                                />
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {member.status === 'invited' ? (
                                                    <span className="text-sm font-medium text-warning">
                                                        Eingeladen
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-success">
                                                        Aktiv
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                                                {member.joinedAt
                                                    ? formatDate(
                                                          member.joinedAt,
                                                      )
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                                                {member.lastSeenAt
                                                    ? formatRelative(
                                                          member.lastSeenAt,
                                                      )
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Aktionen"
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            Rolle ändern
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            Freigaberecht
                                                            anpassen
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-danger">
                                                            Entfernen
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Banner tone="info" title="Rollen & Berechtigungen">
                    Owner verwalten die Organisation und Abrechnung, Admins
                    verwalten Mitglieder, Projekte und Releases, Project Manager
                    steuern Releases, Developer bearbeiten Issues und Viewer
                    haben nur Lesezugriff.
                </Banner>
            </div>
        </>
    );
}

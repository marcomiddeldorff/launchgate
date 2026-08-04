import { useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import addMemberToProjectController from '@/actions/App/Http/Controllers/Projects/AddMemberToProjectController';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
import type { AutocompleteOption } from '@/components/ui/autocomplete';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { projectRoleMeta } from '@/lib/roles';
import type { OrganizationMembership, Project } from '@/types';
import { ProjectRole } from '@/types';

type ProjectMemberInviteProps = {
    project: Project;
    members: OrganizationMembership[];
};

export default function ProjectMemberInvite({ project, members }: ProjectMemberInviteProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, processing, errors, post } = useForm({
        member_id: '',
        role: ProjectRole.ClientTester,
        can_approve: false,
        can_view_internal_comments: false,
        add_external_user: false,
        email: '',
    });

    const invite: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log('works');

        post(addMemberToProjectController.url(project.id), {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    const memberOptions: AutocompleteOption[] = members.map((c) => ({
        value: c.id,
        label: c.user.name,
    }));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" onClick={() => setOpen(true)}>
                    <UserPlus /> Mitglied einladen
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mitglied zum Projekt einladen</DialogTitle>
                    <DialogDescription>
                        Die Person erhält eine E-Mail mit einem Einladungslink.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={invite} className="space-y-4">
                    <FormField
                        id="add_external_member"
                        label="Externes Mitglied hinzufügen"
                    >
                        <Switch checked={data.add_external_user} onCheckedChange={(value) => setData('add_external_user', value)} />
                    </FormField>
                    {data.add_external_user ? (
                        <FormField id="email" label="E-Mail des externen Mitglied's">
                            <Input
                                placeholder="email@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} />
                        </FormField>
                        ) : (
                        <FormField
                            id="search_members"
                            label="Nach Mitgliedern suchen..."
                            className="relative"
                        >
                            <Autocomplete
                                value={data.member_id}
                                options={memberOptions}
                                onChange={(value) =>
                                    setData('member_id', value)
                                }
                                placeholder="Mitglied suchen …"
                                aria-invalid={!!errors.member_id}
                            />
                            <InputError message={errors.member_id} />
                        </FormField>
                    )}
                    <FormField
                        id="invite-role"
                        label="Rolle"
                        required
                        hint={projectRoleMeta[data.role].description}
                    >
                        <Select
                            value={data.role}
                            onValueChange={(v) =>
                                setData('role', v as ProjectRole)
                            }
                        >
                            <SelectTrigger id="invite-role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ProjectRole).map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {projectRoleMeta[r].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </FormField>
                    <FormField id="can_approve" label="Kann genehmigen">
                        <div>
                            <Switch
                                checked={data.can_approve}
                                onCheckedChange={(value) =>
                                    setData('can_approve', value)
                                }
                            />
                            <InputError message={errors.can_approve} />
                        </div>
                    </FormField>
                    <FormField
                        id="can_view_internal_comments"
                        label="Kann interne Kommentare sehen"
                    >
                        <div>
                            <Switch
                                checked={data.can_view_internal_comments}
                                onCheckedChange={(value) =>
                                    setData('can_view_internal_comments', value)
                                }
                            />
                            <InputError
                                message={errors.can_view_internal_comments}
                            />
                        </div>
                    </FormField>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                        >
                            Abbrechen
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle />}
                            Einladung senden
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

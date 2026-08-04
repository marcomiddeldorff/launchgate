import { useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import { useState } from 'react';
import organizationMembershipController from '@/actions/App/Http/Controllers/OrganizationMembershipController';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
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
import { organizationRoleMeta } from '@/lib/roles';
import { OrganizationRole } from '@/types';
import type { Organization } from '@/types';

type MemberInviteProps = {
    organization: Organization;
};

export default function OrganizationMemberInvite({ organization }: MemberInviteProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, processing, errors, post } = useForm({
        email: '',
        role: OrganizationRole.Viewer,
    });

    const invite: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        console.log('works');

        post(
            organizationMembershipController.invite({
                organization: organization.id,
            }).url,
            {
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" onClick={() => setOpen(true)}>
                    <UserPlus /> Mitglied einladen
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mitglied einladen</DialogTitle>
                    <DialogDescription>
                        Die Person erhält eine E-Mail mit einem Einladungslink.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={invite} className="space-y-4">
                    <FormField
                        id="invite-email"
                        label="E-Mail-Adresse"
                        required
                    >
                        <Input
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            id="invite-email"
                            type="email"
                            required
                            placeholder="name@firma.de"
                        />
                        <InputError message={errors.email} />
                    </FormField>
                    <FormField
                        id="invite-role"
                        label="Rolle"
                        required
                        hint={organizationRoleMeta[data.role].description}
                    >
                        <Select
                            value={data.role}
                            onValueChange={(v) =>
                                setData('role', v as OrganizationRole)
                            }
                        >
                            <SelectTrigger id="invite-role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(OrganizationRole).map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {organizationRoleMeta[r].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
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

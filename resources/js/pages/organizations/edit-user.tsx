import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { SubmitEventHandler} from 'react';
import { useEffect } from 'react';
import organizationMembershipController from '@/actions/App/Http/Controllers/OrganizationMembershipController';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { organizationRoleMeta } from '@/lib/roles';
import type { Organization, OrganizationMembership, OrganizationRole } from '@/types';


type EditUserProps = {
    membership: OrganizationMembership | null;
    organization: Organization;
    onClose: () => void;
}

export default function EditUser({ membership, onClose, organization }: EditUserProps) {

    const { data, setData, errors, processing, put } = useForm<{
        role: OrganizationRole
    }>({
        role: membership?.role as OrganizationRole ?? 'client_tester'
    })

    const submit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!membership) {
            return;
        }

        put(organizationMembershipController.update({ organization: organization.id, membership: membership.id }).url, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    useEffect(() => {
        if (membership) {
            console.log(membership);
            setData('role', membership.role as OrganizationRole);
        }
    }, [membership]);

    return (
        <Dialog open={membership !== null} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Benutzer bearbeiten</DialogTitle>
                </DialogHeader>

                <form className="grid gap-4" onSubmit={submit}>
                    <div className="grid gap-2">
                        <FormField id="name" label="Name" required>
                            <Input value={membership?.user.name} disabled />
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField id="email" label="E-Mail" required>
                            <Input value={membership?.user.email} disabled />
                        </FormField>
                    </div>
                    <div className="grid gap-2">
                        <FormField id="role" label="Rolle" required>
                            <Select
                                required
                                value={data.role}
                                onValueChange={(val) =>
                                    setData('role', val as OrganizationRole)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.keys(organizationRoleMeta).map(
                                            (role) => (
                                                <SelectItem
                                                    value={role}
                                                    key={role}
                                                >
                                                    {
                                                        organizationRoleMeta[
                                                            role as OrganizationRole
                                                        ].label
                                                    }
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <InputError message={errors.role} />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                        >
                            Abbrechen
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle />}
                            Speichern
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

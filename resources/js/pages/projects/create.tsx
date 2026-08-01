import { Head, router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { paths } from '@/lib/routes';
import { clients, members } from '@/mocks';

export default function ProjectCreate() {
    const staff = members.filter((m) =>
        ['owner', 'project_manager'].includes(m.role),
    );

    const submit = (event: FormEvent) => {
        event.preventDefault();
        toast.success('Projekt angelegt.');
        router.visit(paths.projects.index);
    };

    return (
        <>
            <Head title="Projekt anlegen" />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Projekte', href: paths.projects.index },
                        { title: 'Neues Projekt' },
                    ]}
                    title="Projekt anlegen"
                    description="Eine Anwendung oder ein Produkt, dessen Releases geprüft werden."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Projektdaten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <FormField id="name" label="Projektname" required>
                                <Input
                                    id="name"
                                    required
                                    placeholder="z. B. Kundenportal"
                                />
                            </FormField>
                            <FormField id="client" label="Kunde" required>
                                <Select defaultValue={clients[0].id}>
                                    <SelectTrigger id="client">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients
                                            .filter(
                                                (c) => c.status !== 'archived',
                                            )
                                            .map((c) => (
                                                <SelectItem
                                                    key={c.id}
                                                    value={c.id}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField id="description" label="Beschreibung">
                                <Textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Worum geht es in diesem Projekt?"
                                />
                            </FormField>
                            <FormField id="repo" label="Repository-URL">
                                <Input
                                    id="repo"
                                    type="url"
                                    placeholder="https://github.com/…"
                                />
                            </FormField>
                            <FormField id="pm" label="Project Manager" required>
                                <Select defaultValue={staff[0]?.user.id}>
                                    <SelectTrigger id="pm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staff.map((m) => (
                                            <SelectItem
                                                key={m.user.id}
                                                value={m.user.id}
                                            >
                                                {m.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        router.visit(paths.projects.index)
                                    }
                                >
                                    Abbrechen
                                </Button>
                                <Button type="submit">Projekt anlegen</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

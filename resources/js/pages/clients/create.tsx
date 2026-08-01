import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

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
import { notify } from '@/lib/toast';
import { getClient } from '@/mocks';

export default function ClientCreate({ id }: { id?: string }) {
    const existing = id ? getClient(id) : null;
    const isEdit = Boolean(existing);
    const [submitting, setSubmitting] = useState(false);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        notify.success(isEdit ? 'Kunde aktualisiert' : 'Kunde angelegt', {
            description: isEdit
                ? 'Deine Änderungen wurden gespeichert.'
                : 'Der Kunde wurde erfolgreich erstellt.',
        });
        router.visit(
            existing ? paths.clients.show(existing.id) : paths.clients.index,
        );
    };

    return (
        <>
            <Head title={isEdit ? 'Kunde bearbeiten' : 'Kunde anlegen'} />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Kunden', href: paths.clients.index },
                        { title: isEdit ? existing!.name : 'Neuer Kunde' },
                    ]}
                    title={isEdit ? 'Kunde bearbeiten' : 'Kunde anlegen'}
                    description="Auftraggeber, dem Projekte und Releases zugeordnet werden."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Kundendaten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <FormField id="name" label="Name" required>
                                <Input
                                    id="name"
                                    required
                                    defaultValue={existing?.name}
                                    placeholder="z. B. Müller GmbH"
                                />
                            </FormField>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <FormField
                                    id="reference"
                                    label="Referenz"
                                    hint="Interne Kundennummer o. Ä."
                                >
                                    <Input
                                        id="reference"
                                        defaultValue={existing?.reference ?? ''}
                                        placeholder="MUE-2024"
                                    />
                                </FormField>
                                <FormField id="domain" label="Primäre Domain">
                                    <Input
                                        id="domain"
                                        defaultValue={
                                            existing?.primaryDomain ?? ''
                                        }
                                        placeholder="firma.de"
                                    />
                                </FormField>
                            </div>
                            <FormField id="status" label="Status" required>
                                <Select
                                    defaultValue={existing?.status ?? 'active'}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Aktiv
                                        </SelectItem>
                                        <SelectItem value="prospect">
                                            Interessent
                                        </SelectItem>
                                        <SelectItem value="archived">
                                            Archiviert
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField id="notes" label="Notizen">
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    defaultValue={existing?.notes ?? ''}
                                    placeholder="Kontext zum Kunden …"
                                />
                            </FormField>

                            <div className="space-y-3 border-t pt-5">
                                <p className="text-sm font-medium">
                                    Hauptkontakt
                                </p>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormField id="contact-name" label="Name">
                                        <Input
                                            id="contact-name"
                                            defaultValue={
                                                existing?.contacts[0]?.name ??
                                                ''
                                            }
                                            placeholder="Ansprechpartner"
                                        />
                                    </FormField>
                                    <FormField
                                        id="contact-email"
                                        label="E-Mail"
                                    >
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            defaultValue={
                                                existing?.contacts[0]?.email ??
                                                ''
                                            }
                                            placeholder="kontakt@firma.de"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        router.visit(paths.clients.index)
                                    }
                                >
                                    Abbrechen
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {isEdit
                                        ? 'Änderungen speichern'
                                        : 'Kunde anlegen'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

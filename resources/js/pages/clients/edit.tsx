import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import clientController from '@/actions/App/Http/Controllers/ClientController';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
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
import clientRoutes from '@/routes/clients';
import type { Client, ClientStatus } from '@/types';

type ClientEditProps = {
    client: Client;
};

export default function ClientEdit({ client }: ClientEditProps) {
    const { data, setData, errors, processing, put } = useForm({
        name: client.name,
        reference: client.reference ?? '',
        primaryDomain: client.primary_domain ?? '',
        status: client.status,
        notes: client.notes ?? '',
        contactName: client.contact_name ?? '',
        contactEmail: client.contact_email ?? '',
    });

    const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        put(clientController.update.url(client.id));
    };

    return (
        <>
            <Head title="Kunde bearbeiten" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Kunden', href: clientRoutes.index.url() },
                        { title: 'Kunde bearbeiten' },
                    ]}
                    title={'Kunde bearbeiten'}
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
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="z. B. Müller GmbH"
                                />
                                <InputError message={errors.name} />
                            </FormField>
                            <div className="grid items-start gap-5 sm:grid-cols-2">
                                <FormField
                                    id="reference"
                                    label="Referenz"
                                    hint="Interne Kundennummer o. Ä."
                                >
                                    <Input
                                        id="reference"
                                        value={data.reference}
                                        onChange={(e) =>
                                            setData('reference', e.target.value)
                                        }
                                        placeholder="MUE-2024"
                                    />
                                    <InputError message={errors.reference} />
                                </FormField>
                                <FormField id="domain" label="Primäre Domain">
                                    <Input
                                        id="domain"
                                        value={data.primaryDomain}
                                        onChange={(e) =>
                                            setData(
                                                'primaryDomain',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="firma.de"
                                    />
                                    <InputError
                                        message={errors.primaryDomain}
                                    />
                                </FormField>
                            </div>
                            <FormField id="status" label="Status" required>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value as ClientStatus)
                                    }
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
                                <InputError message={errors.status} />
                            </FormField>
                            <FormField id="notes" label="Notizen">
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Kontext zum Kunden …"
                                />
                                <InputError message={errors.notes} />
                            </FormField>

                            <div className="space-y-3 border-t pt-5">
                                <p className="text-sm font-medium">
                                    Hauptkontakt
                                </p>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormField id="contact-name" label="Name">
                                        <Input
                                            id="contact-name"
                                            value={data.contactName ?? ''}
                                            onChange={(e) =>
                                                setData(
                                                    'contactName',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ansprechpartner"
                                        />
                                        <InputError
                                            message={errors.contactName}
                                        />
                                    </FormField>
                                    <FormField
                                        id="contact-email"
                                        label="E-Mail"
                                    >
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            value={data.contactEmail ?? ''}
                                            onChange={(e) =>
                                                setData(
                                                    'contactEmail',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="kontakt@firma.de"
                                        />
                                        <InputError
                                            message={errors.contactEmail}
                                        />
                                    </FormField>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        router.visit(clientRoutes.index.url())
                                    }
                                >
                                    Abbrechen
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle />}
                                    Kunde aktualisieren
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

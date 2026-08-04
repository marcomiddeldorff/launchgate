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
import { projects } from '@/mocks';
import releaseRoutes from '@/routes/releases';

export default function ReleaseCreate() {
    const submit = (event: FormEvent) => {
        event.preventDefault();
        toast.success('Release als Entwurf angelegt.');
        router.visit(releaseRoutes.index.url());
    };

    return (
        <>
            <Head title="Release anlegen" />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Releases', href: releaseRoutes.index.url() },
                        { title: 'Neuer Release' },
                    ]}
                    title="Release anlegen"
                    description="Ein zu prüfender Softwarestand mit Testzeitraum und geplantem Go-live."
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Release-Daten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <FormField id="name" label="Name" required>
                                    <Input
                                        id="name"
                                        required
                                        placeholder="z. B. Release 2.4"
                                    />
                                </FormField>
                                <FormField id="version" label="Version">
                                    <Input id="version" placeholder="2.4.0" />
                                </FormField>
                            </div>
                            <FormField id="project" label="Projekt" required>
                                <Select defaultValue={projects[0].id}>
                                    <SelectTrigger id="project">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} · {p.clientName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField id="description" label="Beschreibung">
                                <Textarea
                                    id="description"
                                    rows={3}
                                    placeholder="Was ist in diesem Release enthalten?"
                                />
                            </FormField>
                            <FormField id="scope" label="Scope">
                                <Input
                                    id="scope"
                                    placeholder="z. B. CSV-Export, Rechnungsliste"
                                />
                            </FormField>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <FormField id="risk" label="Risiko" required>
                                    <Select defaultValue="medium">
                                        <SelectTrigger id="risk">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                Gering
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Mittel
                                            </SelectItem>
                                            <SelectItem value="high">
                                                Hoch
                                            </SelectItem>
                                            <SelectItem value="critical">
                                                Kritisch
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField
                                    id="golive"
                                    label="Geplanter Go-live"
                                >
                                    <Input id="golive" type="date" />
                                </FormField>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <FormField id="test-start" label="Test-Beginn">
                                    <Input id="test-start" type="date" />
                                </FormField>
                                <FormField id="test-end" label="Test-Ende">
                                    <Input id="test-end" type="date" />
                                </FormField>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        router.visit(releaseRoutes.index.url())
                                    }
                                >
                                    Abbrechen
                                </Button>
                                <Button type="submit">Release anlegen</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

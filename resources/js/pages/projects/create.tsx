import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import type { SubmitEventHandler } from 'react';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import projectRoutes from '@/routes/projects';
import type {
    Client,
    Locales,
    Organization,
    OrganizationMembership,
} from '@/types';

type ProjectCreateProps = {
    clients: Client[];
    projectManager: OrganizationMembership[];
    timezones: string[];
    organization: Organization;
    locales: Locales[];
};

export default function ProjectCreate({
    clients,
    projectManager,
    timezones,
    organization,
    locales,
}: ProjectCreateProps) {
    const { data, setData, errors, processing, post } = useForm({
        name: '',
        client_id: clients[0]?.id ?? undefined,
        description: '',
        status: 'active',
        default_locale: organization.default_locale,
        timezone: organization.timezone,
        repository_url: '',
        project_manager_user_id: projectManager[0]?.user.id ?? undefined,
    });

    const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        post(projectRoutes.store.url());
    };

    return (
        <>
            <Head title="Projekt anlegen" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Projekte', href: projectRoutes.index.url() },
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
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    id="name"
                                    required
                                    placeholder="z. B. Kundenportal"
                                />

                                <InputError message={errors.name} />
                            </FormField>
                            <FormField id="client" label="Kunde" required>
                                <Select
                                    value={data.client_id}
                                    onValueChange={(value) =>
                                        setData('client_id', value)
                                    }
                                >
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

                                <InputError message={errors.client_id} />
                            </FormField>
                            <FormField id="description" label="Beschreibung">
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    id="description"
                                    rows={3}
                                    placeholder="Worum geht es in diesem Projekt?"
                                />
                                <InputError message={errors.description} />
                            </FormField>
                            <FormField id="repo" label="Repository-URL">
                                <Input
                                    id="repo"
                                    type="url"
                                    value={data.repository_url}
                                    onChange={(e) =>
                                        setData('repository_url', e.target.value)
                                    }
                                    placeholder="https://github.com/…"
                                />
                                <InputError message={errors.repository_url} />
                            </FormField>
                            <FormField id="pm" label="Projektmanager" required>
                                <Select
                                    value={data.project_manager_user_id}
                                    onValueChange={(value) =>
                                        setData('project_manager_user_id', value)
                                    }
                                >
                                    <SelectTrigger id="pm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projectManager.map((m) => (
                                            <SelectItem key={m.user.id} value={m.user.id}>
                                                {m.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.project_manager_user_id}
                                />
                            </FormField>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <FormField
                                    id="default_locale"
                                    label="Standard-Sprache"
                                    required
                                >
                                    <Select
                                        value={data.default_locale}
                                        onValueChange={(value) =>
                                            setData('default_locale', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {locales.map((locale) => (
                                                    <SelectItem
                                                        value={locale.locale}
                                                        key={locale.locale}
                                                    >
                                                        {locale.localizedName}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.default_locale} />
                                </FormField>

                                <FormField
                                    id="timezone"
                                    label="Zeitzone"
                                    required
                                >
                                    <Select
                                        value={data.timezone}
                                        onValueChange={(value) =>
                                            setData('timezone', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {timezones.map((timezone) => (
                                                    <SelectItem
                                                        value={timezone}
                                                        key={timezone}
                                                    >
                                                        {timezone}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.timezone} />
                                </FormField>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        router.visit(projectRoutes.index.url())
                                    }
                                >
                                    Abbrechen
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle />}
                                    Projekt anlegen
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

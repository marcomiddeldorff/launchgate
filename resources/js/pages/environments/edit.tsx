import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import environmentController from '@/actions/App/Http/Controllers/EnvironmentController';
import { FormField } from '@/components/forms/form-field';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import projectRoutes from '@/routes/projects';
import type { Environment, Project } from '@/types';
import { EnvironmentTypeEnum } from '@/types';

type EnvironmentsEditProps = {
    project: Project;
    environment: Environment;
}

export default function EnvironmentsEdit({ project, environment }: EnvironmentsEditProps) {

    const { data, setData, errors, processing, put } = useForm({
        name: environment.name,
        type: environment.type as EnvironmentTypeEnum,
        url: environment.url ?? '',
        access_notes: environment.access_notes ?? '',
        username: environment.username ?? '',
        secret: '',
        is_default_for_testing: environment.is_default_for_testing,
        is_active: environment.is_active,
    });

    const submit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        put(environmentController.update.url({
            project,
            environment
        }));
    }

    return (
        <>
            <Head title="Umgebungen" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Projekte', href: projectRoutes.index.url() },
                        {
                            title: project.name,
                            href: projectRoutes.show.url(project.id),
                        },
                        {
                            title: 'Umgebungen',
                            href: environmentController.index.url(project.id),
                        },
                        { title: 'Umgebung bearbeiten' },
                    ]}
                    title="Umgebung bearbeiten"
                    description={project.name}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Umgebungsdaten</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-4 lg:grid-cols-2" onSubmit={submit}>
                            <FormField id="name" label="Name" required>
                                <Input
                                    required
                                    value={data.name}
                                    placeholder="z.B. Produktion"
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />

                                <InputError message={errors.name} />
                            </FormField>

                            <FormField id="type" label="Typ">
                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData(
                                            'type',
                                            value as EnvironmentTypeEnum,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem
                                                value={
                                                    EnvironmentTypeEnum.Production
                                                }
                                            >
                                                Produktion
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    EnvironmentTypeEnum.Staging
                                                }
                                            >
                                                Staging
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    EnvironmentTypeEnum.Testing
                                                }
                                            >
                                                Testumgebung
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    EnvironmentTypeEnum.Preview
                                                }
                                            >
                                                Vorschau
                                            </SelectItem>
                                            <SelectItem
                                                value={
                                                    EnvironmentTypeEnum.Custom
                                                }
                                            >
                                                Benutzerdefiniert
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </FormField>

                            <FormField id="url" label="URL">
                                <Input
                                    value={data.url}
                                    onChange={(e) =>
                                        setData('url', e.target.value)
                                    }
                                />

                                <InputError message={errors.url} />
                            </FormField>

                            <FormField
                                id="access_notes"
                                label="Zugangsnotizen"
                                className="lg:col-span-2"
                            >
                                <Textarea
                                    value={data.access_notes}
                                    onChange={(e) =>
                                        setData('access_notes', e.target.value)
                                    }
                                />
                                <InputError message={errors.access_notes} />
                            </FormField>

                            <FormField
                                id="username"
                                label="Benutzername / E-Mail"
                            >
                                <Input
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                />
                                <InputError message={errors.username} />
                            </FormField>
                            <FormField id="secret" label="Passwort / Token">
                                <Input
                                    type="password"
                                    value={data.secret}
                                    onChange={(e) =>
                                        setData('secret', e.target.value)
                                    }
                                />
                                <InputError message={errors.secret} />
                            </FormField>

                            <FormField
                                id="is_default_for_testing"
                                label="Ist Standard für's Testen?"
                            >
                                <Switch
                                    checked={data.is_default_for_testing}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_default_for_testing',
                                            checked,
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.is_default_for_testing}
                                />
                            </FormField>
                            <FormField
                                id="is_active"
                                label="Ist Aktiv?"
                            >
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_active',
                                            checked,
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.is_active}
                                />
                            </FormField>

                            <div className="lg:col-span-2 text-right">
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle />}
                                    Aktualisieren
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

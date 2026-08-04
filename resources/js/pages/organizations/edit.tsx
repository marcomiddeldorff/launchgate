import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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
import slugify from '@/lib/slugify';
import organizations from '@/routes/organizations';
import type { Organization } from '@/types';
import { SubmitEventHandler } from 'react';

type OrganizationsEditProps = {
    organization: Organization;
    timezones: string[];
};

export default function OrganizationsEdit({
    organization,
    timezones,
}: OrganizationsEditProps) {
    const { data, setData, errors, processing, post } = useForm({
        name: organization.name,
        slug: organization.slug,
        logo: null as File | null,
        default_locale: organization.default_locale,
        timezone: organization.timezone,
        _method: 'put',
    });

    const submit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(organizations.update.url({ organization: organization.id }));
    };

    const onChangeName = (name: string) => {
        setData('name', name);
        setData('slug', slugify(name));
    };

    return (
        <>
            <Head title="Organisation bearbeiten" />

            <PageHeader
                breadcrumbs={[
                    {
                        title: 'Organisationen',
                        href: organizations.index.url(),
                    },
                    {
                        title: 'Organisation bearbeiten',
                        href: organizations.edit.url({
                            organization: organization.id,
                        }),
                    },
                ]}
                title="Organisation bearbeiten"
                description="Eine bestehende Organisation bearbeiten."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Organisationsdaten</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
                    >
                        <FormField id="name" label="Name" required>
                            <Input
                                value={data.name}
                                id="name"
                                required
                                onChange={(e) => onChangeName(e.target.value)}
                                placeholder="z.B. Beispielunternehmen GmbH"
                            />
                            <InputError message={errors.name} />
                        </FormField>
                        <FormField id="slug" label="Slug" required>
                            <Input
                                id="slug"
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                                required
                                value={data.slug}
                            />
                            <InputError message={errors.slug} />
                        </FormField>
                        <FormField id="logo_path" label="Logo">
                            <Input
                                id="logo_path"
                                onChange={(e) =>
                                    setData('logo', e.target!.files![0])
                                }
                                type="file"
                            />
                            <InputError message={errors.logo} />
                        </FormField>
                        <div className="hidden lg:block"></div>
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
                                        <SelectItem value="de">
                                            Deutsch
                                        </SelectItem>
                                        <SelectItem value="en">
                                            English
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.default_locale} />
                        </FormField>
                        <FormField id="timezone" label="Zeitzone" required>
                            <Select
                                value={data.timezone}
                                onValueChange={(val) =>
                                    setData('timezone', val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {timezones.map((timezone: string) => (
                                            <SelectItem
                                                key={timezone}
                                                value={timezone}
                                            >
                                                {timezone}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.timezone} />
                        </FormField>

                        <div className="flex justify-end gap-2 lg:col-span-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    router.visit(organizations.index.url())
                                }
                            >
                                Abbrechen
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle />}
                                Organisation aktualisieren
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

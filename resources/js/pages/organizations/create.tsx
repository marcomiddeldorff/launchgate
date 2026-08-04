import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
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
import { organization } from '@/mocks';
import organizations from '@/routes/organizations';

export default function OrganizationsCreate() {
    const { timezones } = usePage().props;

    const { data, setData, errors, processing, post } = useForm({
        name: '',
        slug: '',
        logo: null as File | null,
        default_locale: '',
        timezone: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(organizations.store.url());
    };

    const onChangeName = (name: string) => {
        setData('name', name);
        setData('slug', slugify(name));
    };

    return (
        <>
            <Head title="Organisation erstellen" />

            <PageHeader
                breadcrumbs={[
                    {
                        title: 'Organisationen',
                        href: organizations.index.url(),
                    },
                    {
                        title: 'Neue Organisation',
                        href: organizations.create.url(),
                    },
                ]}
                title="Organisation erstellen"
                description="Eine neue Organisation anlegen."
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
                                        {timezones.map((timezone) => (
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
                                Organisation anlegen
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

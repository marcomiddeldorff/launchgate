import { Head, Link } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { Banner } from '@/components/banner';
import { FormField } from '@/components/forms/form-field';
import { PageHeader } from '@/components/page-header';
import { Pricing } from '@/components/pricing';
import { PlanBadge } from '@/components/status/badges';
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
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/hooks/use-app-context';
import { planMeta } from '@/lib/capabilities';
import { paths } from '@/lib/routes';
import { cn } from '@/lib/utils';

type Tab = 'organization' | 'billing' | 'notifications';

const tabs: { id: Tab; label: string; href: string }[] = [
    {
        id: 'organization',
        label: 'Organisation',
        href: paths.settings.organization,
    },
    { id: 'billing', label: 'Abrechnung & Plan', href: paths.settings.billing },
    {
        id: 'notifications',
        label: 'Benachrichtigungen',
        href: paths.settings.notifications,
    },
];

const notificationPrefs = [
    {
        id: 'n1',
        label: 'Neue Go-live-Blocker',
        description: 'Wenn ein Issue als Go-live-Blocker markiert wird.',
        default: true,
    },
    {
        id: 'n2',
        label: 'Freigabe angefordert',
        description: 'Wenn du als freigebende Person eingetragen wirst.',
        default: true,
    },
    {
        id: 'n3',
        label: 'Retest erforderlich',
        description: 'Wenn eine deiner Prüfungen erneut getestet werden muss.',
        default: true,
    },
    {
        id: 'n4',
        label: 'Prüfung fällig',
        description: 'Erinnerung an fällige Prüfungen.',
        default: false,
    },
    {
        id: 'n5',
        label: 'Wöchentliche Zusammenfassung',
        description: 'Überblick über alle aktiven Releases.',
        default: false,
    },
];

export default function OrganizationSettings({
    tab = 'organization',
}: {
    tab?: Tab;
}) {
    const { organization } = useAppContext();
    const plan = planMeta(organization.plan);

    return (
        <>
            <Head title="Einstellungen" />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Einstellungen' }]}
                    title="Organisationseinstellungen"
                    description={organization.name}
                />

                <nav
                    className="flex gap-1 overflow-x-auto border-b"
                    aria-label="Einstellungen"
                >
                    {tabs.map((t) => (
                        <Link
                            key={t.id}
                            href={t.href}
                            className={cn(
                                '-mb-px border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                                tab === t.id
                                    ? 'border-primary text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                            aria-current={tab === t.id ? 'page' : undefined}
                        >
                            {t.label}
                        </Link>
                    ))}
                </nav>

                {tab === 'organization' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Allgemein</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    toast.success('Einstellungen gespeichert.');
                                }}
                                className="space-y-5"
                            >
                                <FormField
                                    id="org-name"
                                    label="Name der Organisation"
                                    required
                                >
                                    <Input
                                        id="org-name"
                                        defaultValue={organization.name}
                                        required
                                    />
                                </FormField>
                                <FormField
                                    id="org-slug"
                                    label="Kürzel (Slug)"
                                    hint="Wird für Links und Verweise verwendet."
                                >
                                    <Input
                                        id="org-slug"
                                        defaultValue={organization.slug}
                                    />
                                </FormField>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        id="org-locale"
                                        label="Standardsprache"
                                    >
                                        <Select
                                            defaultValue={
                                                organization.defaultLocale
                                            }
                                        >
                                            <SelectTrigger id="org-locale">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="de">
                                                    Deutsch
                                                </SelectItem>
                                                <SelectItem value="en">
                                                    English
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField id="org-tz" label="Zeitzone">
                                        <Select
                                            defaultValue={organization.timezone}
                                        >
                                            <SelectTrigger id="org-tz">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Europe/Berlin">
                                                    Europe/Berlin
                                                </SelectItem>
                                                <SelectItem value="Europe/Vienna">
                                                    Europe/Vienna
                                                </SelectItem>
                                                <SelectItem value="Europe/Zurich">
                                                    Europe/Zurich
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Speichern</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {tab === 'billing' && (
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aktueller Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <CreditCard className="size-5" />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                {plan.name}
                                            </span>
                                            <PlanBadge
                                                plan={organization.plan}
                                                size="sm"
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {plan.priceLabel} / Monat
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Banner
                            tone="info"
                            title="Abrechnung ist noch nicht aktiv"
                        >
                            Die Zahlungsabwicklung wird in einer späteren
                            Version ergänzt. Die folgenden Pläne dienen als
                            Vorschau.
                        </Banner>

                        <Pricing
                            currentPlan={organization.plan}
                            onSelect={(p) =>
                                toast.info(
                                    `Upgrade auf ${planMeta(p).name} folgt.`,
                                )
                            }
                        />
                    </div>
                )}

                {tab === 'notifications' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Benachrichtigungen</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col divide-y">
                            {notificationPrefs.map((pref) => (
                                <div
                                    key={pref.id}
                                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {pref.label}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {pref.description}
                                        </p>
                                    </div>
                                    <Switch
                                        defaultChecked={pref.default}
                                        aria-label={pref.label}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

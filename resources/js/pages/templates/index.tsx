import { Head } from '@inertiajs/react';
import { ListChecks, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { FeatureLock } from '@/components/capabilities/feature-lock';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/hooks/use-app-context';

const templates = [
    {
        id: 'tpl_web',
        name: 'Standard Web-Release',
        description:
            'Anmeldung, Kernfunktionen, Formulare und Basis-Sicherheit.',
        suites: 4,
        items: 22,
    },
    {
        id: 'tpl_shop',
        name: 'E-Commerce Bestellabschluss',
        description: 'Warenkorb, Kasse, Zahlung und Bestellbestätigung.',
        suites: 3,
        items: 18,
    },
    {
        id: 'tpl_dsgvo',
        name: 'DSGVO-Basisprüfung',
        description: 'Cookie-Banner, Datenexport, Löschung und Einwilligungen.',
        suites: 2,
        items: 11,
    },
];

export default function TemplatesIndex() {
    const { organization } = useAppContext();

    return (
        <>
            <Head title="Vorlagen" />
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[{ title: 'Vorlagen' }]}
                    title="Prüf-Vorlagen"
                    description="Wiederverwendbare Suiten und Prüfgegenstände für neue Releases."
                    actions={
                        organization.capabilities.customTemplates && (
                            <Button
                                onClick={() =>
                                    toast.info('Vorlagen-Editor folgt.')
                                }
                            >
                                <Plus /> Vorlage erstellen
                            </Button>
                        )
                    }
                />

                <FeatureLock
                    capability="customTemplates"
                    available={organization.capabilities.customTemplates}
                    title="Eigene Vorlagen"
                    description="Erstelle wiederverwendbare Prüf-Vorlagen und kopiere sie in neue Releases."
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        {templates.map((template) => (
                            <Card
                                key={template.id}
                                className="transition-colors hover:border-primary/40"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <ListChecks className="size-5 text-primary" />
                                        {template.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        {template.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{template.suites} Suiten</span>
                                        <span>
                                            {template.items} Prüfgegenstände
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            toast.info(
                                                'In Release übernehmen folgt.',
                                            )
                                        }
                                    >
                                        In Release übernehmen
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </FeatureLock>
            </div>
        </>
    );
}

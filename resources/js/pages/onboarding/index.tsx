import { Head, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, Rocket } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';

const steps = [
    { id: 'profile', title: 'Über dich' },
    { id: 'organization', title: 'Organisation' },
    { id: 'project', title: 'Projekt' },
    { id: 'invite', title: 'Team & Kunde' },
    { id: 'release', title: 'Erster Release' },
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const isLast = step === steps.length - 1;

    const next = () => {
        if (isLast) {
            toast.success(
                'Einrichtung abgeschlossen. Willkommen bei LaunchGate!',
            );
            router.visit(paths.dashboard);

            return;
        }

        setStep((s) => s + 1);
    };

    return (
        <>
            <Head title="Einrichtung" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
                <div className="w-full max-w-xl">
                    <div className="mb-6 flex items-center justify-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Rocket className="size-5" />
                        </span>
                        <span className="text-lg font-semibold">
                            LaunchGate
                        </span>
                    </div>

                    {/* Stepper */}
                    <ol className="mb-6 flex items-center justify-between gap-1">
                        {steps.map((s, index) => {
                            const complete = index < step;
                            const active = index === step;

                            return (
                                <li
                                    key={s.id}
                                    className="flex flex-1 flex-col items-center gap-1.5"
                                >
                                    <div className="flex w-full items-center">
                                        <span
                                            className={cn(
                                                'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                                                complete &&
                                                    'border-primary bg-primary text-primary-foreground',
                                                active &&
                                                    'border-primary text-primary',
                                                !complete &&
                                                    !active &&
                                                    'border-border text-muted-foreground',
                                            )}
                                        >
                                            {complete ? (
                                                <Check className="size-4" />
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        {index < steps.length - 1 && (
                                            <span
                                                className={cn(
                                                    'h-px flex-1',
                                                    complete
                                                        ? 'bg-primary'
                                                        : 'bg-border',
                                                )}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            'hidden text-center text-xs sm:block',
                                            active
                                                ? 'font-medium'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {s.title}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>

                    <Card>
                        <CardContent className="space-y-5 py-6">
                            {step === 0 && (
                                <>
                                    <Header
                                        title="Willkommen! Erzähl uns kurz von dir."
                                        description="So personalisieren wir deine Ansicht."
                                    />
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <FormField
                                            id="firstname"
                                            label="Vorname"
                                            required
                                        >
                                            <Input id="firstname" required />
                                        </FormField>
                                        <FormField
                                            id="lastname"
                                            label="Nachname"
                                            required
                                        >
                                            <Input id="lastname" required />
                                        </FormField>
                                    </div>
                                    <FormField id="job" label="Deine Rolle">
                                        <Input
                                            id="job"
                                            placeholder="z. B. Project Manager"
                                        />
                                    </FormField>
                                </>
                            )}

                            {step === 1 && (
                                <>
                                    <Header
                                        title="Erstelle deine Organisation"
                                        description="Deine Agentur, dein Team oder deine Firma."
                                    />
                                    <FormField
                                        id="org"
                                        label="Name der Organisation"
                                        required
                                    >
                                        <Input
                                            id="org"
                                            required
                                            placeholder="z. B. Pixelwerk Studio"
                                        />
                                    </FormField>
                                    <FormField id="tz" label="Zeitzone">
                                        <Select defaultValue="Europe/Berlin">
                                            <SelectTrigger id="tz">
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
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Header
                                        title="Lege dein erstes Projekt an"
                                        description="Die Anwendung, deren Releases du prüfen willst."
                                    />
                                    <FormField
                                        id="pname"
                                        label="Projektname"
                                        required
                                    >
                                        <Input
                                            id="pname"
                                            required
                                            placeholder="z. B. Kundenportal"
                                        />
                                    </FormField>
                                    <FormField id="pclient" label="Kunde">
                                        <Input
                                            id="pclient"
                                            placeholder="z. B. Müller GmbH"
                                        />
                                    </FormField>
                                    <FormField id="pdesc" label="Beschreibung">
                                        <Textarea id="pdesc" rows={2} />
                                    </FormField>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <Header
                                        title="Lade dein Team oder deinen Kunden ein"
                                        description="Du kannst das auch später erledigen."
                                    />
                                    <FormField
                                        id="invite-email"
                                        label="E-Mail-Adresse"
                                    >
                                        <Input
                                            id="invite-email"
                                            type="email"
                                            placeholder="name@firma.de"
                                        />
                                    </FormField>
                                    <FormField id="invite-role" label="Rolle">
                                        <Select defaultValue="client_tester">
                                            <SelectTrigger id="invite-role">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="project_manager">
                                                    Project Manager
                                                </SelectItem>
                                                <SelectItem value="developer">
                                                    Developer
                                                </SelectItem>
                                                <SelectItem value="client_tester">
                                                    Client Tester
                                                </SelectItem>
                                                <SelectItem value="approver">
                                                    Approver
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </>
                            )}

                            {step === 4 && (
                                <>
                                    <Header
                                        title="Optional: erster Release"
                                        description="Du kannst direkt loslegen oder das überspringen."
                                    />
                                    <FormField id="rname" label="Release-Name">
                                        <Input
                                            id="rname"
                                            placeholder="z. B. Release 1.0"
                                        />
                                    </FormField>
                                    <FormField
                                        id="rgolive"
                                        label="Geplanter Go-live"
                                    >
                                        <Input id="rgolive" type="date" />
                                    </FormField>
                                </>
                            )}

                            <div className="flex items-center justify-between border-t pt-5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        setStep((s) => Math.max(0, s - 1))
                                    }
                                    disabled={step === 0}
                                >
                                    <ArrowLeft /> Zurück
                                </Button>
                                <div className="flex items-center gap-2">
                                    {(step === 3 || step === 4) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={next}
                                        >
                                            Überspringen
                                        </Button>
                                    )}
                                    <Button type="button" onClick={next}>
                                        {isLast ? 'Fertig' : 'Weiter'}{' '}
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function Header({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="space-y-1">
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}

import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bug,
    CircleCheck,
    ClipboardCheck,
    FileText,
    GitCommitHorizontal,
    OctagonAlert,
    Rocket,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Pricing } from '@/components/pricing';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

const features: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: ClipboardCheck,
        title: 'Strukturierte Prüfungen',
        description:
            'Quick Checks und Test Cases in Suiten – mit klaren Anweisungen und erwartetem Ergebnis.',
    },
    {
        icon: Bug,
        title: 'Nachvollziehbare Issues',
        description:
            'Aus jeder Prüfung wird bei Bedarf ein Issue – mit Screenshot, Build-Bezug und Retest.',
    },
    {
        icon: OctagonAlert,
        title: 'Go-live-Blocker im Blick',
        description:
            'Kritische Probleme werden klar als Blocker markiert und nirgends übersehen.',
    },
    {
        icon: ShieldCheck,
        title: 'Freigaben mit Grundlage',
        description:
            'Freigebende sehen Testfortschritt, offene Issues und Risiken – gebunden an einen Build.',
    },
    {
        icon: GitCommitHorizontal,
        title: 'Builds & Versionen',
        description:
            'Jeder Testlauf und jede Freigabe ist einem konkreten Build zugeordnet.',
    },
    {
        icon: FileText,
        title: 'Abschlussbericht',
        description:
            'Ein druckbarer Bericht dokumentiert Prüfstand, Freigaben und bekannte Einschränkungen.',
    },
];

const flow = [
    {
        step: '1',
        title: 'Build eintragen',
        description:
            'Neuer Softwarestand wird als Build mit Version und Commit hinterlegt.',
    },
    {
        step: '2',
        title: 'Kundentest',
        description:
            'Zugewiesene Prüfungen werden im Test-Runner durchgeführt.',
    },
    {
        step: '3',
        title: 'Fehler beheben',
        description:
            'Gemeldete Probleme werden bearbeitet und zum Retest gestellt.',
    },
    {
        step: '4',
        title: 'Freigabe',
        description:
            'Berechtigte Personen geben den konkreten Build frei – oder mit Bedingungen.',
    },
    {
        step: '5',
        title: 'Go-live',
        description:
            'Der freigegebene Stand geht live, dokumentiert im Abschlussbericht.',
    },
];

const audiences = [
    {
        title: 'Agenturen',
        description:
            'Kundenabnahmen strukturiert und nachvollziehbar durchführen.',
    },
    {
        title: 'Freelancer',
        description: 'Professioneller Abnahmeprozess ohne eigenes Tooling.',
    },
    {
        title: 'Softwareteams',
        description: 'Klare Trennung zwischen Entwicklung, Test und Freigabe.',
    },
    {
        title: 'Kunden',
        description:
            'Verständliche Prüfungen – auch ohne technisches Vorwissen.',
    },
];

const faqs = [
    {
        q: 'Ist LaunchGate ein Ersatz für Jira oder GitHub Issues?',
        a: 'Nein. LaunchGate konzentriert sich auf die Phase zwischen fertiger Entwicklung und Go-live: Kundentest, Fehlerbehebung, Freigabe. Es ergänzt bestehende Tools, statt sie zu ersetzen.',
    },
    {
        q: 'Trifft LaunchGate die Go-live-Entscheidung automatisch?',
        a: 'Nein. LaunchGate zeigt nur die Entscheidungsgrundlage – offene Blocker, Testfortschritt und Freigaben. Die Entscheidung trifft immer eine berechtigte Person.',
    },
    {
        q: 'Verstehen auch nicht-technische Kunden das Tool?',
        a: 'Ja. Der Test-Runner führt Schritt für Schritt durch die Prüfungen, in verständlicher Sprache und ohne Fachbegriffe.',
    },
    {
        q: 'Sind Freigaben an einen Build gebunden?',
        a: 'Ja. Jede Freigabe gilt für einen konkreten Build. Wird ein neuer Build veröffentlicht, kann die Freigabe ungültig werden.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Releases sicher freigeben" />
            <div className="min-h-screen bg-background text-foreground">
                {/* Nav */}
                <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Rocket className="size-5" />
                            </span>
                            <span className="text-lg font-semibold">
                                LaunchGate
                            </span>
                        </div>
                        <nav className="flex items-center gap-2">
                            <ThemeToggle />
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>
                                        Zum Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="hidden sm:inline-flex"
                                    >
                                        <Link href={login()}>Anmelden</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>
                                            Kostenlos starten
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <ShieldCheck className="size-4" /> Kontrolle
                                über jeden Go-live
                            </span>
                            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                                Releases gemeinsam testen. Probleme
                                nachvollziehbar lösen. Go-lives sicher
                                freigeben.
                            </h1>
                            <p className="mt-5 max-w-lg text-lg text-pretty text-muted-foreground">
                                LaunchGate strukturiert die Phase zwischen
                                fertiger Entwicklung und Go-live: Kundentest,
                                Fehlerbehebung, Retest und offizielle Freigabe –
                                für technische Teams und ihre Kunden.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button size="lg" asChild>
                                    <Link
                                        href={
                                            auth.user ? dashboard() : register()
                                        }
                                    >
                                        Kostenlos starten <ArrowRight />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <a href="#funktionen">Funktionen ansehen</a>
                                </Button>
                            </div>
                        </div>
                        <DashboardPreview />
                    </div>
                </section>

                {/* Problem / Solution */}
                <section className="border-y bg-muted/30">
                    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-2">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Das Problem
                            </h2>
                            <ul className="mt-4 space-y-3 text-muted-foreground">
                                {[
                                    'Kundentests laufen über E-Mail, Excel und Screenshots verstreut.',
                                    'Niemand weiß, ob wirklich alles Wichtige geprüft wurde.',
                                    'Freigaben sind mündlich und nicht an einen Stand gebunden.',
                                    'Nach dem Go-live fehlt die Dokumentation, was abgenommen wurde.',
                                ].map((item) => (
                                    <li key={item} className="flex gap-2.5">
                                        <OctagonAlert className="mt-0.5 size-5 shrink-0 text-danger" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Mit LaunchGate
                            </h2>
                            <ul className="mt-4 space-y-3 text-muted-foreground">
                                {[
                                    'Alle Prüfungen an einem Ort – mit klarem Fortschritt.',
                                    'Pflichtprüfungen und Go-live-Blocker sind eindeutig sichtbar.',
                                    'Freigaben sind an einen konkreten Build gebunden.',
                                    'Ein Abschlussbericht dokumentiert den gesamten Ablauf.',
                                ].map((item) => (
                                    <li key={item} className="flex gap-2.5">
                                        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section
                    id="funktionen"
                    className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Kernfunktionen
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Alles, was ein sauberer Abnahme- und Freigabeprozess
                            braucht.
                        </p>
                    </div>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-xl border bg-card p-5"
                            >
                                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <feature.icon className="size-5" />
                                </span>
                                <h3 className="mt-4 font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Flow */}
                <section className="border-y bg-muted/30">
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Ablauf eines Releases
                        </h2>
                        <div className="mt-10 grid gap-4 md:grid-cols-5">
                            {flow.map((item) => (
                                <div
                                    key={item.step}
                                    className="rounded-xl border bg-card p-5"
                                >
                                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                        {item.step}
                                    </span>
                                    <h3 className="mt-3 font-medium">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Audiences */}
                <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Für wen ist LaunchGate?
                    </h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {audiences.map((audience) => (
                            <div
                                key={audience.title}
                                className="rounded-xl border p-5"
                            >
                                <UserCheck className="size-5 text-primary" />
                                <h3 className="mt-3 font-semibold">
                                    {audience.title}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {audience.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-sm text-muted-foreground">
                        Geplante Integrationen: Jira, GitHub, GitLab und Slack –
                        für automatischen Build-Import und Benachrichtigungen.
                    </p>
                </section>

                {/* Pricing */}
                <section id="preise" className="border-y bg-muted/30">
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Preise
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Starte kostenlos und wachse mit deinem Bedarf.
                            </p>
                        </div>
                        <div className="mt-10">
                            <Pricing />
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Häufige Fragen
                    </h2>
                    <div className="mt-8 divide-y rounded-xl border">
                        {faqs.map((faq) => (
                            <details key={faq.q} className="group px-5 py-4">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                                    {faq.q}
                                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                                </summary>
                                <p className="mt-3 text-sm text-pretty text-muted-foreground">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                    <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Bereit für sichere Go-lives?
                        </h2>
                        <p className="max-w-lg text-primary-foreground/80">
                            Richte in wenigen Minuten deine Organisation ein und
                            starte deinen ersten strukturierten Release.
                        </p>
                        <Button size="lg" variant="secondary" asChild>
                            <Link href={auth.user ? dashboard() : register()}>
                                Kostenlos starten <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
                        <div className="flex items-center gap-2">
                            <Rocket className="size-4 text-primary" />
                            <span className="font-medium text-foreground">
                                LaunchGate
                            </span>
                        </div>
                        <p>
                            © {new Date().getFullYear()} LaunchGate. Alle Rechte
                            vorbehalten.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#funktionen"
                                className="hover:text-foreground"
                            >
                                Funktionen
                            </a>
                            <a href="#preise" className="hover:text-foreground">
                                Preise
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

/** A small, honest preview of the release dashboard (no fabricated data claims). */
function DashboardPreview() {
    return (
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
                <div>
                    <p className="font-semibold">Release 2.3 · Kundenportal</p>
                    <p className="text-xs text-muted-foreground">
                        Müller GmbH · Build 2.3.0-rc.5
                    </p>
                </div>
                <span className="rounded-md border border-info/25 bg-info/10 px-2 py-0.5 text-xs font-medium text-info">
                    In Testphase
                </span>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3">
                <OctagonAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                <div>
                    <p className="text-sm font-semibold">
                        Go-live aktuell nicht empfohlen
                    </p>
                    <p className="text-xs text-muted-foreground">
                        2 Go-live-Blocker offen · Freigabe fehlt
                    </p>
                </div>
            </div>
            <div className="mt-3">
                <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="bg-success" style={{ width: '61%' }} />
                    <div className="bg-danger" style={{ width: '11%' }} />
                    <div className="bg-warning" style={{ width: '6%' }} />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                    11 von 18 Prüfungen erfolgreich
                </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                    { label: 'Blocker', value: '2', tone: 'text-danger' },
                    { label: 'Retests', value: '2', tone: 'text-retest' },
                    {
                        label: 'Freigaben',
                        value: '0',
                        tone: 'text-muted-foreground',
                    },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-2">
                        <p className={`text-lg font-semibold ${stat.tone}`}>
                            {stat.value}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

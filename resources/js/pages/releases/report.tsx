import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';

import { DefinitionList } from '@/components/definition-list';
import {
    ApprovalStatusBadge,
    IssueStatusBadge,
    ReleaseStatusBadge,
    RiskIndicator,
} from '@/components/status/badges';
import { ReviewProgress } from '@/components/status/progress-visuals';
import { Button } from '@/components/ui/button';
import { formatDate, formatDateTime } from '@/lib/format';
import { paths } from '@/lib/routes';
import {
    approvalsForRelease,
    getRelease,
    issuesForRelease,
    snapshotForRelease,
    suitesForRelease,
} from '@/mocks';

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="border-t py-5">
            <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function ReleaseReport({ id }: { id: string }) {
    const release = getRelease(id);
    const snapshot = snapshotForRelease(release.id);
    const issues = issuesForRelease(release.id);
    const approvals = approvalsForRelease(release.id);
    const suites = suitesForRelease(release.id);
    const testers = Array.from(
        new Map(
            suites
                .flatMap((s) => s.items)
                .map((i) => i.assignee)
                .filter((u): u is NonNullable<typeof u> => !!u)
                .map((u) => [u.id, u]),
        ).values(),
    );

    return (
        <>
            <Head title={`Abschlussbericht · ${release.name}`} />

            <div className="no-print border-b bg-muted/40">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={paths.releases.show(release.id)}>
                            <ArrowLeft /> Zurück zum Release
                        </Link>
                    </Button>
                    <Button size="sm" onClick={() => window.print()}>
                        <Printer /> Bericht drucken
                    </Button>
                </div>
            </div>

            <div className="print-container mx-auto max-w-3xl px-6 py-8">
                <header className="flex items-start justify-between gap-4 pb-5">
                    <div>
                        <p className="text-sm font-semibold text-primary">
                            LaunchGate · Abschlussbericht
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold">
                            {release.name}{' '}
                            <span className="text-muted-foreground">
                                {release.version}
                            </span>
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {release.projectName} · {release.clientName}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <ReleaseStatusBadge status={release.status} />
                        <RiskIndicator risk={release.riskLevel} />
                    </div>
                </header>

                <Section title="Eckdaten">
                    <DefinitionList
                        columns={2}
                        items={[
                            {
                                term: 'Projekt',
                                description: release.projectName,
                            },
                            { term: 'Kunde', description: release.clientName },
                            {
                                term: 'Build',
                                description: (
                                    <span className="font-mono">
                                        {release.currentBuild?.label ?? '—'}
                                    </span>
                                ),
                            },
                            {
                                term: 'Umgebung',
                                description: release.environmentName ?? '—',
                            },
                            {
                                term: 'Testzeitraum',
                                description: `${formatDate(release.testStartsAt)} – ${formatDate(release.testEndsAt)}`,
                            },
                            {
                                term: 'Go-live',
                                description: formatDate(
                                    release.deployedAt ??
                                        release.plannedGoLiveAt,
                                ),
                            },
                            {
                                term: 'Verantwortlich',
                                description: release.projectManager.name,
                            },
                            {
                                term: 'Abgeschlossen',
                                description: formatDateTime(
                                    release.completedAt,
                                ),
                            },
                        ]}
                    />
                </Section>

                <Section title="Prüfer">
                    <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        {testers.map((tester) => (
                            <li key={tester.id}>
                                {tester.name}
                                {tester.jobTitle && (
                                    <span className="text-muted-foreground">
                                        {' '}
                                        · {tester.jobTitle}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="Testfortschritt & Ergebnisse">
                    <ReviewProgress progress={release.progress} />
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <div>
                            <span className="text-2xl font-semibold text-success">
                                {release.progress.passed}
                            </span>
                            <p className="text-muted-foreground">Erfolgreich</p>
                        </div>
                        <div>
                            <span className="text-2xl font-semibold text-danger">
                                {release.progress.failed}
                            </span>
                            <p className="text-muted-foreground">Probleme</p>
                        </div>
                        <div>
                            <span className="text-2xl font-semibold">
                                {release.progress.notApplicable}
                            </span>
                            <p className="text-muted-foreground">
                                Nicht relevant
                            </p>
                        </div>
                        <div>
                            <span className="text-2xl font-semibold">
                                {release.progress.total}
                            </span>
                            <p className="text-muted-foreground">Gesamt</p>
                        </div>
                    </div>
                </Section>

                <Section title="Issues">
                    {issues.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Keine Issues wurden im Prüfzeitraum gemeldet.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {issues.map((issue) => (
                                <li
                                    key={issue.id}
                                    className="flex items-center justify-between gap-2 text-sm"
                                >
                                    <span>
                                        <span className="text-muted-foreground">
                                            #{issue.number}
                                        </span>{' '}
                                        {issue.title}
                                    </span>
                                    <IssueStatusBadge
                                        status={issue.status}
                                        size="sm"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                <Section title="Bekannte Einschränkungen">
                    {release.knownLimitations.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Keine.</p>
                    ) : (
                        <ul className="list-disc space-y-1 pl-5 text-sm">
                            {release.knownLimitations.map((l) => (
                                <li key={l.id}>
                                    <span className="font-medium">
                                        {l.title}:
                                    </span>{' '}
                                    {l.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                <Section title="Freigaben">
                    {approvals.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Keine Freigaben erfasst.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-3 text-sm">
                            {approvals.map((approval) => (
                                <li
                                    key={approval.id}
                                    className="flex items-start gap-3"
                                >
                                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                Build {approval.buildLabel}
                                            </span>
                                            <ApprovalStatusBadge
                                                status={approval.status}
                                                size="sm"
                                            />
                                        </div>
                                        <p className="text-muted-foreground">
                                            {approval.decision?.decidedBy.name}{' '}
                                            ·{' '}
                                            {formatDateTime(approval.decidedAt)}
                                        </p>
                                        {approval.decision?.conditions && (
                                            <p className="mt-0.5">
                                                Bedingung:{' '}
                                                {approval.decision.conditions}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                <Section title="Prüfsumme des Snapshots">
                    {snapshot ? (
                        <div className="text-sm">
                            <p className="text-muted-foreground">
                                Erzeugt am{' '}
                                {formatDateTime(snapshot.generatedAt)} von{' '}
                                {snapshot.generatedBy.name}
                            </p>
                            <code className="mt-2 block rounded bg-muted p-2 font-mono text-xs break-all">
                                {snapshot.checksum}
                            </code>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Kein Snapshot vorhanden.
                        </p>
                    )}
                </Section>

                <footer className="border-t pt-4 text-xs text-muted-foreground">
                    Dieser Bericht dokumentiert den Prüf- und Freigabestand zum
                    Zeitpunkt der Erstellung. Er wurde mit LaunchGate erzeugt.
                </footer>
            </div>
        </>
    );
}

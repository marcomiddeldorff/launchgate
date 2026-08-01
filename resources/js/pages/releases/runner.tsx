import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Ban,
    CircleCheck,
    CircleHelp,
    CircleSlash,
    CircleX,
    ExternalLink,
    Paperclip,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import {
    AttachmentList,
    FileUploader,
} from '@/components/attachments/attachments';
import { CharacterCounter, FormField } from '@/components/forms/form-field';
import { ReviewResultBadge } from '@/components/status/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatRelative } from '@/lib/format';
import { paths } from '@/lib/routes';
import { getRelease, runnerItemsForRelease, suitesForRelease } from '@/mocks';
import type { ReviewResult } from '@/types';

const resultActions: {
    result: ReviewResult;
    label: string;
    icon: typeof CircleCheck;
    className: string;
}[] = [
    {
        result: 'passed',
        label: 'Erfolgreich',
        icon: CircleCheck,
        className: 'border-success/40 text-success hover:bg-success/10',
    },
    {
        result: 'failed',
        label: 'Problem gefunden',
        icon: CircleX,
        className: 'border-danger/40 text-danger hover:bg-danger/10',
    },
    {
        result: 'blocked',
        label: 'Nicht prüfbar',
        icon: Ban,
        className: 'border-warning/40 text-warning hover:bg-warning/10',
    },
    {
        result: 'question',
        label: 'Rückfrage',
        icon: CircleHelp,
        className: 'border-info/40 text-info hover:bg-info/10',
    },
    {
        result: 'not_applicable',
        label: 'Nicht relevant',
        icon: CircleSlash,
        className: 'border-border text-muted-foreground hover:bg-muted',
    },
];

export default function TestRunner({ id }: { id: string }) {
    const release = getRelease(id);
    const items = runnerItemsForRelease(id);
    const suites = suitesForRelease(id);
    const suiteName = (suiteId: string) =>
        suites.find((s) => s.id === suiteId)?.name ?? '';

    const [index, setIndex] = useState(0);
    const [results, setResults] = useState<Record<string, ReviewResult>>({});
    const [issueOpen, setIssueOpen] = useState(false);
    const [description, setDescription] = useState('');

    const item = items[index];
    const done = Object.keys(results).length;
    const total = items.length;
    const finished = index >= total;

    const recordAndAdvance = (result: ReviewResult) => {
        if (!item) {
            return;
        }

        setResults((prev) => ({ ...prev, [item.id]: result }));
        setIndex((i) => i + 1);
        toast.success(
            `Ergebnis gespeichert: ${result === 'passed' ? 'Erfolgreich' : 'Erfasst'}`,
        );
    };

    const handleResult = (result: ReviewResult) => {
        if (result === 'failed') {
            setIssueOpen(true);

            return;
        }

        recordAndAdvance(result);
    };

    const submitIssue = (event: FormEvent) => {
        event.preventDefault();
        setIssueOpen(false);
        setDescription('');
        toast.success('Issue erstellt und mit dieser Prüfung verknüpft.');
        recordAndAdvance('failed');
    };

    const progressValue = useMemo(
        () => (total === 0 ? 0 : (Math.min(index, total) / total) * 100),
        [index, total],
    );

    return (
        <>
            <Head title={`Test-Runner · ${release.name}`} />

            {/* Sticky top bar with progress. */}
            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label="Schließen"
                    >
                        <Link href={paths.releases.show(release.id)}>
                            <X />
                        </Link>
                    </Button>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {release.name} · {release.projectName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {finished
                                ? 'Abgeschlossen'
                                : `Prüfung ${index + 1} von ${total}`}
                        </p>
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">
                        {done}/{total}
                    </span>
                </div>
                <Progress value={progressValue} className="h-1 rounded-none" />
            </div>

            <div className="mx-auto w-full max-w-3xl px-4 py-6">
                {finished ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                            <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
                                <CircleCheck className="size-7" />
                            </span>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Alle Prüfungen bearbeitet
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Du hast {done} von {total} Prüfungen
                                    abgeschlossen. Vielen Dank!
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIndex(0)}
                                >
                                    Von vorne beginnen
                                </Button>
                                <Button asChild>
                                    <Link
                                        href={paths.releases.show(release.id)}
                                    >
                                        Zur Release-Übersicht <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    item && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {suiteName(item.suiteId)}
                                </p>
                                <h1 className="mt-1 text-xl font-semibold text-balance">
                                    {item.title}
                                </h1>
                            </div>

                            <Card>
                                <CardContent className="space-y-4 py-5">
                                    {item.preconditions && (
                                        <section>
                                            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                Voraussetzungen
                                            </h2>
                                            <p className="mt-1 text-sm text-pretty">
                                                {item.preconditions}
                                            </p>
                                        </section>
                                    )}

                                    <section>
                                        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            Was soll geprüft werden?
                                        </h2>
                                        <p className="mt-1 text-sm text-pretty">
                                            {item.instruction}
                                        </p>
                                    </section>

                                    {item.steps.length > 0 && (
                                        <section>
                                            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                Schritte
                                            </h2>
                                            <ol className="mt-2 flex flex-col gap-2">
                                                {item.steps.map((step) => (
                                                    <li
                                                        key={step.id}
                                                        className="flex gap-3 text-sm"
                                                    >
                                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                                            {step.position}
                                                        </span>
                                                        <div>
                                                            <p>
                                                                {
                                                                    step.instruction
                                                                }
                                                            </p>
                                                            {step.expectedResult && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Erwartet:{' '}
                                                                    {
                                                                        step.expectedResult
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                        </section>
                                    )}

                                    <section className="rounded-lg border border-success/30 bg-success/5 p-3">
                                        <h2 className="text-xs font-semibold tracking-wide text-success uppercase">
                                            Erwartetes Ergebnis
                                        </h2>
                                        <p className="mt-1 text-sm text-pretty">
                                            {item.expectedResult}
                                        </p>
                                    </section>

                                    {item.attachments.length > 0 && (
                                        <section>
                                            <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                Anhänge
                                            </h2>
                                            <div className="mt-2">
                                                <AttachmentList
                                                    attachments={
                                                        item.attachments
                                                    }
                                                />
                                            </div>
                                        </section>
                                    )}

                                    {item.lastRun && (
                                        <section className="flex flex-wrap items-center gap-2 border-t pt-3 text-sm">
                                            <span className="text-muted-foreground">
                                                Letztes Ergebnis:
                                            </span>
                                            <ReviewResultBadge
                                                result={item.lastRun.result}
                                                size="sm"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {item.lastRun.testedBy.name} ·{' '}
                                                {formatRelative(
                                                    item.lastRun.createdAt,
                                                )}{' '}
                                                · Build{' '}
                                                {item.lastRun.buildLabel}
                                            </span>
                                        </section>
                                    )}

                                    {release.currentBuild && (
                                        <a
                                            href="https://staging.portal.mueller-gmbh.de"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="size-4" />{' '}
                                            Testumgebung öffnen (
                                            {release.environmentName})
                                        </a>
                                    )}
                                </CardContent>
                            </Card>

                            <div>
                                <p className="mb-2 text-sm font-medium text-muted-foreground">
                                    Wie war das Ergebnis?
                                </p>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {resultActions.map((action) => (
                                        <button
                                            key={action.result}
                                            type="button"
                                            onClick={() =>
                                                handleResult(action.result)
                                            }
                                            className={`flex items-center gap-3 rounded-lg border-2 bg-card px-4 py-3.5 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${action.className}`}
                                        >
                                            <action.icon className="size-5 shrink-0" />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        setIndex((i) => Math.max(0, i - 1))
                                    }
                                    disabled={index === 0}
                                >
                                    Zurück
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIndex((i) => i + 1)}
                                >
                                    Überspringen <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Problem-gefunden → Issue-Formular */}
            <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Problem melden</DialogTitle>
                        <DialogDescription>
                            Aus dieser Prüfung wird ein Issue erstellt und mit „
                            {item?.title}“ verknüpft.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitIssue} className="space-y-4">
                        <FormField id="issue-title" label="Titel" required>
                            <Input
                                id="issue-title"
                                required
                                defaultValue={
                                    item ? `Problem bei „${item.title}“` : ''
                                }
                            />
                        </FormField>
                        <FormField
                            id="issue-desc"
                            label="Beschreibung"
                            required
                        >
                            <Textarea
                                id="issue-desc"
                                required
                                rows={3}
                                value={description}
                                maxLength={500}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Was ist passiert?"
                            />
                            <CharacterCounter value={description} max={500} />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                                id="issue-expected"
                                label="Erwartetes Verhalten"
                            >
                                <Textarea id="issue-expected" rows={2} />
                            </FormField>
                            <FormField
                                id="issue-actual"
                                label="Tatsächliches Verhalten"
                            >
                                <Textarea id="issue-actual" rows={2} />
                            </FormField>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                                id="issue-severity"
                                label="Melderschwere"
                                required
                            >
                                <Select defaultValue="major">
                                    <SelectTrigger id="issue-severity">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trivial">
                                            Trivial
                                        </SelectItem>
                                        <SelectItem value="minor">
                                            Gering
                                        </SelectItem>
                                        <SelectItem value="major">
                                            Erheblich
                                        </SelectItem>
                                        <SelectItem value="critical">
                                            Kritisch
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField id="issue-url" label="Getestete URL">
                                <Input
                                    id="issue-url"
                                    type="url"
                                    defaultValue="https://staging.portal.mueller-gmbh.de"
                                />
                            </FormField>
                        </div>
                        <FormField id="issue-screenshot" label="Screenshot">
                            <FileUploader
                                label="Screenshot hierher ziehen oder auswählen"
                                hint="PNG oder JPG · bis 10 MB"
                            />
                        </FormField>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIssueOpen(false)}
                            >
                                Abbrechen
                            </Button>
                            <Button type="submit">
                                <Paperclip /> Issue erstellen
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

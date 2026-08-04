import { Head, Link } from '@inertiajs/react';
import { GitCommitHorizontal, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';

import { Banner } from '@/components/banner';
import { DefinitionList } from '@/components/definition-list';
import { PageHeader } from '@/components/page-header';
import { GoLiveReadinessPanel } from '@/components/releases/go-live-readiness';
import { KnownLimitationsPanel } from '@/components/releases/release-bits';
import { ApprovalStatusBadge } from '@/components/status/badges';
import { ReviewProgress } from '@/components/status/progress-visuals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { UserInline } from '@/components/user-avatar';
import { useAppContext } from '@/hooks/use-app-context';
import { formatDate, formatDateTime } from '@/lib/format';
import { getApproval, getRelease } from '@/mocks';
import approvalRoutes from '@/routes/approvals';
import releaseRoutes from '@/routes/releases';
import type { ApprovalDecisionType } from '@/types';

const decisionOptions: {
    value: ApprovalDecisionType;
    label: string;
    hint: string;
}[] = [
    {
        value: 'approve',
        label: 'Freigeben',
        hint: 'Der Build wird für den Go-live freigegeben.',
    },
    {
        value: 'approve_with_conditions',
        label: 'Mit Bedingungen freigeben',
        hint: 'Freigabe unter definierten Auflagen.',
    },
    {
        value: 'reject',
        label: 'Ablehnen',
        hint: 'Der Build wird nicht freigegeben.',
    },
];

export default function ApprovalShow({ id }: { id: string }) {
    const { abilities } = useAppContext();
    const approval = getApproval(id);
    const release = getRelease(approval.releaseId);
    const isDecided = approval.status !== 'pending';

    const [decision, setDecision] = useState<ApprovalDecisionType>('approve');
    const [conditions, setConditions] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | undefined>();

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (
            decision === 'approve_with_conditions' &&
            conditions.trim() === ''
        ) {
            setError('Bitte gib die Bedingungen für die Freigabe an.');

            return;
        }

        setError(undefined);
        toast.success(
            decision === 'reject'
                ? 'Freigabe abgelehnt.'
                : 'Freigabe erteilt – gebunden an Build ' + approval.buildLabel,
        );
    };

    return (
        <>
            <Head title={`Freigabe · ${approval.releaseName}`} />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        {
                            title: 'Freigaben',
                            href: approvalRoutes.index.url(),
                        },
                        { title: approval.releaseName },
                    ]}
                    title="Freigabeentscheidung"
                    description={`${approval.releaseName} · ${release.projectName}`}
                    actions={<ApprovalStatusBadge status={approval.status} />}
                />

                <Banner
                    tone="warning"
                    icon={GitCommitHorizontal}
                    title="Diese Freigabe gilt für einen konkreten Build"
                >
                    Die Entscheidung bezieht sich ausschließlich auf Build{' '}
                    <strong>{approval.buildLabel}</strong>. Wird ein neuer Build
                    veröffentlicht, kann die Freigabe ungültig werden und muss
                    erneut eingeholt werden.
                </Banner>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Entscheidungsgrundlage</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <DefinitionList
                                    columns={2}
                                    items={[
                                        {
                                            term: 'Build',
                                            description: (
                                                <span className="font-mono">
                                                    {approval.buildLabel}
                                                </span>
                                            ),
                                        },
                                        {
                                            term: 'Angefordert von',
                                            description: (
                                                <UserInline
                                                    user={approval.requestedBy}
                                                    size="xs"
                                                />
                                            ),
                                        },
                                        {
                                            term: 'Geplanter Go-live',
                                            description: formatDate(
                                                release.plannedGoLiveAt,
                                            ),
                                        },
                                        {
                                            term: 'Bereits erteilte Freigaben',
                                            description: `${approval.snapshot.priorApprovals}`,
                                        },
                                    ]}
                                />
                                <div>
                                    <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        Testfortschritt
                                    </p>
                                    <ReviewProgress
                                        progress={approval.snapshot.progress}
                                    />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg border p-3 text-center">
                                        <p
                                            className={`text-2xl font-semibold ${approval.snapshot.openBlockerCount > 0 ? 'text-danger' : 'text-success'}`}
                                        >
                                            {approval.snapshot.openBlockerCount}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Offene Go-live-Blocker
                                        </p>
                                    </div>
                                    <div className="rounded-lg border p-3 text-center">
                                        <p className="text-2xl font-semibold">
                                            {approval.snapshot.openIssueCount}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Offene Issues
                                        </p>
                                    </div>
                                    <div className="rounded-lg border p-3 text-center">
                                        <p className="text-2xl font-semibold">
                                            {
                                                approval.snapshot
                                                    .pendingRetestCount
                                            }
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Ausstehende Retests
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        Bekannte Einschränkungen
                                    </p>
                                    <KnownLimitationsPanel
                                        limitations={
                                            approval.snapshot.knownLimitations
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {isDecided && approval.decision ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Entscheidung</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ApprovalStatusBadge
                                            status={approval.status}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            durch{' '}
                                            {approval.decision.decidedBy.name} ·{' '}
                                            {formatDateTime(
                                                approval.decision.decidedAt,
                                            )}
                                        </span>
                                    </div>
                                    {approval.decision.conditions && (
                                        <Banner tone="info" title="Bedingungen">
                                            {approval.decision.conditions}
                                        </Banner>
                                    )}
                                    {approval.decision.comment && (
                                        <p className="text-sm text-pretty">
                                            {approval.decision.comment}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ) : abilities.decideApprovals ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Deine Entscheidung</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={submit}
                                        className="space-y-5"
                                    >
                                        <RadioGroup
                                            value={decision}
                                            onValueChange={(v) =>
                                                setDecision(
                                                    v as ApprovalDecisionType,
                                                )
                                            }
                                            className="gap-3"
                                        >
                                            {decisionOptions.map((option) => (
                                                <label
                                                    key={option.value}
                                                    htmlFor={`decision-${option.value}`}
                                                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${decision === option.value ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
                                                >
                                                    <RadioGroupItem
                                                        id={`decision-${option.value}`}
                                                        value={option.value}
                                                        className="mt-0.5"
                                                    />
                                                    <span>
                                                        <span className="block text-sm font-medium">
                                                            {option.label}
                                                        </span>
                                                        <span className="block text-xs text-muted-foreground">
                                                            {option.hint}
                                                        </span>
                                                    </span>
                                                </label>
                                            ))}
                                        </RadioGroup>

                                        {decision ===
                                            'approve_with_conditions' && (
                                            <div className="grid gap-2">
                                                <Label htmlFor="conditions">
                                                    Bedingungen{' '}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </Label>
                                                <Textarea
                                                    id="conditions"
                                                    value={conditions}
                                                    onChange={(e) =>
                                                        setConditions(
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={3}
                                                    placeholder="Unter welchen Bedingungen wird freigegeben?"
                                                    aria-invalid={!!error}
                                                />
                                                {error && (
                                                    <p className="text-sm text-danger">
                                                        {error}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid gap-2">
                                            <Label htmlFor="approval-comment">
                                                Kommentar
                                            </Label>
                                            <Textarea
                                                id="approval-comment"
                                                value={comment}
                                                onChange={(e) =>
                                                    setComment(e.target.value)
                                                }
                                                rows={2}
                                                placeholder="Optionale Anmerkung zur Entscheidung"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                variant={
                                                    decision === 'reject'
                                                        ? 'destructive'
                                                        : 'default'
                                                }
                                            >
                                                {decision === 'reject' ? (
                                                    'Freigabe ablehnen'
                                                ) : (
                                                    <>
                                                        <ShieldCheck />{' '}
                                                        Entscheidung bestätigen
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <Banner tone="neutral" title="Keine Berechtigung">
                                Du bist für diese Freigabe nicht als
                                entscheidende Person hinterlegt.
                            </Banner>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <GoLiveReadinessPanel
                            release={release}
                            hasRequiredApproval={[
                                'approved',
                                'approved_with_conditions',
                            ].includes(approval.status)}
                        />
                        <Card>
                            <CardHeader>
                                <CardTitle>Nachricht zur Anfrage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {approval.message ? (
                                    <p className="text-sm text-pretty">
                                        {approval.message}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Keine Nachricht.
                                    </p>
                                )}
                                <div className="mt-3">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={releaseRoutes.show.url(
                                                release.id,
                                            )}
                                        >
                                            Zur Release-Übersicht
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

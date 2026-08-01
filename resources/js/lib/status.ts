import {
    Ban,
    CalendarClock,
    CheckCheck,
    Circle,
    CircleAlert,
    CircleCheck,
    CircleDashed,
    CircleDot,
    CircleHelp,
    CircleOff,
    CircleSlash,
    CircleX,
    Clock,
    Eye,
    FlaskConical,
    Globe,
    Laptop,
    LoaderCircle,
    Minus,
    OctagonAlert,
    PencilRuler,
    RefreshCw,
    Rocket,
    RotateCcw,
    Shield,
    ShieldAlert,
    ShieldCheck,
    SignalHigh,
    SignalLow,
    SignalMedium,
    UserCheck,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type {
    ApprovalStatus,
    BuildStatus,
    EnvironmentType,
    IssueImpact,
    IssueSeverity,
    IssueStatus,
    Priority,
    ReleaseStatus,
    ReviewItemStatus,
    ReviewResult,
    RiskLevel,
} from '@/types';

/**
 * Visual tone shared by every status surface. The concrete Tailwind classes
 * for each tone live in `components/status/status-badge.tsx`, so colour usage
 * stays consistent and is defined in exactly one place.
 */
export type StatusTone =
    | 'neutral'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'retest';

export type StatusMeta = {
    label: string;
    tone: StatusTone;
    icon: LucideIcon;
    /** Optional longer description used in tooltips / detail views. */
    description?: string;
};

export const releaseStatusMeta: Record<ReleaseStatus, StatusMeta> = {
    draft: { label: 'Entwurf', tone: 'neutral', icon: PencilRuler },
    testing: { label: 'In Testphase', tone: 'info', icon: FlaskConical },
    blocked: { label: 'Blockiert', tone: 'danger', icon: OctagonAlert },
    pending_approval: {
        label: 'Freigabe ausstehend',
        tone: 'warning',
        icon: Clock,
    },
    approved: { label: 'Freigegeben', tone: 'success', icon: ShieldCheck },
    scheduled: { label: 'Go-live geplant', tone: 'info', icon: CalendarClock },
    live: { label: 'Live', tone: 'primary', icon: Rocket },
    completed: { label: 'Abgeschlossen', tone: 'success', icon: CheckCheck },
    cancelled: { label: 'Abgebrochen', tone: 'neutral', icon: CircleOff },
};

export const riskLevelMeta: Record<RiskLevel, StatusMeta> = {
    low: { label: 'Geringes Risiko', tone: 'success', icon: ShieldCheck },
    medium: { label: 'Mittleres Risiko', tone: 'warning', icon: Shield },
    high: { label: 'Hohes Risiko', tone: 'warning', icon: ShieldAlert },
    critical: { label: 'Kritisches Risiko', tone: 'danger', icon: ShieldAlert },
};

export const buildStatusMeta: Record<BuildStatus, StatusMeta> = {
    pending: { label: 'Ausstehend', tone: 'neutral', icon: Clock },
    building: { label: 'Wird erstellt', tone: 'info', icon: LoaderCircle },
    deployed: { label: 'Deployed', tone: 'success', icon: CircleCheck },
    failed: { label: 'Fehlgeschlagen', tone: 'danger', icon: CircleX },
    superseded: { label: 'Ersetzt', tone: 'neutral', icon: RefreshCw },
};

export const reviewResultMeta: Record<ReviewResult, StatusMeta> = {
    passed: { label: 'Erfolgreich', tone: 'success', icon: CircleCheck },
    failed: { label: 'Problem gefunden', tone: 'danger', icon: CircleX },
    blocked: { label: 'Nicht prüfbar', tone: 'warning', icon: Ban },
    question: { label: 'Rückfrage', tone: 'info', icon: CircleHelp },
    not_applicable: {
        label: 'Nicht relevant',
        tone: 'neutral',
        icon: CircleSlash,
    },
};

export const reviewItemStatusMeta: Record<ReviewItemStatus, StatusMeta> = {
    not_started: { label: 'Offen', tone: 'neutral', icon: Circle },
    in_progress: { label: 'In Prüfung', tone: 'info', icon: CircleDashed },
    passed: { label: 'Erfolgreich', tone: 'success', icon: CircleCheck },
    failed: { label: 'Problem gefunden', tone: 'danger', icon: CircleX },
    blocked: { label: 'Nicht prüfbar', tone: 'warning', icon: Ban },
    question: { label: 'Rückfrage', tone: 'info', icon: CircleHelp },
    not_applicable: {
        label: 'Nicht relevant',
        tone: 'neutral',
        icon: CircleSlash,
    },
    retest_required: { label: 'Retest nötig', tone: 'retest', icon: RotateCcw },
};

export const issueStatusMeta: Record<IssueStatus, StatusMeta> = {
    open: { label: 'Offen', tone: 'danger', icon: CircleDot },
    in_progress: { label: 'In Bearbeitung', tone: 'info', icon: CircleDashed },
    fixed: { label: 'Behoben', tone: 'success', icon: Wrench },
    retest: { label: 'Retest nötig', tone: 'retest', icon: RotateCcw },
    reopened: { label: 'Wieder geöffnet', tone: 'warning', icon: RefreshCw },
    closed: { label: 'Geschlossen', tone: 'success', icon: CircleCheck },
    wont_fix: { label: 'Wird nicht behoben', tone: 'neutral', icon: Ban },
};

export const issueSeverityMeta: Record<IssueSeverity, StatusMeta> = {
    trivial: { label: 'Trivial', tone: 'neutral', icon: SignalLow },
    minor: { label: 'Gering', tone: 'info', icon: SignalLow },
    major: { label: 'Erheblich', tone: 'warning', icon: SignalMedium },
    critical: { label: 'Kritisch', tone: 'danger', icon: SignalHigh },
};

export const issueImpactMeta: Record<IssueImpact, StatusMeta> = {
    cosmetic: { label: 'Kosmetisch', tone: 'neutral', icon: Minus },
    minor: { label: 'Geringe Auswirkung', tone: 'info', icon: SignalLow },
    major: { label: 'Hohe Auswirkung', tone: 'warning', icon: SignalMedium },
    go_live_blocker: {
        label: 'Go-live-Blocker',
        tone: 'danger',
        icon: OctagonAlert,
    },
};

export const priorityMeta: Record<Priority, StatusMeta> = {
    low: { label: 'Niedrig', tone: 'neutral', icon: SignalLow },
    medium: { label: 'Mittel', tone: 'info', icon: SignalMedium },
    high: { label: 'Hoch', tone: 'warning', icon: SignalHigh },
    urgent: { label: 'Dringend', tone: 'danger', icon: CircleAlert },
};

export const approvalStatusMeta: Record<ApprovalStatus, StatusMeta> = {
    pending: { label: 'Ausstehend', tone: 'warning', icon: Clock },
    approved: { label: 'Freigegeben', tone: 'success', icon: UserCheck },
    approved_with_conditions: {
        label: 'Mit Bedingungen freigegeben',
        tone: 'info',
        icon: ShieldCheck,
    },
    rejected: { label: 'Abgelehnt', tone: 'danger', icon: CircleX },
    expired: { label: 'Abgelaufen', tone: 'neutral', icon: CircleOff },
};

export const environmentTypeMeta: Record<EnvironmentType, StatusMeta> = {
    staging: { label: 'Staging', tone: 'info', icon: FlaskConical },
    production: { label: 'Produktion', tone: 'success', icon: Globe },
    review: { label: 'Review', tone: 'retest', icon: Eye },
    local: { label: 'Lokal', tone: 'neutral', icon: Laptop },
};

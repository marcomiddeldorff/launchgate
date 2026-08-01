import { releases } from '@/mocks/releases';
import { users } from '@/mocks/users';
import type { ApprovalRequest } from '@/types';

const releaseById = (id: string) => releases.find((r) => r.id === id)!;

export const approvals: ApprovalRequest[] = [
    {
        id: 'apr_hv_14',
        releaseId: 'rel_hv_14',
        releaseName: 'Release 1.4',
        buildLabel: '1.4.0-rc.2',
        buildId: 'bld_hv_142',
        requestedBy: users.jonas,
        approver: users.michael,
        status: 'pending',
        message:
            'Alle Pflichtprüfungen sind abgeschlossen, keine offenen Blocker. Bitte um fachliche Freigabe für den Go-live am 08.08.',
        conditions: null,
        decidedAt: null,
        createdAt: '2026-07-30T17:00:00+02:00',
        dueAt: '2026-08-05T18:00:00+02:00',
        decision: null,
        snapshot: {
            progress: releaseById('rel_hv_14').progress,
            openBlockerCount: 0,
            openIssueCount: 1,
            pendingRetestCount: 0,
            knownLimitations: releaseById('rel_hv_14').knownLimitations,
            priorApprovals: 0,
        },
    },
    {
        id: 'apr_kp_22',
        releaseId: 'rel_kp_22',
        releaseName: 'Release 2.2',
        buildLabel: '2.2.0',
        buildId: 'bld_kp_220',
        requestedBy: users.jonas,
        approver: users.andreas,
        status: 'approved',
        message: 'Rechnungs-PDF und Bestellfilter sind abgenommen.',
        conditions: null,
        decidedAt: '2026-06-16T15:30:00+02:00',
        createdAt: '2026-06-15T10:00:00+02:00',
        dueAt: '2026-06-17T18:00:00+02:00',
        decision: {
            id: 'dec_kp_22',
            type: 'approve',
            conditions: null,
            comment: 'Sieht gut aus, Freigabe für den Go-live erteilt.',
            decidedBy: users.andreas,
            decidedAt: '2026-06-16T15:30:00+02:00',
        },
        snapshot: {
            progress: releaseById('rel_kp_22').progress,
            openBlockerCount: 0,
            openIssueCount: 0,
            pendingRetestCount: 0,
            knownLimitations: releaseById('rel_kp_22').knownLimitations,
            priorApprovals: 0,
        },
    },
    {
        id: 'apr_hv_13',
        releaseId: 'rel_hv_13',
        releaseName: 'Release 1.3',
        buildLabel: '1.3.0',
        buildId: 'bld_hv_130',
        requestedBy: users.jonas,
        approver: users.michael,
        status: 'approved_with_conditions',
        message: 'Stammdatenpflege abgenommen.',
        conditions:
            'Freigabe unter der Bedingung, dass der Datenimport der Altsysteme innerhalb von zwei Wochen nach Go-live nachgezogen wird.',
        decidedAt: '2026-05-10T14:00:00+02:00',
        createdAt: '2026-05-09T09:00:00+02:00',
        dueAt: '2026-05-11T18:00:00+02:00',
        decision: {
            id: 'dec_hv_13',
            type: 'approve_with_conditions',
            conditions:
                'Datenimport der Altsysteme innerhalb von zwei Wochen nach Go-live nachziehen.',
            comment: 'Freigabe erteilt, siehe Bedingung.',
            decidedBy: users.michael,
            decidedAt: '2026-05-10T14:00:00+02:00',
        },
        snapshot: {
            progress: releaseById('rel_hv_13').progress,
            openBlockerCount: 0,
            openIssueCount: 0,
            pendingRetestCount: 0,
            knownLimitations: [],
            priorApprovals: 0,
        },
    },
];

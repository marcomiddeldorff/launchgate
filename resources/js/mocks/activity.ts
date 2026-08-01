import { users } from '@/mocks/users';
import type { AuditEvent, ReleaseSnapshot } from '@/types';

export const auditByRelease: Record<string, AuditEvent[]> = {
    rel_kp_23: [
        {
            id: 'ev_1',
            type: 'build_added',
            actor: users.marie,
            summary: 'Build 2.3.0-rc.5 hinzugefügt',
            detail: 'Behebt CSV-Umlaute und doppelte Bestellungen.',
            createdAt: '2026-07-30T14:05:00+02:00',
        },
        {
            id: 'ev_2',
            type: 'build_promoted',
            actor: users.jonas,
            summary: 'Build 2.3.0-rc.5 als aktueller Build markiert',
            detail: 'Bestehende Freigaben können ungültig werden.',
            createdAt: '2026-07-30T14:25:00+02:00',
        },
        {
            id: 'ev_3',
            type: 'issue_status_changed',
            actor: users.jonas,
            summary: 'Issue #141 auf „Retest nötig“ gesetzt',
            detail: null,
            createdAt: '2026-07-30T14:25:00+02:00',
        },
        {
            id: 'ev_4',
            type: 'review_failed',
            actor: users.andreas,
            summary:
                'Prüfung „CSV-Export der Bestellungen“ als Problem markiert',
            detail: null,
            createdAt: '2026-07-29T15:00:00+02:00',
        },
        {
            id: 'ev_5',
            type: 'issue_created',
            actor: users.andreas,
            summary: 'Issue #142 erstellt: CSV-Export bricht bei Umlauten ab',
            detail: null,
            createdAt: '2026-07-29T15:06:00+02:00',
        },
        {
            id: 'ev_6',
            type: 'review_passed',
            actor: users.petra,
            summary: 'Prüfung „Anmeldung mit gültigen Zugangsdaten“ bestanden',
            detail: null,
            createdAt: '2026-07-29T10:12:00+02:00',
        },
        {
            id: 'ev_7',
            type: 'release_created',
            actor: users.jonas,
            summary: 'Release 2.3 erstellt',
            detail: null,
            createdAt: '2026-07-22T15:00:00+02:00',
        },
    ],
    rel_hv_14: [
        {
            id: 'ev_hv_1',
            type: 'approval_requested',
            actor: users.jonas,
            summary: 'Freigabe für Build 1.4.0-rc.2 angefordert',
            detail: 'Adressat: Michael Braun',
            createdAt: '2026-07-30T17:00:00+02:00',
        },
        {
            id: 'ev_hv_2',
            type: 'review_passed',
            actor: users.sabine,
            summary: 'Letzte Pflichtprüfung abgeschlossen',
            detail: null,
            createdAt: '2026-07-30T16:20:00+02:00',
        },
        {
            id: 'ev_hv_3',
            type: 'build_added',
            actor: users.timo,
            summary: 'Build 1.4.0-rc.2 hinzugefügt',
            detail: null,
            createdAt: '2026-07-29T16:10:00+02:00',
        },
    ],
    rel_kp_22: [
        {
            id: 'ev_kp22_1',
            type: 'release_completed',
            actor: users.jonas,
            summary: 'Release 2.2 abgeschlossen und live geschaltet',
            detail: null,
            createdAt: '2026-06-18T12:00:00+02:00',
        },
        {
            id: 'ev_kp22_2',
            type: 'approval_decided',
            actor: users.andreas,
            summary: 'Freigabe für Build 2.2.0 erteilt',
            detail: null,
            createdAt: '2026-06-16T15:30:00+02:00',
        },
        {
            id: 'ev_kp22_3',
            type: 'approval_requested',
            actor: users.jonas,
            summary: 'Freigabe angefordert',
            detail: null,
            createdAt: '2026-06-15T10:00:00+02:00',
        },
    ],
};

/** Organization-wide recent activity for the dashboard. */
export const recentActivity: AuditEvent[] = [
    {
        id: 'ra_1',
        type: 'approval_requested',
        actor: users.jonas,
        summary: 'Freigabe für Release 1.4 (Nordstern Logistik) angefordert',
        detail: 'Build 1.4.0-rc.2',
        createdAt: '2026-07-30T17:00:00+02:00',
    },
    {
        id: 'ra_2',
        type: 'build_promoted',
        actor: users.jonas,
        summary: 'Build 2.3.0-rc.5 im Kundenportal aktiviert',
        detail: 'Müller GmbH',
        createdAt: '2026-07-30T14:25:00+02:00',
    },
    {
        id: 'ra_3',
        type: 'issue_created',
        actor: users.andreas,
        summary: 'Issue #142 gemeldet: CSV-Export bricht bei Umlauten ab',
        detail: 'Go-live-Blocker',
        createdAt: '2026-07-29T15:06:00+02:00',
    },
    {
        id: 'ra_4',
        type: 'review_failed',
        actor: users.petra,
        summary: 'Bestellabschluss im Kundenportal als Problem markiert',
        detail: null,
        createdAt: '2026-07-29T13:30:00+02:00',
    },
    {
        id: 'ra_5',
        type: 'build_added',
        actor: users.timo,
        summary: 'Build 1.4.0-rc.2 in Händlerverwaltung hinzugefügt',
        detail: 'Nordstern Logistik',
        createdAt: '2026-07-29T16:10:00+02:00',
    },
    {
        id: 'ra_6',
        type: 'release_created',
        actor: users.jonas,
        summary: 'Release 3.0 (Bestellabschluss) als Entwurf angelegt',
        detail: 'Aachener Stadtwerke',
        createdAt: '2026-07-30T16:00:00+02:00',
    },
];

export const snapshotsByRelease: Record<string, ReleaseSnapshot> = {
    rel_kp_22: {
        id: 'snap_kp_22',
        releaseId: 'rel_kp_22',
        buildLabel: '2.2.0',
        checksum: 'sha256:9f2b7c41a0e8d3b6c5140af9e27d8811b3a6f0c9e4d2a71f',
        generatedAt: '2026-06-18T12:05:00+02:00',
        generatedBy: users.jonas,
    },
};

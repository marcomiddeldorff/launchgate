import type { StatusTone } from '@/lib/status';
import type { OrganizationRole } from '@/types';

export type RoleMeta = {
    label: string;
    description: string;
    tone: StatusTone;
};

export const organizationRoleMeta: Record<OrganizationRole, RoleMeta> = {
    owner: {
        label: 'Owner',
        description:
            'Verwaltet die Organisation, Mitglieder und Abrechnung und sieht alle Projekte.',
        tone: 'primary',
    },
    project_manager: {
        label: 'Project Manager',
        description:
            'Verwaltet Projekte und Releases, erstellt Prüfgegenstände und fordert Freigaben an.',
        tone: 'info',
    },
    developer: {
        label: 'Developer',
        description:
            'Bearbeitet Issues, schreibt interne Kommentare und trägt neue Builds ein.',
        tone: 'retest',
    },
    client_tester: {
        label: 'Client Tester',
        description:
            'Führt zugewiesene Prüfungen durch, meldet Probleme und gibt Releases frei.',
        tone: 'success',
    },
    approver: {
        label: 'Approver',
        description:
            'Prüft die Release-Zusammenfassung und erteilt oder verweigert die Freigabe.',
        tone: 'warning',
    },
};

/**
 * Permissions expressed as capabilities rather than raw role checks, so that
 * the UI never hard-codes `role === 'owner'` in dozens of places.
 */
export type UserAbilities = {
    manageOrganization: boolean;
    manageMembers: boolean;
    manageProjects: boolean;
    manageReleases: boolean;
    manageReviewItems: boolean;
    runReviews: boolean;
    editIssues: boolean;
    viewInternalComments: boolean;
    requestApprovals: boolean;
    decideApprovals: boolean;
    completeReleases: boolean;
};

export function abilitiesForRole(role: OrganizationRole): UserAbilities {
    const staff = role === 'owner' || role === 'project_manager';

    return {
        manageOrganization: role === 'owner',
        manageMembers: role === 'owner',
        manageProjects: staff,
        manageReleases: staff,
        manageReviewItems: staff,
        runReviews: role === 'client_tester' || staff || role === 'developer',
        editIssues: role === 'developer' || staff,
        viewInternalComments: role !== 'client_tester' && role !== 'approver',
        requestApprovals: staff,
        decideApprovals: role === 'approver' || role === 'owner',
        completeReleases: staff,
    };
}

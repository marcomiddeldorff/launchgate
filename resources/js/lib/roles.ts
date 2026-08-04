import type { StatusTone } from '@/lib/status';
import { OrganizationRole, ProjectRole } from '@/types';

export type RoleMeta = {
    label: string;
    description: string;
    tone: StatusTone;
};

export const organizationRoleMeta: Record<OrganizationRole, RoleMeta> = {
    [OrganizationRole.Admin]: {
        label: 'Administrator',
        description:
            'Voller Zugriff: verwaltet Mitglieder, Projekte und Releases der Organisation.',
        tone: 'primary',
    },
    [OrganizationRole.ProjectManager]: {
        label: 'Projektmanager',
        description:
            'Verwaltet Projekte und Releases, erstellt Prüfgegenstände und fordert Freigaben an.',
        tone: 'info',
    },
    [OrganizationRole.Developer]: {
        label: 'Entwickler',
        description:
            'Bearbeitet Issues, schreibt interne Kommentare und trägt neue Builds ein.',
        tone: 'retest',
    },
    [OrganizationRole.Viewer]: {
        label: 'Betrachter',
        description:
            'Nur-Lese-Zugriff auf zugewiesene Projekte, Releases und deren Fortschritt.',
        tone: 'neutral',
    },
};

export const projectRoleMeta: Record<ProjectRole, RoleMeta> = {
    [ProjectRole.ProjectManager]: {
        label: 'Projektmanager',
        description:
            'Verwaltet Projekte und Releases, erstellt Prüfgegenstände und fordert Freigaben an.',
        tone: 'info',
    },
    [ProjectRole.Developer]: {
        label: 'Entwickler',
        description:
            'Bearbeitet Issues, schreibt interne Kommentare und trägt neue Builds ein.',
        tone: 'retest',
    },
    [ProjectRole.ClientTester]: {
        label: 'Kunde / Tester',
        description:
            'Führt zugewiesene Prüfungen durch, meldet Probleme und gibt Releases frei.',
        tone: 'success',
    },
    [ProjectRole.Approver]: {
        label: 'Freigeber',
        description:
            'Prüft die Release-Zusammenfassung und erteilt oder verweigert die Freigabe.',
        tone: 'warning',
    },
};

/**
 * Permissions expressed as capabilities rather than raw role checks, so that
 * the UI never hard-codes `role === 'admin'` in dozens of places.
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
    const admin = role === OrganizationRole.Admin;
    const staff = admin || role === OrganizationRole.ProjectManager;

    return {
        manageOrganization: admin,
        manageMembers: admin,
        manageProjects: staff,
        manageReleases: staff,
        manageReviewItems: staff,
        runReviews: staff || role === OrganizationRole.Developer,
        editIssues: staff || role === OrganizationRole.Developer,
        viewInternalComments: role !== OrganizationRole.Viewer,
        requestApprovals: staff,
        decideApprovals: admin,
        completeReleases: staff,
    };
}

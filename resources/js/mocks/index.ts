import { abilitiesForRole } from '@/lib/roles';
import {
    auditByRelease,
    recentActivity,
    snapshotsByRelease,
} from '@/mocks/activity';
import { approvals } from '@/mocks/approvals';
import { clients, projects } from '@/mocks/catalog';
import { issues } from '@/mocks/issues';
import { members, organization, organizations } from '@/mocks/organization';
import { buildsByRelease, releases } from '@/mocks/releases';
import { myAssignments, runnerItems, suitesByRelease } from '@/mocks/reviews';
import { users } from '@/mocks/users';
import type { OrganizationRole } from '@/types';

export * from '@/mocks/users';
export * from '@/mocks/organization';
export * from '@/mocks/catalog';
export * from '@/mocks/releases';
export * from '@/mocks/reviews';
export * from '@/mocks/issues';
export * from '@/mocks/approvals';
export * from '@/mocks/activity';

/**
 * The "session" the demo runs as. In a real deployment this comes from shared
 * Inertia props; while the backend is mocked we expose it here so the UI can
 * gate actions by ability. Change `demoRole` to preview a different role.
 */
export const demoRole: OrganizationRole = 'owner';
export const currentUser = users.lena;
export const abilities = abilitiesForRole(demoRole);
export const currentOrganization = organization;

/* ------------------------------ Lookups ---------------------------------- */

export const getClient = (id: string) =>
    clients.find((c) => c.id === id) ?? clients[0];

export const getProject = (id: string) =>
    projects.find((p) => p.id === id) ?? projects[0];

export const getRelease = (id: string) =>
    releases.find((r) => r.id === id) ?? releases[0];

export const getIssue = (id: string) =>
    issues.find((i) => i.id === id) ?? issues[0];

export const getApproval = (id: string) =>
    approvals.find((a) => a.id === id) ?? approvals[0];

export const projectsForClient = (clientId: string) =>
    projects.filter((p) => p.clientId === clientId);

export const releasesForProject = (projectId: string) =>
    releases.filter((r) => r.projectId === projectId);

export const issuesForRelease = (releaseId: string) =>
    issues.filter((i) => i.releaseId === releaseId);

export const approvalsForRelease = (releaseId: string) =>
    approvals.filter((a) => a.releaseId === releaseId);

export const suitesForRelease = (releaseId: string) =>
    suitesByRelease[releaseId] ?? [];

export const runnerItemsForRelease = (releaseId: string) =>
    runnerItems[releaseId] ?? [];

export const buildsForRelease = (releaseId: string) =>
    buildsByRelease[releaseId] ?? [];

export const auditForRelease = (releaseId: string) =>
    auditByRelease[releaseId] ?? [];

export const snapshotForRelease = (releaseId: string) =>
    snapshotsByRelease[releaseId] ?? null;

export const activeReleases = releases.filter((r) =>
    [
        'testing',
        'blocked',
        'pending_approval',
        'approved',
        'scheduled',
    ].includes(r.status),
);

export const openIssues = issues.filter(
    (i) => !['closed', 'wont_fix'].includes(i.status),
);

export const pendingApprovals = approvals.filter((a) => a.status === 'pending');

export {
    approvals,
    clients,
    issues,
    members,
    myAssignments,
    organizations,
    projects,
    recentActivity,
    releases,
};

import { plans } from '@/lib/capabilities';
import { users } from '@/mocks/users';
import { OrganizationRole } from '@/types';
import type { Organization, OrganizationMember } from '@/types';

export const organization: Organization = {
    id: 'org_pixelwerk',
    name: 'Pixelwerk Studio',
    slug: 'pixelwerk',
    logo_url: null,
    plan: 'pro',
    capabilities: plans.pro.capabilities,
    limits: plans.pro.limits,
    default_locale: 'de',
    timezone: 'Europe/Berlin',
    memberCount: 7,
};

/** A second organization so the switcher demonstrates real behaviour. */
export const secondaryOrganization: Organization = {
    id: 'org_northwind',
    name: 'Northwind Agentur',
    slug: 'northwind',
    logo_url: null,
    plan: 'agency',
    capabilities: plans.agency.capabilities,
    limits: plans.agency.limits,
    default_locale: 'de',
    timezone: 'Europe/Berlin',
    memberCount: 12,
};

export const organizations: Organization[] = [
    organization,
    secondaryOrganization,
];

export const members: OrganizationMember[] = [
    {
        id: 'mem_lena',
        user: users.lena,
        role: OrganizationRole.Admin,
        status: 'active',
        canApprove: true,
        joinedAt: '2024-03-01T09:00:00+01:00',
        lastSeenAt: '2026-07-31T08:12:00+02:00',
    },
    {
        id: 'mem_jonas',
        user: users.jonas,
        role: OrganizationRole.ProjectManager,
        status: 'active',
        canApprove: true,
        joinedAt: '2024-03-04T09:00:00+01:00',
        lastSeenAt: '2026-07-31T07:55:00+02:00',
    },
    {
        id: 'mem_marie',
        user: users.marie,
        role: OrganizationRole.Developer,
        status: 'active',
        canApprove: false,
        joinedAt: '2024-03-11T09:00:00+01:00',
        lastSeenAt: '2026-07-30T18:40:00+02:00',
    },
    {
        id: 'mem_timo',
        user: users.timo,
        role: OrganizationRole.Developer,
        status: 'active',
        canApprove: false,
        joinedAt: '2024-06-01T09:00:00+02:00',
        lastSeenAt: '2026-07-31T09:02:00+02:00',
    },
    {
        id: 'mem_petra',
        user: users.petra,
        role: OrganizationRole.Viewer,
        status: 'active',
        canApprove: true,
        joinedAt: '2025-01-20T09:00:00+01:00',
        lastSeenAt: '2026-07-30T16:20:00+02:00',
    },
    {
        id: 'mem_andreas',
        user: users.andreas,
        role: OrganizationRole.Admin,
        status: 'active',
        canApprove: true,
        joinedAt: '2025-01-20T09:00:00+01:00',
        lastSeenAt: '2026-07-29T11:10:00+02:00',
    },
    {
        id: 'mem_sabine',
        user: users.sabine,
        role: OrganizationRole.Viewer,
        status: 'invited',
        canApprove: false,
        joinedAt: null,
    },
];

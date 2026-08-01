/**
 * Central path builder for LaunchGate app routes. Using these helpers instead
 * of inline string literals keeps navigation links consistent and greppable.
 * (The named Laravel routes render Inertia pages with mock data for now.)
 */
export const paths = {
    home: '/',
    dashboard: '/dashboard',

    clients: {
        index: '/clients',
        create: '/clients/create',
        show: (id: string) => `/clients/${id}`,
        edit: (id: string) => `/clients/${id}/edit`,
    },

    organizations: {
        index: '/organizations',
    },

    projects: {
        index: '/projects',
        create: '/projects/create',
        show: (id: string) => `/projects/${id}`,
        members: (id: string) => `/projects/${id}/members`,
        environments: (id: string) => `/projects/${id}/environments`,
        settings: (id: string) => `/projects/${id}/settings`,
    },

    releases: {
        index: '/releases',
        create: '/releases/create',
        show: (id: string) => `/releases/${id}`,
        builds: (id: string) => `/releases/${id}/builds`,
        reviews: (id: string) => `/releases/${id}/reviews`,
        issues: (id: string) => `/releases/${id}/issues`,
        approvals: (id: string) => `/releases/${id}/approvals`,
        activity: (id: string) => `/releases/${id}/activity`,
        settings: (id: string) => `/releases/${id}/settings`,
        report: (id: string) => `/releases/${id}/report`,
        runner: (id: string) => `/releases/${id}/runner`,
    },

    reviews: {
        mine: '/my-reviews',
    },

    issues: {
        index: '/issues',
        show: (id: string) => `/issues/${id}`,
    },

    approvals: {
        index: '/approvals',
        show: (id: string) => `/approvals/${id}`,
    },

    templates: '/templates',
    members: '/members',

    settings: {
        organization: '/settings/organization',
        billing: '/settings/billing',
        notifications: '/settings/notifications',
        profile: '/settings/profile',
        appearance: '/settings/appearance',
    },

    onboarding: '/onboarding',
} as const;

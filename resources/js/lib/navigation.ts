import {
    Building2,
    ClipboardCheck,
    FolderKanban,
    LayoutDashboard,
    Bug,
    Settings,
    ListChecks,
    Rocket,
    UserCheck,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserAbilities } from '@/lib/roles';
import { dashboard } from '@/routes';
import approvalRoutes from '@/routes/approvals';
import clientRoutes from '@/routes/clients';
import issueRoutes from '@/routes/issues';
import memberRoutes from '@/routes/members';
import orgSettingsRoutes from '@/routes/org-settings';
import organizationRoutes from '@/routes/organizations';
import projectRoutes from '@/routes/projects';
import releaseRoutes from '@/routes/releases';
import reviewRoutes from '@/routes/reviews';
import templateRoutes from '@/routes/templates';

export type AppNavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    /** Match child routes as active too (e.g. /releases/123). */
    matchPrefix?: string;
    /** Ability gate — item is hidden if the predicate returns false. */
    can?: (abilities: UserAbilities) => boolean;
};

export type AppNavGroup = {
    label: string;
    items: AppNavItem[];
};

export const primaryNav: AppNavGroup = {
    label: 'Übersicht',
    items: [
        {
            title: 'Übersicht',
            href: dashboard.url(),
            icon: LayoutDashboard,
        },
        {
            title: 'Kunden',
            href: clientRoutes.index.url(),
            icon: Building2,
            matchPrefix: '/clients',
            can: (a) => a.manageProjects,
        },
        {
            title: 'Projekte',
            href: projectRoutes.index.url(),
            icon: FolderKanban,
            matchPrefix: '/projects',
        },
        {
            title: 'Releases',
            href: releaseRoutes.index.url(),
            icon: Rocket,
            matchPrefix: '/releases',
        },
        {
            title: 'Meine Prüfungen',
            href: reviewRoutes.mine.url(),
            icon: ClipboardCheck,
            can: (a) => a.runReviews,
        },
        {
            title: 'Issues',
            href: issueRoutes.index.url(),
            icon: Bug,
            matchPrefix: '/issues',
        },
        {
            title: 'Freigaben',
            href: approvalRoutes.index.url(),
            icon: UserCheck,
            matchPrefix: '/approvals',
        },
    ],
};

export const manageNav: AppNavGroup = {
    label: 'Verwaltung',
    items: [
        {
            title: 'Organisationen',
            href: organizationRoutes.index.url(),
            icon: Building2,
            can: (a) => a.manageOrganization,
        },
        {
            title: 'Vorlagen',
            href: templateRoutes.index.url(),
            icon: ListChecks,
            can: (a) => a.manageReviewItems,
        },
        {
            title: 'Mitglieder',
            href: memberRoutes.index.url(),
            icon: Users,
            can: (a) => a.manageMembers,
        },
        {
            title: 'Einstellungen',
            href: orgSettingsRoutes.general.url(),
            icon: Settings,
            matchPrefix: '/settings',
        },
    ],
};

export const navGroups: AppNavGroup[] = [primaryNav, manageNav];

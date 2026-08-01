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
import { paths } from '@/lib/routes';

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
            href: paths.dashboard,
            icon: LayoutDashboard,
        },
        {
            title: 'Kunden',
            href: paths.clients.index,
            icon: Building2,
            matchPrefix: '/clients',
            can: (a) => a.manageProjects,
        },
        {
            title: 'Projekte',
            href: paths.projects.index,
            icon: FolderKanban,
            matchPrefix: '/projects',
        },
        {
            title: 'Releases',
            href: paths.releases.index,
            icon: Rocket,
            matchPrefix: '/releases',
        },
        {
            title: 'Meine Prüfungen',
            href: paths.reviews.mine,
            icon: ClipboardCheck,
            can: (a) => a.runReviews,
        },
        {
            title: 'Issues',
            href: paths.issues.index,
            icon: Bug,
            matchPrefix: '/issues',
        },
        {
            title: 'Freigaben',
            href: paths.approvals.index,
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
            href: paths.organizations.index,
            icon: Building2,
            can: (a) => a.manageOrganization,
        },
        {
            title: 'Vorlagen',
            href: paths.templates,
            icon: ListChecks,
            can: (a) => a.manageReviewItems,
        },
        {
            title: 'Mitglieder',
            href: paths.members,
            icon: Users,
            can: (a) => a.manageMembers,
        },
        {
            title: 'Einstellungen',
            href: paths.settings.organization,
            icon: Settings,
            matchPrefix: '/settings',
        },
    ],
};

export const navGroups: AppNavGroup[] = [primaryNav, manageNav];

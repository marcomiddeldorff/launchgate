import type { UserAbilities } from '@/lib/roles';
import {
    abilities,
    currentOrganization,
    currentUser,
    demoRole,
    organizations,
} from '@/mocks';
import type { DomainUser, Organization, OrganizationRole } from '@/types';

export type AppContext = {
    organization: Organization;
    organizations: Organization[];
    currentUser: DomainUser;
    role: OrganizationRole;
    abilities: UserAbilities;
};

/**
 * Provides the current org, user, role and derived abilities. Backed by mock
 * data while the backend is being built; once real shared Inertia props exist,
 * only this hook needs to change.
 */
export function useAppContext(): AppContext {
    return {
        organization: currentOrganization,
        organizations,
        currentUser,
        role: demoRole,
        abilities,
    };
}

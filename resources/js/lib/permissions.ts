import { usePage } from '@inertiajs/react';
import { Project } from '@/types';


export function hasOrganizationRoles(roles: string | string[]): boolean {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { currentOrganization, currentOrganizationMembership, auth } = usePage().props;

    if (auth.user.id === currentOrganization?.owner_user_id) {
        return true;
    }

    if (!currentOrganization || !currentOrganizationMembership) {
        return false;
    }

    if (typeof roles === 'string') {
        return currentOrganizationMembership?.role === roles;
    }

    return roles.includes(currentOrganizationMembership?.role);
}

export function hasProjectRole(project: Project, roles: string | string[]): boolean {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { auth } = usePage().props;

    // The project manager can do anything within that project.
    if (auth.user.id === project.project_manager_user_id) {
        return true;
    }

    if (!project.members || project.members?.length === 0) {
        return false;
    }

    if (project.organization && auth.user.id === project.organization.owner_user_id) {
        return true;
    }

    const membership = project.members.find((member) => member.user_id === auth.user.id);

    if (!membership) {
        return false;
    }

    if (typeof roles === 'string') {
        return membership.role === roles;
    }

    return roles.includes(membership.role);
}

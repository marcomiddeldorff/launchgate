<?php

namespace App\Policies;

use App\Enums\OrganizationMembershipRole;
use App\Enums\ProjectMembershipRole;
use App\Models\Project;
use App\Models\ProjectMembership;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): Response
    {
        return Response::allow();
    }

    public function viewSettings(User $user, Project $project): Response
    {
        return $this->checkSettingsPrivileges($user, $project);return Response::allow();
    }

    public function viewMembers(User $user, Project $project): Response
    {
        return $this->checkSettingsPrivileges($user, $project);
    }

    public function viewEnvironments(User $user, Project $project): Response
    {
        return $this->checkSettingsPrivileges($user, $project);
    }


    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $this->checkPrivileges($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): Response
    {
        return $this->checkPrivileges($user, $project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return false;
    }

    public function addMember(User $user, Project $project): Response
    {
        return $this->checkPrivileges($user, $project);
    }

    public function archive(User $user, Project $project): Response
    {
        return $this->checkPrivileges($user, $project);
    }

    private function checkSettingsPrivileges(User $user, Project $project): Response
    {
        $project->loadMissing(['organization', 'members']);

        if (
            $project->organization->isMember($user->id) ||
            $project->organization->isOwner($user->id) ||
            ($project->members->contains('user_id', $user->id) &&
                ($project->members->firstWhere('user_id', $user->id)->role === ProjectMembershipRole::ProjectManager->value
                    || $project->members->firstWhere('user_id', $user->id)->role === ProjectMembershipRole::Developer->value
                    || $project->members->firstWhere('user_id', $user->id)->role === ProjectMembershipRole::ClientTester->value))
        ) {
            return Response::allow();
        }

        return Response::deny('Sie sind nicht berechtigt, diese Aktion auszuführen.');
    }

    private function checkPrivileges(User $user, ?Project $project = null): Response
    {
        $organization = $user->ensureOrganizationIsSet();

        if (! $organization->hasRole($user, [
            OrganizationMembershipRole::Admin->value,
            OrganizationMembershipRole::ProjectManager->value,
        ])) {
            return Response::deny('Sie sind nicht berechtigt, diese Aktion auszuführen.');
        }

        if (isset($project)) {
            if ($project->organization_id !== $organization->id) {
                return Response::deny('Sie sind nicht berechtigt, diese Aktion auszuführen.');
            }

            if ($project->archived_at !== null) {
                return Response::deny('Das Projekt wurde archiviert und kann nicht bearbeitet werden.');
            }
        }

        return Response::allow();
    }
}

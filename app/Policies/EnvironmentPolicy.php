<?php

namespace App\Policies;

use App\Enums\ProjectMembershipRole;
use App\Models\Environment;
use App\Models\Project;
use App\Models\User;
use Egulias\EmailValidator\Result\SpoofEmail;
use Illuminate\Auth\Access\Response;

class EnvironmentPolicy
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
    public function view(User $user, Environment $environment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Project $project): Response
    {
        return $this->check($user, $project);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Environment $environment, Project $project): Response
    {
        return $this->check($user, $project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Environment $environment, Project $project): Response
    {
        return $this->check($user, $project);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Environment $environment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Environment $environment): bool
    {
        return false;
    }

    private function check(User $user, Project $project): Response
    {
        $isDeveloper = $project->members()->where('user_id', $user->id)
            ->where('role', ProjectMembershipRole::Developer->value)
            ->exists();
        $isProjectManager = $project->project_manager_user_id === $user->id;
        $isOrganizationOwner = $project->whereHas('organization', fn ($query) => $query->whereOwnerUserId($user->id))->exists();

        if ($isOrganizationOwner || $isProjectManager || $isDeveloper) {
            return Response::allow();
        }

        return Response::deny('Sie sind nicht berechtigt, diese Aktion auszuführen.');
    }
}

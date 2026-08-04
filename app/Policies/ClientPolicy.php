<?php

namespace App\Policies;

use App\Enums\OrganizationMembershipRole;
use App\Models\Client;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ClientPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Client $client): Response
    {
        if ($client->organization_id !== $user->current_organization_id) {
            return Response::deny('Die Organisationen stimmen nicht überein.');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $this->checkForPrivileges($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Client $client): Response
    {
        return $this->checkForPrivileges($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Client $client): Response
    {
        return $this->checkForPrivileges($user);
    }

    private function checkForPrivileges(User $user): Response
    {
        $organization = $user->ensureOrganizationIsSet('Wähle eine Organisation aus.');

        if (! $organization->isMember($user->id) && ! $organization->isOwner($user->id)) {
            return Response::deny('Sie müssen Mitglied dieser Organisation sein, um einen neuen Kunden zu erstellen.');
        }

        if (! $organization->hasRole($user, OrganizationMembershipRole::Admin->value)) {
            return Response::deny('Ihnen fehlen die benötigten Berechtigungen, um diese Seite anzuzeigen.');
        }

        return Response::allow();
    }
}

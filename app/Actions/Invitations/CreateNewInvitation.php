<?php

namespace App\Actions\Invitations;

use App\Enums\OrganizationMembershipRole;
use App\Enums\ProjectMembershipRole;
use App\Events\NewOrganizationInvitationCreated;
use App\Events\NewProjectInvitationCreated;
use App\Exceptions\InvitationForOrganizationAlreadyExistsException;
use App\Exceptions\InvitationForProjectAlreadyExistsException;
use App\Exceptions\MemberWithEmailAlreadyExistsInOrganizationException;
use App\Exceptions\MemberWithEmailAlreadyExistsInProjectException;
use App\Models\Invitation;
use App\Models\Organization;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Str;

class CreateNewInvitation
{
    /**
     * @throws InvitationForOrganizationAlreadyExistsException
     * @throws MemberWithEmailAlreadyExistsInOrganizationException
     * @throws MemberWithEmailAlreadyExistsInProjectException
     * @throws InvitationForProjectAlreadyExistsException
     */
    public function create(string $email, string $role, Organization $organization, User $invitedBy, ?Project $project = null): Invitation
    {
        if (is_null($project)) {
            return $this->createInvitationForOrganization(
                email: $email,
                role: OrganizationMembershipRole::tryFrom($role),
                organization: $organization,
                invitedBy: $invitedBy
            );
        }

        return $this->createInvitationForProject(
            email: $email,
            role: ProjectMembershipRole::tryFrom($role),
            project: $project,
            organization: $organization,
            invitedBy: $invitedBy
        );
    }

    /**
     * @throws InvitationForOrganizationAlreadyExistsException
     * @throws MemberWithEmailAlreadyExistsInOrganizationException
     */
    private function createInvitationForOrganization(string $email, OrganizationMembershipRole $role, Organization $organization, User $invitedBy): Invitation
    {
        if ($organization->invitations()->whereEmail($email)->exists()) {
            throw new InvitationForOrganizationAlreadyExistsException;
        }

        if ($organization->memberships()->whereHas('user', fn ($query) => $query->whereEmail($email))->exists()) {
            throw new MemberWithEmailAlreadyExistsInOrganizationException;
        }

        $plainToken = Str::random(64);

        $invitation = $organization->invitations()->create([
            'email' => $email,
            'role' => $role->value,
            'token_hash' => Invitation::hashToken($plainToken),
            'expires_at' => now()->addMinutes(30),
            'invited_by_user_id' => $invitedBy->id,
        ]);

        event(new NewOrganizationInvitationCreated($invitation, $plainToken, $invitedBy));

        return $invitation;
    }

    /**
     * @throws InvitationForProjectAlreadyExistsException
     * @throws MemberWithEmailAlreadyExistsInProjectException
     */
    private function createInvitationForProject(string $email, ProjectMembershipRole $role, Project $project, Organization $organization, User $invitedBy): Invitation
    {
        if ($project->invitations()->whereEmail($email)->exists()) {
            throw new InvitationForProjectAlreadyExistsException;
        }

        if ($project->members()->whereHas('user', fn ($query) => $query->whereEmail($email))->exists()) {
            throw new MemberWithEmailAlreadyExistsInProjectException;
        }

        $plainToken = Str::random(64);

        $invitation = $project->invitations()->create([
            'organization_id' => $organization->id,
            'email' => $email,
            'role' => $role->value,
            'token_hash' => Invitation::hashToken($plainToken),
            'expires_at' => now()->addMinutes(30),
            'invited_by_user_id' => $invitedBy->id,
        ]);

        event(new NewProjectInvitationCreated($invitation, $project, $plainToken, $invitedBy));

        return $invitation;
    }
}

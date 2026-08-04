<?php

namespace App\Actions\Projects;

use App\Actions\Invitations\CreateNewInvitation;
use App\Enums\ProjectMembershipRole;
use App\Events\NewProjectInvitationCreated;
use App\Exceptions\InvitationForOrganizationAlreadyExistsException;
use App\Exceptions\InvitationForProjectAlreadyExistsException;
use App\Exceptions\MemberWithEmailAlreadyExistsInOrganizationException;
use App\Exceptions\MemberWithEmailAlreadyExistsInProjectException;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;

class AddExternalUserToProject
{
    public function __construct(
        private readonly CreateNewInvitation $createNewInvitation
    ) {}

    /**
     * @throws MemberWithEmailAlreadyExistsInProjectException
     * @throws InvitationForProjectAlreadyExistsException
     */
    public function addExternalUser(Project $project, string $email, ProjectMembershipRole $role, User $user): Invitation
    {
        $invitation = $this->createNewInvitation->create(
            email: $email,
            role: $role->value,
            organization: $project->organization,
            invitedBy: $user,
            project: $project,
        );

        event(new NewProjectInvitationCreated(
            invitation: $invitation,
            project: $project,
            plainToken: $invitation->plain_token,
            user: $user,
        ));

        return $invitation;
    }
}

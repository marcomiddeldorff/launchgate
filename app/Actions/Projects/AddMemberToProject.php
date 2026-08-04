<?php

namespace App\Actions\Projects;

use App\Enums\ProjectMembershipRole;
use App\Models\OrganizationMembership;
use App\Models\Project;
use App\Models\ProjectMembership;
use App\Models\User;

class AddMemberToProject
{
    public function add(Project $project, array $data, User $user): ProjectMembership
    {
        $membership = OrganizationMembership::find($data['member_id']);
        $role = ProjectMembershipRole::tryFrom($data['role']);
        $canApprove = $data['can_approve'] ?? false;
        $canViewInternalComments = $data['can_view_internal_comments'] ?? false;

        return $project->members()->create([
            'user_id' => $membership->user_id,
            'role' => $role->value,
            'joined_at' => now(),
            'can_approve' => $canApprove,
            'can_view_internal_comments' => $canViewInternalComments,
        ]);
    }
}

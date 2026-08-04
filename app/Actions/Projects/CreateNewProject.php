<?php

namespace App\Actions\Projects;

use App\Enums\ProjectMembershipRole;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateNewProject
{
    public function create(array $data, User $user): Project
    {
        $organization = $user->ensureOrganizationIsSet();

        return DB::transaction(function () use ($data, $organization, $user) {
            $project = $organization->projects()->create([
                'name' => $data['name'],
                'client_id' => $data['client_id'],
                'description' => $data['description'],
                'status' => $data['status'],
                'default_locale' => $data['default_locale'],
                'timezone' => $data['timezone'],
                'repository_url' => $data['repository_url'] ?? null,
                'project_manager_user_id' => $data['project_manager_user_id'],
            ]);

            $projectManager = User::find($data['project_manager_user_id']);

            $project->members()->create([
                'user_id' => $projectManager->id,
                'role' => ProjectMembershipRole::ProjectManager->value,
                'joined_at' => now(),
                'can_approve' => true,
                'can_view_internal_comments' => true
            ]);

            return $project;
        });
    }
}

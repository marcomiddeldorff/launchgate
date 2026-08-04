<?php

namespace App\Actions\Projects;

use App\Models\Project;
use App\Models\User;

class UpdateProject
{
    public function update(array $data, Project $project): void
    {
        $project->update([
            'name' => $data['name'],
            'description' => $data['description'],
            'status' => $data['status'],
            'default_locale' => $data['default_locale'],
            'timezone' => $data['timezone'],
            'repository_url' => $data['repository_url'] ?? null,
            'project_manager_user_id' => $data['project_manager_user_id'],
        ]);
    }
}

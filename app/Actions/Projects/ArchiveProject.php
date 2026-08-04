<?php

namespace App\Actions\Projects;

use App\Models\Project;

class ArchiveProject
{
    public function archive(Project $project): void
    {
        $project->archive();

        // Todo: Add activity logging.
    }
}

<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Projects\ArchiveProject;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ArchiveProjectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Project $project, ArchiveProject $archiveProject): RedirectResponse
    {
        Gate::authorize('archive', $project);

        $archiveProject->archive($project);

        Toast::success('Das Projekt '.$project->name.' wurde archiviert.');

        return redirect()->route('projects.index');
    }
}

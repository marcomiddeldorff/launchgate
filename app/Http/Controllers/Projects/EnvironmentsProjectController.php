<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EnvironmentsProjectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Project $project)
    {
        Gate::authorize('viewEnvironments', $project);

        return Inertia::render('projects/environments', [
            'project' => $project->loadMissing('environments'),
        ]);
    }
}

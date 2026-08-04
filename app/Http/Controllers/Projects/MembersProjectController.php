<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MembersProjectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Project $project): Response
    {
        Gate::authorize('viewMembers', $project);

        $organization = $request->user()->ensureOrganizationIsSet();

        abort_unless($project->organization_id === $organization->id, 404);


        return Inertia::render('projects/members', [
            'project' => $project->loadMissing(['members.user', 'organization:id,owner_user_id']),
            'organizationMembers' => $organization->memberships()->with('user')->whereNotIn('user_id', [
                $request->user()->id,
                ...$project->members->pluck('id')->toArray(),
            ])->get(),
        ]);
    }
}

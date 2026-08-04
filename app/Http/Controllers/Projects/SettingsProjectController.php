<?php

namespace App\Http\Controllers\Projects;

use App\DTOs\LocalizationDTO;
use App\Enums\OrganizationMembershipRole;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SettingsProjectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Project $project): Response
    {
        Gate::authorize('viewSettings', $project);

        $organization = $request->user()->ensureOrganizationIsSet();

        $projectManager = $organization->memberships()
            ->with(['user:id,name,email'])
            ->whereRole(OrganizationMembershipRole::ProjectManager->value)
            ->get();

        return Inertia::render('projects/settings', [
            'project' => $project,
            'projectManager' => $projectManager,
            'timezones' => \DateTimeZone::listIdentifiers(),
            'organization' => $organization,
            'locales' => LocalizationDTO::getLocales(),
        ]);
    }
}

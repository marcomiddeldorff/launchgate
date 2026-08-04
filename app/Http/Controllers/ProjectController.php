<?php

namespace App\Http\Controllers;

use App\Actions\Projects\CreateNewProject;
use App\Actions\Projects\UpdateProject;
use App\DTOs\LocalizationDTO;
use App\Enums\OrganizationMembershipRole;
use App\Http\Requests\Projects\ProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Client;
use App\Models\Project;
use App\Support\Toast;
use DateTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $user = auth()->user();

        $projects = Project::forCurrentOrganization()
            ->with(['projectManager:id,name,avatar_path', 'client:id,name'])
            ->where(function ($query) use ($user) {
                $query->whereHas('members', fn ($query) => $query->where('user_id', $user->id))
                    ->orWhereHas('projectManager', fn ($query) => $query->where('id', $user->id))
                    ->orWhereHas('organization.memberships', fn ($query) => $query->where('user_id', $user->id))
                    ->orWhereHas('organization', fn ($query) => $query->where('owner_user_id', $user->id));
            })
            ->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $clients = Client::forCurrentOrganization()->get();
        $organization = $request->user()->ensureOrganizationIsSet();

        $projectManager = $organization->memberships()
            ->with(['user:id,name,email'])
            ->whereRole(OrganizationMembershipRole::ProjectManager->value)
            ->get();

        return Inertia::render('projects/create', [
            'clients' => $clients,
            'projectManager' => $projectManager,
            'timezones' => DateTimeZone::listIdentifiers(),
            'organization' => $organization,
            'locales' => LocalizationDTO::getLocales(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectRequest $request, CreateNewProject $createNewProject): RedirectResponse
    {
        $project = $createNewProject->create($request->validated(), $request->user());

        Toast::success('Das Projekt '.$project->name.' wurde erstellt.');

        return redirect()->route('projects.show', $project);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        Gate::authorize('view', $project);

        $project->loadMissing([
            'environments',
            'releases',
            'client',
            'projectManager',
            'members.user',
        ]);

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project, UpdateProject $updateProject): RedirectResponse
    {
        $updateProject->update($request->validated(), $project);

        Toast::success('Das Projekt '.$project->name.' wurde aktualisiert.');

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}

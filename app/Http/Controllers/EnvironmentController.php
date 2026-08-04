<?php

namespace App\Http\Controllers;

use App\Actions\Environments\CreateNewEnvironment;
use App\Actions\Environments\UpdateEnvironment;
use App\Http\Requests\Environments\StoreEnvironmentRequest;
use App\Http\Requests\Environments\UpdateEnvironmentRequest;
use App\Models\Environment;
use App\Models\Project;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnvironmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project): Response
    {
        Gate::authorize('viewEnvironments', $project);

        return Inertia::render('projects/environments', [
            'project' => $project->loadMissing('environments'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, Project $project): Response
    {
        return Inertia::render('environments/create', [
            'project' => $project,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEnvironmentRequest $request, Project $project, CreateNewEnvironment $createNewEnvironment): RedirectResponse
    {
        $environment = $createNewEnvironment->create($project, $request->validated());

        Toast::success('Die Umgebung '.$environment->name.' in dem Projekt '.$project->name.' wurde erstellt.');

        return redirect()->route('projects.environments.index', $project);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, Environment $environment): Response
    {
        return Inertia::render('environments/edit', [
            'project' => $project,
            'environment' => $environment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnvironmentRequest $request, Project $project, Environment $environment, UpdateEnvironment $updateEnvironment): RedirectResponse
    {
        $updateEnvironment->update($environment, $request->validated());

        Toast::success('Die Umgebung '.$environment->name.' wurde aktualisiert.');

        return redirect()->route('projects.environments.index', $project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, Environment $environment): RedirectResponse
    {
        Gate::authorize('delete', [$environment, $project]);

        $environment->delete();

        Toast::success('Die Umgebung '.$environment->name.' in dem Projekt '.$project->name.' wurde gelöscht.');

        return redirect()->route('projects.environments.index', $project);
    }
}

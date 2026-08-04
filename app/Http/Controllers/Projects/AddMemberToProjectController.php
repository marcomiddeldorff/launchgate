<?php

namespace App\Http\Controllers\Projects;

use App\Actions\Projects\AddExternalUserToProject;
use App\Actions\Projects\AddMemberToProject;
use App\Enums\ProjectMembershipRole;
use App\Exceptions\InvitationForProjectAlreadyExistsException;
use App\Exceptions\MemberWithEmailAlreadyExistsInProjectException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Projects\AddMemberToProjectRequest;
use App\Models\Project;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AddMemberToProjectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        AddMemberToProjectRequest $request,
        Project $project,
        AddMemberToProject $addMemberToProject,
        AddExternalUserToProject $addExternalUserToProject
    ): RedirectResponse {
        $validated = $request->validated();

        if ($validated['add_external_user']) {
            try {
                $addExternalUserToProject->addExternalUser(
                    project: $project,
                    email: $validated['email'],
                    role: ProjectMembershipRole::tryFrom($validated['role']),
                    user: $request->user(),
                );

                Toast::success('Eine Einladung an die E-Mail Adresse '.$validated['email'].' wurde versendet.');
            } catch (MemberWithEmailAlreadyExistsInProjectException) {
                Toast::error('Die E-Mail Adresse '.$validated['email'].' ist bereits Mitglied in diesem Projekt.');
            } catch (InvitationForProjectAlreadyExistsException) {
                Toast::error('Es existiert bereits eine Einladung für die E-Mail Adresse '.$validated['email'].' in diesem Projekt.');
            } finally {
                return redirect()->back();
            }
        }

        $membership = $addMemberToProject->add($project, $validated, $request->user());

        $membership->loadMissing(['user:id,name']);

        Toast::success('Das Mitglied '.$membership->user->name.' wurde dem Projekt '.$project->name.' hinzugefügt.');

        return redirect()->back();
    }
}

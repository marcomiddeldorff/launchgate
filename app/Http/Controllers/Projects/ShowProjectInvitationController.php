<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShowProjectInvitationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Project $project)
    {
        $token = $request->query('token');

        $invitation = Invitation::forToken($token)
            ->with([
                'project' => fn ($query) => $query->select(['id', 'name']),
                'invitedByUser' => fn ($query) => $query->select(['id', 'name']),
            ])->firstOrFail();

        $invitation->ensureInvitationIsUsable();

        $user = User::whereEmail($invitation->email)->first();

        return Inertia::render('auth/show-project-invitation', [
            'project' => $project,
            'invitation' => $invitation,
            'user' => $user,
        ]);
    }
}

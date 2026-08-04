<?php

namespace App\Http\Controllers\Organization;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Support\Toast;
use Illuminate\Http\Request;

class SetCurrentOrganizationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Organization $organization): void
    {
        if (
            ! $organization->isOwner($request->user()->id) &&
            ! $organization->isMember($request->user()->id) &&
            ! $organization->projects()->whereHas('members',
                fn ($query) => $query->where('user_id', $request->user()->id))->exists()
        ) {
            abort(403, 'Du bist kein Mitglied dieser Organisation.');
        }

        $request->user()->update([
            'current_organization_id' => $organization->id,
        ]);

        Toast::success('Aktive Organisation: '.$organization->name);
    }
}

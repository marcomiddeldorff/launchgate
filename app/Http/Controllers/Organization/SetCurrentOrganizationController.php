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
    public function __invoke(Request $request, Organization $organization)
    {
        $request->user()->update([
            'current_organization_id' => $organization->id,
        ]);

        Toast::success('Aktive Organisation: '.$organization->name);
    }
}

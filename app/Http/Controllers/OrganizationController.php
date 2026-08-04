<?php

namespace App\Http\Controllers;

use App\Actions\Organizations\CreateNewOrganization;
use App\Actions\Organizations\UpdateOrganization;
use App\Actions\Organizations\UploadLogoForOrganization;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Http\Requests\Organizations\StoreOrganizationRequest;
use App\Models\Organization;
use App\Support\Toast;
use DateTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $organizations = $request->user()
            ->organizations()
            ->withCount(['memberships', 'invitations'])
            ->with('ownerUser')
            ->get();

        return Inertia::render('organizations/index', [
            'organizations' => $organizations,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $timezones = DateTimeZone::listIdentifiers();

        return Inertia::render('organizations/create', [
            'timezones' => $timezones,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrganizationRequest $request, CreateNewOrganization $createNewOrganization, UploadLogoForOrganization $uploadLogoForOrganization): RedirectResponse
    {
        try {
            $organization = $createNewOrganization->create($request->validated(), $request->user());

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');

                $uploadLogoForOrganization->upload($file, $organization);
            }

            Toast::success('Die Organisation wurde erstellt.');

            return redirect()->route('organizations.index');
        } catch (\Throwable $th) {
            Toast::error('Beim Erstellen der Organisation ist ein Fehler aufgetreten. Bitte versuche es später erneut.');

            return redirect()->back();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization): Response
    {
        $organization->loadCount(['invitations'])->loadMissing(['memberships.user', 'invitations']);

        return Inertia::render('organizations/show', [
            'organization' => $organization,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization): Response
    {
        return Inertia::render('organizations/edit', [
            'organization' => $organization,
            'timezones' => DateTimeZone::listIdentifiers(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateOrganizationRequest $request,
        Organization $organization,
        UpdateOrganization $updateOrganization,
        UploadLogoForOrganization $uploadLogoForOrganization,
    ): RedirectResponse {
        $updateOrganization->update($organization, $request->validated());

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');

            $uploadLogoForOrganization->upload($file, $organization);
        }

        Toast::success('Die Organisation wurde aktualisiert.');

        return redirect()->route('organizations.show', ['organization' => $organization]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Organization $organization): RedirectResponse
    {
        abort_unless($organization->owner_user_id === $request->user()->id, 403);

        $organization->delete();

        Toast::success('Die Organisation wurde gelöscht.');

        return redirect()->route('organizations.index');
    }
}

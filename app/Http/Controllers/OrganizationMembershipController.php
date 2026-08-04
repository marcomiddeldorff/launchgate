<?php

namespace App\Http\Controllers;

use App\Actions\Invitations\CreateNewInvitation;
use App\Actions\OrganizationMemberships\UpdateMembership;
use App\Enums\OrganizationMembershipRole;
use App\Exceptions\InvitationForOrganizationAlreadyExistsException;
use App\Exceptions\MemberWithEmailAlreadyExistsInOrganizationException;
use App\Http\Requests\OrganizationMembership\InviteUserRequest;
use App\Http\Requests\OrganizationMembership\UpdateMembershipRequest;
use App\Models\Invitation;
use App\Models\Organization;
use App\Models\OrganizationMembership;
use App\Models\User;
use App\Notifications\InviteUserToOrganizationNotification;
use App\Support\Toast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;

class OrganizationMembershipController extends Controller
{
    public function show(Request $request)
    {
        $token = $request->query('token');

        $invitation = Invitation::forToken($token)
            ->with([
                'organization' => fn ($query) => $query->select(['id', 'name']),
                'invitedByUser' => fn ($query) => $query->select(['id', 'name']),
            ])
            ->firstOrFail();

        $invitation->ensureInvitationIsUsable();

        $user = User::whereEmail($invitation->email)->first();

        return Inertia::render('auth/accept-invitation', [
            'invitation' => $invitation,
            'user' => $user,
        ]);
    }

    public function invite(InviteUserRequest $request, Organization $organization, CreateNewInvitation $createNewInvitation): void
    {
        $validated = $request->validated();

        try {
            $createNewInvitation->create(
                email: $validated['email'],
                role: $validated['role'],
                organization: $organization,
                invitedBy: $request->user(),
            );

            Toast::success('Die Einladung wurde verschickt.');
        } catch (InvitationForOrganizationAlreadyExistsException) {
            Toast::error('Eine Einladung für die angegebene E-Mail Adresse ist bereits vorhanden.');
        } catch (MemberWithEmailAlreadyExistsInOrganizationException) {
            Toast::error('Ein Mitglied mit der angegebenen E-Mail Adresse existiert bereits in der Organisation.');
        }
    }

    public function update(UpdateMembershipRequest $request, Organization $organization, OrganizationMembership $membership, UpdateMembership $updateMembership)
    {
        $updateMembership->update($membership, OrganizationMembershipRole::tryFrom($request->role));

        $membership->loadMissing(['user:id,name']);

        Toast::success('Die Rolle des Mitglieds '.$membership->user->name.' wurde aktualisiert.');
    }

    /**
     * @throws \HttpException
     */
}

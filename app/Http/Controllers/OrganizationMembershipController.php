<?php

namespace App\Http\Controllers;

use App\Actions\OrganizationMemberships\UpdateMembership;
use App\Enums\OrganizationMembershipRole;
use App\Http\Requests\OrganizationMembership\InviteUserRequest;
use App\Http\Requests\OrganizationMembership\UpdateMembershipRequest;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\UserResource;
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

        $this->ensureInvitationIsUsable($invitation);

        $user = User::whereEmail($invitation->email)->first();

        return Inertia::render('auth/accept-invitation', [
            'invitation' => new InvitationResource($invitation)->resolve(),
            'user' => $user ? new UserResource($user) : null,
        ]);
    }

    public function invite(InviteUserRequest $request, Organization $organization): void
    {
        $validated = $request->validated();

        // Ensure the email address has not been already invited to this organization.
        if ($organization->invitations()->whereEmail($validated['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => 'Es existiert bereits eine Einladung für diese E-Mail-Adresse.',
            ]);
        }

        // Ensure the email is not already a member of this organization.
        if ($organization->memberships()->whereHas('user', fn ($query) => $query->whereEmail($validated['email']))->exists()) {
            throw ValidationException::withMessages([
                'email' => 'Dieser Benutzer ist bereits Mitglied dieser Organisation.',
            ]);
        }

        $plainToken = Str::random(64);

        $invitation = $organization->invitations()->create([
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token_hash' => Invitation::hashToken($plainToken),
            'expires_at' => now()->addMinutes(30),
            'invited_by_user_id' => $request->user()->id,
        ]);

        Notification::route('mail', $validated['email'])
            ->notify(new InviteUserToOrganizationNotification($invitation, $plainToken, $request->user()));

        Toast::success('Die Einladung wurde erfolgreich verschickt.');
    }

    public function update(UpdateMembershipRequest $request, Organization $organization, OrganizationMembership $membership, UpdateMembership $updateMembership)
    {
        $updateMembership->update($membership, OrganizationMembershipRole::tryFrom($request->role));

        $membership->loadMissing(['user:id,name']);

        Toast::success('Die Rolle des Mitglieds '. $membership->user->name . ' wurde aktualisiert.');
    }

    /**
     * @throws \HttpException
     */
    private function ensureInvitationIsUsable(
        Invitation $invitation,
    ): void {
        if ($invitation->isAccepted()) {
            throw new HttpException(
                410,
                'Diese Einladung wurde bereits angenommen.',
            );
        }

        if ($invitation->isExpired()) {
            throw new HttpException(
                410,
                'Diese Einladung ist abgelaufen.',
            );
        }
    }
}

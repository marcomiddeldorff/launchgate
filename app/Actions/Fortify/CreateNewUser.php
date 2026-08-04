<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\OrganizationMembershipStatus;
use App\Models\Invitation;
use App\Models\User;
use App\Support\Toast;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): ?User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'invitationId' => ['nullable', 'exists:invitations,id'],
        ])->validate();

        try {
            return DB::transaction(function () use ($input) {
                $user = User::create([
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'password' => $input['password'],
                ]);

                $this->createMembershipForProject($user, $input['invitationId'] ?? null);
                $this->createMembershipForOrganization($user, $input['invitationId'] ?? null);

                return $user;
            });
        } catch (\Throwable $th) {
            report($th);
            Toast::error('Beim Erstellen des Benutzers ist ein Fehler aufgetreten. Bitte versuche es erneut.');
            return null;
        }
    }

    private function createMembershipForProject(User $user, ?string $invitationId): void
    {
        $invitation = Invitation::find($invitationId);

        if (is_null($invitation?->project_id)) {
            return;
        }

        if ($invitation->isExpired()) {
            Toast::error('Diese Einladung ist abgelaufen.');
            return;
        }

        $invitation->project->members()->create([
            'user_id' => $user->id,
            'role' => $invitation->role,
            'can_approve' => false,
            'can_view_internal_comments' => false,
            'joined_at' => now(),
        ]);

        $invitation->delete();

        $user->update([
            'email_verified_at' => now(),
        ]);
    }

    private function createMembershipForOrganization(User $user, ?string $invitationId): void
    {
        $invitation = Invitation::find($invitationId);

        // Only create an organization membership if the project id has not been set.
        if (! is_null($invitation?->project_id)) {
            return;
        }

        if ($invitation && ! $invitation->isExpired()) {
            $invitation->loadMissing('organization');


            // Create the membership for the user.
            $invitation->organization->memberships()->create([
                'user_id' => $user->id,
                'role' => $invitation->role,
                'status' => OrganizationMembershipStatus::ACTIVE->value,
                'joined_at' => now(),
            ]);

            // Delete invitation after the membership has been created.
            $invitation->delete();

            // Immediately verify the email address.
            $user->update([
                'email_verified_at' => now(),
            ]);
        }
    }
}

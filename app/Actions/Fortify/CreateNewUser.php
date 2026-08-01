<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Invitation;
use App\Models\User;
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
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'invitationId' => ['nullable', 'exists:invitations,id'],
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        $this->createMembershipForOrganization($user, $input['invitationId'] ?? null);

        return $user;
    }

    private function createMembershipForOrganization(User $user, ?string $invitationId): void
    {
        if ($invitationId) {
            $invitation = Invitation::find($invitationId);

            if ($invitation && ! $invitation->isExpired()) {
                $invitation->loadMissing('organization');

                try {
                    DB::transaction(function () use ($invitation, $user) {
                        // Create the membership for the user.
                        $invitation->organization->memberships()->create([
                            'user_id' => $user->id,
                            'role' => $invitation->role,
                            'status' => 'active', // Todo: Replace string with enum value.
                            'joined_at' => now(),
                        ]);

                        // Delete invitation after the membership has been created.
                        $invitation->delete();

                        // Immediately verify the email address.
                        $user->update([
                            'email_verified_at' => now()
                        ]);
                    });
                } catch (\Throwable $th) {
                    // Silence the exception for now.
                }
            }
        }
    }
}

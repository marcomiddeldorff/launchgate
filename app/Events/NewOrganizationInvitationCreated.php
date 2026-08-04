<?php

namespace App\Events;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrganizationInvitationCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public readonly Invitation $invitation,
        public readonly string $plainToken,
        public readonly User $user,
    )
    {
        //
    }
}

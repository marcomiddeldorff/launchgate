<?php

namespace App\Events;

use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewProjectInvitationCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public readonly Invitation $invitation,
        public readonly Project $project,
        public readonly string $plainToken,
        public readonly User $user,
    )
    {
        //
    }
}

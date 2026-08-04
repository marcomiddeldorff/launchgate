<?php

namespace App\Listeners;

use App\Events\NewOrganizationInvitationCreated;
use App\Events\NewProjectInvitationCreated;
use App\Notifications\InviteUserToOrganizationNotification;
use App\Notifications\InviteUserToProjectNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class InvitationCreatedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewOrganizationInvitationCreated|NewProjectInvitationCreated $event): void
    {
        if ($event instanceof NewOrganizationInvitationCreated) {
            Notification::route('mail', $event->invitation->email)
                ->notify(new InviteUserToOrganizationNotification($event->invitation, $event->plainToken, $event->user));
        } else if ($event instanceof NewProjectInvitationCreated) {
            Notification::route('mail', $event->invitation->email)
                ->notify(new InviteUserToProjectNotification($event->project, $event->invitation, $event->plainToken, $event->user));
        }
    }
}

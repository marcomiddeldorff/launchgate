<?php

namespace App\Notifications;

use App\Models\Invitation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InviteUserToProjectNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly Project $project,
        private readonly Invitation $invitation,
        private readonly string $plainToken,
        private readonly User $user,
    )
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('project.invitations.show', [
            'token' => $this->plainToken,
            'project' => $this->project->id,
        ]);

        return (new MailMessage)
            ->subject('Ihre Einladung zu dem Projekt '.$this->project->name)
            ->greeting('Hallo')
            ->line('Sie wurden von '.$this->user->name.' eingeladen, dem Projekt '.$this->project->name.' beizutreten.')
            ->line('Bitte klicken Sie auf den nachfolgenden Button, um die Einladung anzunehmen und, falls erforderlich, ein Benutzerkonto bei LaunchGate zu erstellen.')
            ->action('Einladung annehmen', $url)
            ->salutation('Mit freundlichen Grüßen');
    }
}

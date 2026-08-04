<?php

namespace App\Notifications;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class InviteUserToOrganizationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private Invitation $invitation,
        private string $plainToken,
        private User $user,
    ) {
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
        $acceptanceUrl = route('invitations.show', [
            'token' => $this->plainToken,
        ]);

        return (new MailMessage)
            ->subject('Ihre Einladung zu '.$this->invitation->organization->name)
            ->greeting('Hallo')
            ->line('Sie wurden von '.$this->user->name.' eingeladen, der Organisation '.$this->invitation->organization->name.' beizutreten. Bitte klicken Sie auf den folgenden Button, um die Einladung anzunehmen.')
            ->action('Einladung annehmen', $acceptanceUrl)
            ->salutation('Mit freundlichen Grüßen');
    }
}

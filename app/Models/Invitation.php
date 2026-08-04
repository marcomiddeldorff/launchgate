<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Symfony\Component\HttpKernel\Exception\HttpException;

#[Fillable('organization_id', 'project_id', 'email', 'role', 'token_hash', 'expires_at', 'accepted_at', 'invited_by_user_id')]
#[Hidden('token_hash', 'invited_by_user_id')]
class Invitation extends Model
{
    use HasUuids;

    /**
     * @var list<string>
     */
    protected $appends = [
        'is_expired',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'immutable_datetime',
            'accepted_at' => 'immutable_datetime',
        ];
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->isExpired();
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function invitedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by_user_id');
    }

    public static function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    public function scopeForToken(Builder $query, string $token): Builder
    {
        return $query->where(
            'token_hash',
            self::hashToken($token),
        );
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isAccepted(): bool
    {
        return $this->accepted_at !== null;
    }

    public function ensureInvitationIsUsable(
    ): void {
        if ($this->isAccepted()) {
            throw new HttpException(
                400,
                'Diese Einladung wurde bereits angenommen.',
            );
        }

        if ($this->isExpired()) {
            throw new HttpException(
                400,
                'Diese Einladung ist abgelaufen.',
            );
        }
    }
}

<?php

namespace App\Models;

use App\Enums\OrganizationMembershipStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable('name', 'slug', 'logo_path', 'default_locale', 'timezone', 'owner_user_id', 'deleted_at')]
class Organization extends Model
{
    use HasUuids;

    protected $appends = [
        'logo_url',
    ];

    public function ownerUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(OrganizationMembership::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function isOwner(?string $userId = null): bool
    {
        return $this->owner_user_id === ($userId ?: auth()->id());
    }

    public function isMember(?string $userId = null): bool
    {
        return $this->memberships()
            ->whereStatus(OrganizationMembershipStatus::ACTIVE->value)
            ->whereUserId($userId ?: auth()->id())
            ->exists();
    }

    public function hasRole(User $user, string|array $roles): bool
    {
        if ($this->isOwner($user->id)) {
            return true;
        }

        if (! $this->isMember($user->id)) {
            return false;
        }

        $membership = $this->memberships()->where('user_id', $user->id)->first();

        return is_string($roles)
            ? $membership->role === $roles
            : in_array($membership->role, $roles);
    }

    public function getLogoUrlAttribute(): ?string
    {
        if ($this->logo_path && Storage::disk('public')->exists($this->logo_path)) {
            return asset('storage/'.$this->logo_path);
        }

        return null;
    }
}

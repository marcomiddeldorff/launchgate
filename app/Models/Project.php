<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Traits\OrganizationScoped;
use Illuminate\Console\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('organization_id', 'client_id', 'name', 'slug', 'description', 'status', 'default_locale', 'timezone', 'repository_url', 'project_manager_user_id', 'archived_at')]
class Project extends Model
{
    use HasUuids, OrganizationScoped;

    protected function casts(): array
    {
        return [
            'archived_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function projectManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'project_manager_user_id');
    }

    public function releases(): HasMany
    {
        return $this->hasMany(Release::class);
    }

    public function environments(): HasMany
    {
        return $this->hasMany(Environment::class)
            ->orderBy('name');
    }

    public function members(): HasMany
    {
        return $this->hasMany(ProjectMembership::class);
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class);
    }

    public function archive(): void
    {
        $this->archived_at = now();
        $this->status = ProjectStatus::Archived->value;
        $this->save();

        // Todo: Add activity logging
    }
}

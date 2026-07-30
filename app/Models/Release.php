<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('organization_id', 'project_id', 'environment_id', 'name', 'version', 'description', 'scope', 'status', 'risk_level', 'test_starts_at', 'test_ends_at', 'planned_go_live_at', 'approved_at', 'deployed_at', 'completed_at', 'cancelled_at', 'project_manager_user_id', 'known_limitations', 'current_build_id')]
class Release extends Model
{
    use HasUuids;

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function environment(): BelongsTo
    {
        return $this->belongsTo(Environment::class);
    }

    public function projectManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'project_manager_user_id');
    }

    public function currentBuild(): BelongsTo
    {
        return $this->belongsTo(ReleaseBuild::class, 'current_build_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('organization_id', 'name', 'slug', 'logo_path', 'reference', 'primary_domain', 'notes', 'status', 'archived_at')]
class Client extends Model
{
    use HasUuids;

    protected $appends = [
        'logo_url',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function getLogoUrlAttribute(): string
    {
        // Todo: Add logic to return public logo url.
        return '';
    }
}

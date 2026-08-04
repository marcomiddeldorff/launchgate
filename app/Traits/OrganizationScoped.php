<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait OrganizationScoped
{
    public function scopeForCurrentOrganization(Builder $query): Builder
    {
        return $query->whereOrganizationId(auth()->user()->current_organization_id);
    }
}

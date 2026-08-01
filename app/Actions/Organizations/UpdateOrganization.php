<?php

namespace App\Actions\Organizations;

use App\Models\Organization;

class UpdateOrganization
{
    public function update(Organization $organization, array $data): Organization
    {
        $organization->update([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'timezone' => $data['timezone'],
            'default_locale' => $data['default_locale'],
        ]);

        return $organization;
    }
}

<?php

namespace App\Actions\OrganizationMemberships;

use App\Enums\OrganizationMembershipRole;
use App\Models\OrganizationMembership;

class UpdateMembership
{
    public function update(OrganizationMembership $membership, OrganizationMembershipRole $role): void
    {
        $membership->update([
            'role' => $role->value,
        ]);
    }
}

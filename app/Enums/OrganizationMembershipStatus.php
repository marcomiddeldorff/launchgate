<?php

namespace App\Enums;

enum OrganizationMembershipStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}

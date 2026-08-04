<?php

namespace App\Enums;

enum OrganizationMembershipRole: string
{
    case Admin = 'admin';
    case ProjectManager = 'project_manager';
    case Developer = 'developer';
    case Viewer = 'viewer';
}

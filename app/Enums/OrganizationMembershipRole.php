<?php

namespace App\Enums;

enum OrganizationMembershipRole: string
{
    case Owner = 'owner';
    case ProjectManager = 'project_manager';
    case Developer = 'developer';
    case ClientTester = 'client_tester';
    case Approver = 'approver';
}

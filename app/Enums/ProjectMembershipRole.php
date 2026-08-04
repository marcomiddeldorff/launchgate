<?php

namespace App\Enums;

enum ProjectMembershipRole: string
{
    case ProjectManager = 'project_manager';
    case Developer = 'developer';
    case ClientTester = 'client_tester';
    case Approver = 'approver';
}

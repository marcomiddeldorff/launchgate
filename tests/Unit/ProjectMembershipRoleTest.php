<?php

use App\Enums\ProjectMembershipRole;

it('defines exactly the supported project membership roles', function () {
    $values = array_map(
        fn (ProjectMembershipRole $role) => $role->value,
        ProjectMembershipRole::cases(),
    );

    expect($values)->toBe([
        'project_manager',
        'developer',
        'client_tester',
        'approver',
    ]);
});

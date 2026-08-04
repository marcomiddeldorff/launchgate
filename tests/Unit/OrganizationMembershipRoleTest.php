<?php

use App\Enums\OrganizationMembershipRole;

it('defines exactly the supported organization membership roles', function () {
    $values = array_map(
        fn (OrganizationMembershipRole $role) => $role->value,
        OrganizationMembershipRole::cases(),
    );

    expect($values)->toBe([
        'admin',
        'project_manager',
        'developer',
        'viewer',
    ]);
});

it('no longer exposes the removed roles', function () {
    expect(OrganizationMembershipRole::tryFrom('owner'))->toBeNull()
        ->and(OrganizationMembershipRole::tryFrom('client_tester'))->toBeNull()
        ->and(OrganizationMembershipRole::tryFrom('approver'))->toBeNull();
});

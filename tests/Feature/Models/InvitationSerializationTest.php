<?php

use App\Models\Invitation;

it('exposes is_expired and expires_at in snake_case, hiding secrets', function () {
    $invitation = new Invitation([
        'email' => 'test@example.com',
        'role' => 'admin',
        'expires_at' => now()->addDay(),
    ]);
    $invitation->token_hash = 'secret-hash';
    $invitation->invited_by_user_id = 'user-id';

    $array = $invitation->toArray();

    expect($array)
        ->toHaveKeys(['email', 'role', 'expires_at', 'is_expired'])
        ->and($array['is_expired'])->toBeFalse()
        ->and($array)->not->toHaveKey('token_hash')
        ->and($array)->not->toHaveKey('invited_by_user_id');
});

it('reports is_expired as true for a past expiry', function () {
    $invitation = new Invitation([
        'expires_at' => now()->subDay(),
    ]);

    expect($invitation->toArray()['is_expired'])->toBeTrue();
});

<?php

use App\Models\User;
use App\Support\Toast;
use Illuminate\Support\Facades\Route;

it('flashes an on-brand toast for the next Inertia response', function () {
    Route::middleware('web')->get('/__toast-flash', function () {
        Toast::success('Der Eintrag wurde erstellt', 'Alles klar.');

        return back();
    });

    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user)
        ->from('/dashboard')
        ->get('/__toast-flash')
        ->assertInertiaFlash('toast', [
            'type' => 'success',
            'message' => 'Der Eintrag wurde erstellt',
            'description' => 'Alles klar.',
        ]);
});

it('omits an empty description from the flashed toast', function () {
    Route::middleware('web')->get('/__toast-flash-plain', function () {
        Toast::info('Nur eine Information');

        return back();
    });

    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user)
        ->from('/dashboard')
        ->get('/__toast-flash-plain')
        ->assertInertiaFlash('toast', [
            'type' => 'info',
            'message' => 'Nur eine Information',
        ]);
});

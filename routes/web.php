<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\Organization\SetCurrentOrganizationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OrganizationMembershipController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/invitation', [OrganizationMembershipController::class, 'show'])
    ->name('invitations.show');
Route::inertia('invitations/accept', 'auth/accept-invitation')
    ->name('invitations.accept');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::inertia('onboarding', 'onboarding/index')->name('onboarding');

    // Clients
    Route::resource('clients', ClientController::class);
    Route::resource('organizations', OrganizationController::class);
    Route::post('organizations/{organization}/set-current', SetCurrentOrganizationController::class)
        ->name('organizations.set-current');
    Route::post('organizations/{organization}/memberships/invite', [OrganizationMembershipController::class, 'invite'])
        ->name('organizations.memberships.store');
    Route::put('organizations/{organization}/memberships/{membership}', [OrganizationMembershipController::class, 'update'])
        ->name('organizations.memberships.update');
    //Route::

    // Projects
    Route::inertia('projects', 'projects/index')->name('projects.index');
    Route::inertia('projects/create', 'projects/create')->name('projects.create');
    Route::get('projects/{project}/members', fn (string $project) => inertia('projects/settings', ['id' => $project, 'tab' => 'members']))
        ->name('projects.members');
    Route::get('projects/{project}/environments', fn (string $project) => inertia('projects/settings', ['id' => $project, 'tab' => 'environments']))
        ->name('projects.environments');
    Route::get('projects/{project}/settings', fn (string $project) => inertia('projects/settings', ['id' => $project, 'tab' => 'general']))
        ->name('projects.settings');
    Route::get('projects/{project}', fn (string $project) => inertia('projects/show', ['id' => $project]))
        ->name('projects.show');

    // Releases
    Route::inertia('releases', 'releases/index')->name('releases.index');
    Route::inertia('releases/create', 'releases/create')->name('releases.create');
    Route::get('releases/{release}/runner', fn (string $release) => inertia('releases/runner', ['id' => $release]))
        ->name('releases.runner');
    Route::get('releases/{release}/report', fn (string $release) => inertia('releases/report', ['id' => $release]))
        ->name('releases.report');
    Route::get('releases/{release}', fn (string $release) => inertia('releases/show', ['id' => $release]))
        ->name('releases.show');

    // Reviews
    Route::inertia('my-reviews', 'reviews/mine')->name('reviews.mine');

    // Issues
    Route::inertia('issues', 'issues/index')->name('issues.index');
    Route::get('issues/{issue}', fn (string $issue) => inertia('issues/show', ['id' => $issue]))
        ->name('issues.show');

    // Approvals
    Route::inertia('approvals', 'approvals/index')->name('approvals.index');
    Route::get('approvals/{approval}', fn (string $approval) => inertia('approvals/show', ['id' => $approval]))
        ->name('approvals.show');

    // Templates & members
    Route::inertia('templates', 'templates/index')->name('templates.index');
    Route::inertia('members', 'members/index')->name('members.index');

    // Organization-level settings
    Route::get('settings/organization', fn () => inertia('organization-settings/index', ['tab' => 'organization']))
        ->name('org-settings.general');
    Route::get('settings/billing', fn () => inertia('organization-settings/index', ['tab' => 'billing']))
        ->name('org-settings.billing');
    Route::get('settings/notifications', fn () => inertia('organization-settings/index', ['tab' => 'notifications']))
        ->name('org-settings.notifications');
});

require __DIR__.'/settings.php';

<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\EnvironmentController;
use App\Http\Controllers\Organization\SetCurrentOrganizationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OrganizationMembershipController;
use App\Http\Controllers\ProjectController;
use \App\Http\Controllers\Projects;
use App\Http\Middleware\RequireOrganizationMiddleware;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::inertia('/', 'welcome')->name('home');

Route::get('/invitation', [OrganizationMembershipController::class, 'show'])
    ->name('invitations.show');
Route::inertia('invitations/accept', 'auth/accept-invitation')
    ->name('invitations.accept');

Route::get('project/{project}/invitation', Projects\ShowProjectInvitationController::class)
    ->name('project.invitations.show');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::inertia('onboarding', 'onboarding/index')->name('onboarding');

    Route::resource('organizations', OrganizationController::class);
    Route::post('organizations/{organization}/set-current', SetCurrentOrganizationController::class)
        ->name('organizations.set-current');
    Route::post('organizations/{organization}/memberships/invite', [OrganizationMembershipController::class, 'invite'])
        ->name('organizations.memberships.store');
    Route::put('organizations/{organization}/memberships/{membership}', [OrganizationMembershipController::class, 'update'])
        ->name('organizations.memberships.update');
    // Route::

    Route::middleware(RequireOrganizationMiddleware::class)->group(function () {
        Route::resource('clients', ClientController::class);


        Route::resource('projects', ProjectController::class);
        Route::get('projects/{project}/settings', Projects\SettingsProjectController::class);
        Route::get('projects/{project}/members', Projects\MembersProjectController::class);
        Route::post('projects/{project}/members/add', Projects\AddMemberToProjectController::class);
        Route::put('projects/{project}/archive', Projects\ArchiveProjectController::class);

        Route::resource('projects.environments', EnvironmentController::class)
            ->except(['show']);
    });

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

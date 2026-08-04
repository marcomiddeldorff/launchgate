<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Models\Project;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user()?->loadMissing([
            'currentOrganization',
            'organizationMemberships:id,organization_id,user_id,role',
        ]);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'globalOrganizations' => [
                ...$user?->organizations()->select(['id', 'name'])->get() ?? [],
                ...Organization::query()
                    ->whereHas(
                        'memberships',
                        fn (Builder $query) => $query
                            ->where('user_id', $user?->id),
                    )
                    ->orWhereHas(
                        'projects.members',
                        fn (Builder $query) => $query
                            ->where('user_id', $user?->id),
                    )
                    ->distinct()
                    ->get(),
            ],
            'currentOrganization' => $user?->currentOrganization,
            'currentOrganizationMembership' => $user?->organizationMemberships
                ->where('organization_id', $user->current_organization_id)
                ->first(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}

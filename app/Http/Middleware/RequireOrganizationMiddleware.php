<?php

namespace App\Http\Middleware;

use App\Support\Toast;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireOrganizationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && ! $request->user()->current_organization_id) {

            Toast::warning('Erstellen Sie zunächst eine Organisation und wählen Sie diese aus.');

            return redirect()->route('organizations.index');
        }

        return $next($request);
    }
}

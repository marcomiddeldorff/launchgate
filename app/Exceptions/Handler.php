<?php

namespace App\Exceptions;

use App\Support\Toast;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Eine Liste der Ausnahmearten, die nicht gemeldet werden sollen.
     */
    protected $dontReport = [
        //
    ];

    /**
     * Eine Liste von Eingabefeldern, die nie bei einer Validierungsausnahme geflasht werden.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Registrierung der Callback-basierten Ausnahmenbehandlung.
     */
    public function register(): void {}

    public function render($request, Throwable $e): mixed
    {
        if ($e instanceof AuthorizationException) {
            Toast::error($e->getMessage());

            return $this->redirectToPrevious();
        }

        if (config('app.debug')) {
            return parent::render($request, $e);
        }

        if ($request->expectsJson()) {
            return $this->renderJsonResponses($request, $e);
        }

        return $this->renderHttpResponses($request, $e);
    }

    protected function renderJsonResponses($request, Throwable $e)
    {
        return parent::render($request, $e);
    }

    protected function renderHttpResponses(Request $request, Throwable $e)
    {
        return $this->renderErrorPage($request, $e);
    }

    protected function renderErrorPage(Request $request, $e): \Inertia\Response|Response
    {
        $returnData = [
            'locale' => app()->getLocale(),
        ];

        $response = parent::render($request, $e);

        return match ($response->getStatusCode()) {
            404 => Inertia::render('errors/404', $returnData),
            400 => Inertia::render('errors/400', $returnData),
            401 => Inertia::render('errors/401', $returnData),
            403 => Inertia::render('errors/403', $returnData),
            405 => Inertia::render('errors/405', $returnData),
            408 => Inertia::render('errors/408', $returnData),
            419 => Inertia::render('errors/419', $returnData),
            429 => Inertia::render('errors/429', $returnData),
            502 => Inertia::render('errors/502', $returnData),
            504 => Inertia::render('errors/504', $returnData),
            302 => $response,
            default => Inertia::render('errors/500', $returnData),
        };
    }

    protected function redirectToPrevious()
    {
        $previous = url()->previous();

        if ($previous && $previous !== url()->current()) {
            return redirect()->to($previous);
        }

        return redirect()->route('dashboard');
    }
}

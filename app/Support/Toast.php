<?php

namespace App\Support;

use Inertia\Inertia;

/**
 * Flash an on-brand toast notification to the next Inertia response.
 *
 * The message is delivered via Inertia's flash data (auto-persisted across a
 * redirect) and rendered by the frontend bridge in
 * `resources/js/hooks/use-flash-toast.ts` using the styled sonner toaster.
 *
 * @example
 * Toast::success('Der Eintrag wurde erstellt');
 *
 * return back();
 * @example
 * Toast::error('Speichern fehlgeschlagen', 'Bitte versuche es erneut.');
 *
 * return to_route('clients.index');
 */
class Toast
{
    /** Success message, e.g. "Der Eintrag wurde erstellt". */
    public static function success(string $message, ?string $description = null): void
    {
        self::flash('success', $message, $description);
    }

    /** Error / failure message. */
    public static function error(string $message, ?string $description = null): void
    {
        self::flash('error', $message, $description);
    }

    /** Warning or pending-decision message. */
    public static function warning(string $message, ?string $description = null): void
    {
        self::flash('warning', $message, $description);
    }

    /** Neutral informational message. */
    public static function info(string $message, ?string $description = null): void
    {
        self::flash('info', $message, $description);
    }

    /**
     * Flash the toast payload for the next Inertia response.
     *
     * @param  'success'|'error'|'warning'|'info'  $type
     */
    protected static function flash(string $type, string $message, ?string $description): void
    {
        Inertia::flash('toast', array_filter([
            'type' => $type,
            'message' => $message,
            'description' => $description,
        ], static fn ($value): bool => $value !== null));
    }
}

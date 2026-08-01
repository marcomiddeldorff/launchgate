import { toast } from 'sonner';

/**
 * Ergonomic, on-brand toast helper for status messages.
 *
 * @example
 * notify.success('Der Eintrag wurde erstellt');
 * notify.error('Speichern fehlgeschlagen', { description: 'Bitte erneut versuchen.' });
 * notify.promise(save(), { loading: 'Speichern …', success: 'Gespeichert', error: 'Fehlgeschlagen' });
 *
 * Styling and animation live in `components/ui/sonner.tsx`.
 */
type ToastOptions = Parameters<typeof toast.success>[1];

export const notify = {
    /** Erfolgsmeldung, z. B. "Der Eintrag wurde erstellt". */
    success: (message: string, options?: ToastOptions) =>
        toast.success(message, options),
    /** Fehlermeldung. */
    error: (message: string, options?: ToastOptions) =>
        toast.error(message, options),
    /** Warnung / ausstehende Entscheidung. */
    warning: (message: string, options?: ToastOptions) =>
        toast.warning(message, options),
    /** Neutrale Information. */
    info: (message: string, options?: ToastOptions) =>
        toast.info(message, options),
    /** Neutrale Nachricht ohne Status-Icon. */
    message: (message: string, options?: ToastOptions) =>
        toast(message, options),
    /** Ladeanzeige (mit Spinner) für laufende Aktionen. */
    loading: (message: string, options?: ToastOptions) =>
        toast.loading(message, options),
    /** Bindet einen Toast an einen Promise (loading → success/error). */
    promise: toast.promise,
    /** Schließt einen (oder alle) Toasts. */
    dismiss: toast.dismiss,
};

export { toast };

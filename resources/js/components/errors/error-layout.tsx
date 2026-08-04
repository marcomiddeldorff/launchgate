import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { dashboard, home } from '@/routes';

type ErrorLayoutProps = {
    /** HTTP status code shown prominently. */
    status: number;
    /** Icon representing the error category. */
    icon: LucideIcon;
    /** Short headline. */
    title: string;
    /** Explanatory text for the user. */
    description: string;
    /** Optional accent colour token for the icon/badge (defaults to primary). */
    tone?: 'primary' | 'warning' | 'danger';
};

const toneClasses: Record<
    NonNullable<ErrorLayoutProps['tone']>,
    { badge: string; icon: string }
> = {
    primary: { badge: 'bg-primary/10', icon: 'text-primary' },
    warning: { badge: 'bg-warning/10', icon: 'text-warning' },
    danger: { badge: 'bg-danger/10', icon: 'text-danger' },
};

/**
 * Shared full-screen layout for all HTTP error pages. Renders standalone so it
 * works whether or not the user is authenticated.
 */
export default function ErrorLayout({
    status,
    icon: Icon,
    title,
    description,
    tone = 'primary',
}: ErrorLayoutProps) {
    const { auth } = usePage().props;
    const tones = toneClasses[tone];

    return (
        <>
            <Head title={`${status} – ${title}`} />
            <div className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
                {/* Subtle brand backdrop — matches the auth screens. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_70%)]"
                />

                <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 font-semibold"
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <Rocket className="size-5" />
                        </span>
                        <span className="text-lg tracking-tight">
                            LaunchGate
                        </span>
                    </Link>
                    <ThemeToggle />
                </header>

                <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
                    <div className="w-full max-w-md text-center">
                        <span
                            className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${tones.badge}`}
                        >
                            <Icon className={`size-8 ${tones.icon}`} />
                        </span>

                        <p className="mt-6 text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl">
                            {status}
                        </p>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance">
                            {title}
                        </h1>
                        <p className="mt-3 text-pretty text-muted-foreground">
                            {description}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft /> Zurück
                            </Button>
                            <Button asChild>
                                <Link href={auth?.user ? dashboard() : home()}>
                                    {auth?.user
                                        ? 'Zum Dashboard'
                                        : 'Zur Startseite'}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>

                <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
                    © {new Date().getFullYear()} LaunchGate
                </footer>
            </div>
        </>
    );
}

import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_color-mix(in_oklch,_var(--color-primary)_18%,_transparent),_transparent_45%),radial-gradient(circle_at_top_right,_color-mix(in_oklch,_var(--color-warning)_14%,_transparent),_transparent_40%)]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--color-border)_65%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--color-border)_65%,transparent)_1px,transparent_1px)] [background-size:72px_72px] opacity-40"
                />
                <div className="relative flex min-h-screen w-full flex-col">
                    {children}
                </div>
            </div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}

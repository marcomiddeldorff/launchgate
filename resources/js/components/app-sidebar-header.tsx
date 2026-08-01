import { Bell, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { CommandMenu } from '@/components/layout/command-menu';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setCommandOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => setCommandOpen(true)}
                    className={cn(
                        'inline-flex h-9 items-center gap-2 rounded-md border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    )}
                    aria-label="Suchen"
                >
                    <Search className="size-4" />
                    <span className="hidden sm:inline">Suchen</span>
                    <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                        ⌘K
                    </kbd>
                </button>

                <button
                    type="button"
                    className="relative inline-flex size-9 items-center justify-center rounded-md outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
                    aria-label="Benachrichtigungen"
                >
                    <Bell className="size-4" />
                    <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-danger" />
                </button>

                <ThemeToggle />
            </div>

            <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
        </header>
    );
}

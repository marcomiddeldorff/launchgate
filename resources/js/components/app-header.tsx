import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserAvatar } from '@/components/user-avatar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useAppContext } from '@/hooks/use-app-context';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import {
    manageNav,
    primaryNav


} from '@/lib/navigation';
import type {AppNavGroup, AppNavItem} from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

function isActive(
    currentUrl: string,
    href: string,
    matchPrefix?: string,
): boolean {
    return matchPrefix
        ? currentUrl.startsWith(matchPrefix)
        : currentUrl === href;
}

function filterGroup(
    group: AppNavGroup,
    abilities: ReturnType<typeof useAppContext>['abilities'],
): AppNavGroup {
    return {
        ...group,
        items: group.items.filter((item) => !item.can || item.can(abilities)),
    };
}

function HeaderTextLink({
    item,
    currentUrl,
}: {
    item: AppNavItem;
    currentUrl: string;
}) {
    const active = isActive(currentUrl, item.href, item.matchPrefix);

    return (
        <Link
            href={item.href}
            prefetch
            className={cn(
                'text-sm font-medium transition-colors',
                active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
            )}
        >
            {item.title}
        </Link>
    );
}

function HeaderTextMenu({
    label,
    items,
    currentUrl,
}: {
    label: string;
    items: AppNavItem[];
    currentUrl: string;
}) {
    const active = items.some((item) =>
        isActive(currentUrl, item.href, item.matchPrefix),
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                        active
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    <span>{label}</span>
                    <ChevronDown className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                        <Link href={item.href} prefetch>
                            {item.title}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MobileNavLink({
    item,
    currentUrl,
}: {
    item: AppNavItem;
    currentUrl: string;
}) {
    const active = isActive(currentUrl, item.href, item.matchPrefix);

    return (
        <Link
            href={item.href}
            prefetch
            className={cn(
                'block rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent',
            )}
        >
            {item.title}
        </Link>
    );
}

export function AppHeader({ breadcrumbs = [] }: Props) {
    const { auth } = usePage().props;
    const { abilities } = useAppContext();
    const { currentUrl } = useCurrentUrl();
    const initials = useInitials();

    const visiblePrimary = filterGroup(primaryNav, abilities);
    const visibleManage = filterGroup(manageNav, abilities);

    const directTitles = [
        'Übersicht',
        'Kunden',
        'Projekte',
        'Releases',
        'Meine Prüfungen',
        'Issues',
        'Freigaben',
        'Vorlagen',
    ];
    const directItems = visiblePrimary.items.filter((item) =>
        directTitles.includes(item.title),
    );
    const moreItems = [
        ...visiblePrimary.items.filter(
            (item) => !directTitles.includes(item.title),
        ),
        ...visibleManage.items,
    ];

    return (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between border-b border-border/70">
                    <div className="flex items-center gap-3">
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Menu className="size-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[88vw] max-w-sm border-border/80 bg-card/95 px-0"
                                >
                                    <SheetHeader className="border-b border-border/70 px-6 pb-4 text-left">
                                        <SheetTitle className="flex items-center gap-3 text-base">
                                            <span className="flex size-10 items-center justify-center rounded-2xl">
                                                <AppLogoIcon />
                                            </span>
                                            <span className="font-semibold">
                                                LaunchGate
                                            </span>
                                        </SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-6 px-6 py-6">
                                        {[visiblePrimary, visibleManage]
                                            .filter(
                                                (group) =>
                                                    group.items.length > 0,
                                            )
                                            .map((group) => (
                                                <div
                                                    key={group.label}
                                                    className="space-y-3"
                                                >
                                                    <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                                        {group.label}
                                                    </p>
                                                    <div className="space-y-1">
                                                        {group.items.map(
                                                            (item) => (
                                                                <MobileNavLink
                                                                    key={
                                                                        item.title
                                                                    }
                                                                    item={item}
                                                                    currentUrl={
                                                                        currentUrl
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <Link
                            href={dashboard()}
                            prefetch
                            className="flex items-center gap-3"
                        >
                            <span className="flex size-10 items-center justify-center rounded-2xl">
                                <AppLogoIcon />
                            </span>
                            <span className="text-base font-semibold">
                                LaunchGate
                            </span>
                        </Link>

                        {auth.user && (
                            <>
                                <span
                                    aria-hidden
                                    className="mx-1 hidden h-6 w-px bg-border/70 sm:block"
                                />
                                <OrganizationSwitcher />
                            </>
                        )}
                    </div>

                    {auth.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center gap-3 rounded-full px-2 py-1.5 transition-colors hover:bg-accent">
                                    <UserAvatar
                                        user={{
                                            name: auth.user.name,
                                            initials: initials(auth.user.name),
                                            avatarUrl: '',
                                        }}
                                        size="sm"
                                    />
                                    <span className="hidden text-sm font-medium text-foreground sm:inline">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown className="size-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="hidden h-14 items-center gap-8 lg:flex">
                    {directItems.map((item) => (
                        <HeaderTextLink
                            key={item.title}
                            item={item}
                            currentUrl={currentUrl}
                        />
                    ))}
                    {moreItems.length > 0 && (
                        <HeaderTextMenu
                            label="Mehr"
                            items={moreItems}
                            currentUrl={currentUrl}
                        />
                    )}
                </div>

                {breadcrumbs.length > 0 && (
                    <div className="border-t border-border/70 py-3 text-sm text-muted-foreground lg:hidden">
                        <div className="flex flex-wrap items-center gap-2">
                            {breadcrumbs.map((breadcrumb, index) => (
                                <span
                                    key={`${breadcrumb.title}-${index}`}
                                    className="flex items-center gap-2"
                                >
                                    {index > 0 && (
                                        <span className="text-muted-foreground/50">
                                            /
                                        </span>
                                    )}
                                    <span
                                        className={
                                            index === breadcrumbs.length - 1
                                                ? 'font-medium text-foreground'
                                                : undefined
                                        }
                                    >
                                        {breadcrumb.title}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

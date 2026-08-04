import { Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Plus, Settings2 } from 'lucide-react';
import { useState } from 'react';
import setCurrentOrganizationController from '@/actions/App/Http/Controllers/Organization/SetCurrentOrganizationController';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { create, index } from '@/routes/organizations';
import type { Organization } from '@/types';

function OrganizationAvatar({
    organization,
    className,
}: {
    organization: Pick<Organization, 'name' | 'logo_url'>;
    className?: string;
}) {
    const initials = useInitials();

    return (
        <Avatar className={cn('size-8 rounded-lg', className)}>
            {organization.logo_url && (
                <AvatarImage
                    src={organization.logo_url}
                    alt={organization.name}
                    className="rounded-lg"
                />
            )}
            <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                {initials(organization.name)}
            </AvatarFallback>
        </Avatar>
    );
}

/**
 * Header control to switch the organization the user is currently working in.
 *
 * Backed by mock data via {@link useAppContext}; selecting an organization only
 * updates local state for now. Once real shared props exist, the selection can
 * be persisted by posting to the backend from {@link handleSelect}.
 */
export function OrganizationSwitcher() {
    const { globalOrganizations, currentOrganization } = usePage<{
        globalOrganizations: Organization[];
        currentOrganization: Organization | null;
    }>().props;
    const [activeId, setActiveId] = useState<string | null>(
        currentOrganization?.id ?? null,
    );

    const active = currentOrganization;

    function handleSelect(next: Organization): void {
        if (next.id === activeId) {
            return;
        }

        router.post(
            setCurrentOrganizationController.url({ organization: next.id }),
        );

        setActiveId(next.id);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="inline-flex max-w-[15rem] items-center gap-2 rounded-full py-1.5 pr-2 pl-1.5 transition-colors hover:bg-accent"
                >
                    {active ? (
                        <OrganizationAvatar organization={active} />
                    ) : undefined}
                    <span className="hidden min-w-0 flex-col text-left sm:flex">
                        <span className="truncate text-sm font-medium text-foreground">
                            {active?.name ?? 'Organisation auswählen'}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {active?.slug}
                        </span>
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel>Organisation wechseln</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {globalOrganizations.map((item) => (
                    <DropdownMenuItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="gap-2"
                    >
                        <OrganizationAvatar organization={item} />
                        <span className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium">
                                {item.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {item.slug}
                            </span>
                        </span>
                        {item.id === active?.id && (
                            <Check className="ml-auto size-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={index()} className="gap-2">
                        <Settings2 className="size-4 text-muted-foreground" />
                        <span>Organisationen verwalten</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={create()} className="gap-2">
                        <Plus className="size-4 text-muted-foreground" />
                        <span>Neue Organisation</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

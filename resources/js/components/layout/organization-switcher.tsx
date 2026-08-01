import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PlanBadge } from '@/components/status/badges';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { Organization } from '@/types';

function OrgGlyph({
    org,
    className,
}: {
    org: Organization;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground',
                className,
            )}
            aria-hidden
        >
            {org.name.charAt(0)}
        </span>
    );
}

export function OrganizationSwitcher({
    organization,
    organizations,
}: {
    organization: Organization;
    organizations: Organization[];
}) {
    const isMobile = useIsMobile();
    const { state } = useSidebar();
    const [active, setActive] = useState(organization);

    useEffect(() => {}, [active]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent"
                        >
                            <OrgGlyph org={active} />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {active.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {active.memberCount} Mitglieder
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
                        align="start"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'right'
                                  : 'bottom'
                        }
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organisationen
                        </DropdownMenuLabel>
                        {organizations.map((org) => (
                            <DropdownMenuItem
                                key={org.id}
                                onClick={() => setActive(org)}
                                className="gap-2"
                            >
                                <OrgGlyph
                                    org={org}
                                    className="size-6 rounded text-xs"
                                />
                                <span className="flex-1 truncate">
                                    {org.name}
                                </span>
                                <PlanBadge plan={org.plan} size="sm" />
                                {org.id === active.id && (
                                    <Check className="size-4" />
                                )}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2">
                            <span className="flex size-6 items-center justify-center rounded bg-muted">
                                <Plus className="size-4" />
                            </span>
                            Neue Organisation
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

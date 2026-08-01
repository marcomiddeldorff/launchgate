import { Link } from '@inertiajs/react';

import { OrganizationSwitcher } from '@/components/layout/organization-switcher';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppContext } from '@/hooks/use-app-context';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { navGroups } from '@/lib/navigation';

export function AppSidebar() {
    const { organization, organizations, abilities } = useAppContext();
    const { currentUrl } = useCurrentUrl();

    const isActive = (href: string, matchPrefix?: string) =>
        matchPrefix ? currentUrl.startsWith(matchPrefix) : currentUrl === href;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <OrganizationSwitcher
                    organization={organization}
                    organizations={organizations}
                />
            </SidebarHeader>

            <SidebarContent>
                {navGroups.map((group) => {
                    const items = group.items.filter(
                        (item) => !item.can || item.can(abilities),
                    );

                    if (items.length === 0) {
                        return null;
                    }

                    return (
                        <SidebarGroup key={group.label} className="px-2 py-0">
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(
                                                item.href,
                                                item.matchPrefix,
                                            )}
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link href={item.href} prefetch>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

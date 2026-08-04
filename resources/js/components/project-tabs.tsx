import { Link } from '@inertiajs/react';
import environmentController from '@/actions/App/Http/Controllers/EnvironmentController';
import membersProjectController from '@/actions/App/Http/Controllers/Projects/MembersProjectController';
import settingsProjectController from '@/actions/App/Http/Controllers/Projects/SettingsProjectController';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

type ProjectTabsProps = {
    project: Project;
    active: string;
}

export default function ProjectTabs({ project, active }: ProjectTabsProps) {

    const tabs: { id: string; label: string; href: string }[] = [
        {
            id: 'general',
            label: 'Allgemein',
            href: settingsProjectController.url(project.id),
        },
        {
            id: 'members',
            label: 'Mitglieder',
            href: membersProjectController.url(project.id),
        },
        {
            id: 'environments',
            label: 'Umgebungen',
            href: environmentController.index.url(project.id),
        },
    ];

    return (
        <nav
            className="flex gap-1 overflow-x-auto border-b"
            aria-label="Projekteinstellungen"
        >
            {tabs.map((t) => (
                <Link
                    key={t.id}
                    href={t.href}
                    className={cn(
                        '-mb-px border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                        active === t.id
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                    aria-current={active === t.id ? 'page' : undefined}
                >
                    {t.label}
                </Link>
            ))}
        </nav>
    );
}

import { router } from '@inertiajs/react';
import {
    Bug,
    Building2,
    ClipboardCheck,
    FolderKanban,
    LayoutDashboard,
    Rocket,
    Search,
    UserCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { clients, issues, projects, releases } from '@/mocks';
import { dashboard } from '@/routes';
import approvalRoutes from '@/routes/approvals';
import clientRoutes from '@/routes/clients';
import issueRoutes from '@/routes/issues';
import projectRoutes from '@/routes/projects';
import releaseRoutes from '@/routes/releases';
import reviewRoutes from '@/routes/reviews';

type Command = {
    id: string;
    label: string;
    hint: string;
    icon: LucideIcon;
    href: string;
    keywords: string;
};

function buildCommands(): Command[] {
    const nav: Command[] = [
        {
            id: 'nav-dashboard',
            label: 'Übersicht',
            hint: 'Navigation',
            icon: LayoutDashboard,
            href: dashboard.url(),
            keywords: 'dashboard start',
        },
        {
            id: 'nav-clients',
            label: 'Kunden',
            hint: 'Navigation',
            icon: Building2,
            href: clientRoutes.index.url(),
            keywords: 'kunden clients',
        },
        {
            id: 'nav-projects',
            label: 'Projekte',
            hint: 'Navigation',
            icon: FolderKanban,
            href: projectRoutes.index.url(),
            keywords: 'projekte projects',
        },
        {
            id: 'nav-releases',
            label: 'Releases',
            hint: 'Navigation',
            icon: Rocket,
            href: releaseRoutes.index.url(),
            keywords: 'releases',
        },
        {
            id: 'nav-reviews',
            label: 'Meine Prüfungen',
            hint: 'Navigation',
            icon: ClipboardCheck,
            href: reviewRoutes.mine.url(),
            keywords: 'prüfungen reviews tests',
        },
        {
            id: 'nav-issues',
            label: 'Issues',
            hint: 'Navigation',
            icon: Bug,
            href: issueRoutes.index.url(),
            keywords: 'issues probleme fehler',
        },
        {
            id: 'nav-approvals',
            label: 'Freigaben',
            hint: 'Navigation',
            icon: UserCheck,
            href: approvalRoutes.index.url(),
            keywords: 'freigaben approvals',
        },
    ];

    const releaseCmds = releases.map<Command>((r) => ({
        id: `rel-${r.id}`,
        label: `${r.name} · ${r.projectName}`,
        hint: 'Release',
        icon: Rocket,
        href: releaseRoutes.show.url(r.id),
        keywords: `${r.name} ${r.projectName} ${r.clientName}`,
    }));

    const projectCmds = projects.map<Command>((p) => ({
        id: `prj-${p.id}`,
        label: p.name,
        hint: `Projekt · ${p.clientName}`,
        icon: FolderKanban,
        href: projectRoutes.show.url(p.id),
        keywords: `${p.name} ${p.clientName}`,
    }));

    const clientCmds = clients.map<Command>((c) => ({
        id: `cli-${c.id}`,
        label: c.name,
        hint: 'Kunde',
        icon: Building2,
        href: clientRoutes.show.url(c.id),
        keywords: c.name,
    }));

    const issueCmds = issues.map<Command>((i) => ({
        id: `iss-${i.id}`,
        label: `#${i.number} ${i.title}`,
        hint: `Issue · ${i.projectName}`,
        icon: Bug,
        href: issueRoutes.show.url(i.id),
        keywords: `${i.number} ${i.title} ${i.projectName}`,
    }));

    return [
        ...nav,
        ...releaseCmds,
        ...projectCmds,
        ...clientCmds,
        ...issueCmds,
    ];
}

export function CommandMenu({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [query, setQuery] = useState('');
    const commands = useMemo(() => buildCommands(), []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (q === '') {
            return commands.slice(0, 8);
        }

        return commands
            .filter((c) => `${c.label} ${c.keywords}`.toLowerCase().includes(q))
            .slice(0, 12);
    }, [commands, query]);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setQuery('');
        }

        onOpenChange(next);
    };

    const go = (href: string) => {
        handleOpenChange(false);
        router.visit(href);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Suche</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 border-b px-3">
                    <Search className="size-4 text-muted-foreground" />
                    <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Suche nach Releases, Projekten, Kunden, Issues …"
                        className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        aria-label="Suche"
                    />
                </div>
                <ul className="max-h-80 overflow-y-auto p-2">
                    {results.length === 0 ? (
                        <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                            Keine Treffer für „{query}“.
                        </li>
                    ) : (
                        results.map((command) => (
                            <li key={command.id}>
                                <button
                                    type="button"
                                    onClick={() => go(command.href)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent',
                                    )}
                                >
                                    <command.icon className="size-4 shrink-0 text-muted-foreground" />
                                    <span className="flex-1 truncate">
                                        {command.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {command.hint}
                                    </span>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </DialogContent>
        </Dialog>
    );
}

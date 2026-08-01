import { Monitor, Moon, Sun } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const options: { value: Appearance; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Hell', icon: Sun },
    { value: 'dark', label: 'Dunkel', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle() {
    const { appearance, updateAppearance, resolvedAppearance } =
        useAppearance();
    const ActiveIcon = resolvedAppearance === 'dark' ? Moon : Sun;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="inline-flex size-9 items-center justify-center rounded-md outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
                aria-label="Erscheinungsbild ändern"
            >
                <ActiveIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => updateAppearance(option.value)}
                        className={cn(
                            'gap-2',
                            appearance === option.value && 'bg-accent',
                        )}
                    >
                        <option.icon className="size-4" />
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

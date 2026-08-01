import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type Definition = {
    term: ReactNode;
    description: ReactNode;
};

/** Key/value list used across detail pages. */
export function DefinitionList({
    items,
    className,
    columns = 1,
}: {
    items: Definition[];
    className?: string;
    columns?: 1 | 2;
}) {
    return (
        <dl
            className={cn(
                'grid gap-x-6 gap-y-3 text-sm',
                columns === 2 && 'sm:grid-cols-2',
                className,
            )}
        >
            {items.map((item, index) => (
                <div key={index} className="flex flex-col gap-0.5">
                    <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {item.term}
                    </dt>
                    <dd className="font-medium text-pretty">
                        {item.description}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
